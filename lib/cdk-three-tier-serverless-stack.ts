import {
  RemovalPolicy,
  Stack,
  StackProps,
  CfnOutput,
  DockerImage,
} from 'aws-cdk-lib'
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb'
import { Architecture } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { RetentionDays } from 'aws-cdk-lib/aws-logs'
import { Construct } from 'constructs'
import {
  AwsCustomResource,
  AwsCustomResourcePolicy,
  PhysicalResourceId,
} from 'aws-cdk-lib/custom-resources'
import { PolicyStatement } from 'aws-cdk-lib/aws-iam'
import { BlockPublicAccess, Bucket } from 'aws-cdk-lib/aws-s3'
import {
  CorsHttpMethod,
  HttpApi,
  HttpMethod,
} from '@aws-cdk/aws-apigatewayv2-alpha'
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha'
import {
  Distribution,
  OriginAccessIdentity,
  ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront'
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins'
import * as Lambda from '@aws-cdk/aws-lambda'
import { Dashboard } from "@aws-cdk/aws-cloudwatch";

import { execSync, ExecSyncOptions } from 'child_process'
import { join } from 'path'
import { copySync } from 'fs-extra'
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment'

export class CdkThreeTierServerlessStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const equipmentsTable = new Table(this, 'EquipmentsTable', {
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
      sortKey: { name: 'sk', type: AttributeType.STRING },
      tableName: 'EquipmentsTable',
    })

    const devicesTable = new Table(this, 'DeviceTable', {
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
      sortKey: { name: 'sk', type: AttributeType.STRING },
      tableName: 'DeviceTable',
    })

    const getAllDevicesFunction = new NodejsFunction(
      this,
      'getAllDevicesFunction',
      {
        architecture: Architecture.ARM_64,
        entry: `${__dirname}/fns/getAllDevices.ts`,
        logRetention: RetentionDays.ONE_WEEK,
      },
    )

    const getAllEquipmentsFunction = new NodejsFunction(
      this,
      'getAllEquipmentsFunction',
      {
        architecture: Architecture.ARM_64,
        entry: `${__dirname}/fns/getAllEquipments.ts`,
        logRetention: RetentionDays.ONE_WEEK,
      },
    )

    const addDeviceFunction = new NodejsFunction(this, 'addDeviceFunction', {
      architecture: Architecture.ARM_64,
      entry: `${__dirname}/fns/addDevice.ts`,
      logRetention: RetentionDays.ONE_WEEK,
    })

    const addEquipmentFunction = new NodejsFunction(
      this,
      'addEquipmentFunction',
      {
        architecture: Architecture.ARM_64,
        entry: `${__dirname}/fns/addEquipment.ts`,
        logRetention: RetentionDays.ONE_WEEK,
      },
    )

    devicesTable.grantReadData(getAllDevicesFunction)
    equipmentsTable.grantReadData(getAllEquipmentsFunction)

    devicesTable.grantWriteData(addDeviceFunction)
    equipmentsTable.grantWriteData(addEquipmentFunction)

    const equipmentApi = new HttpApi(this, 'EquipmentApi', {
      corsPreflight: {
        allowHeaders: ['Content-Type'],
        allowMethods: [CorsHttpMethod.GET, CorsHttpMethod.POST],
        allowOrigins: ['*'],
      },
    })

    // const deviceApi = new HttpApi(this, 'DeviceApi', {
    //   corsPreflight: {
    //     allowHeaders: ['Content-Type'],
    //     allowMethods: [CorsHttpMethod.GET, CorsHttpMethod.POST],
    //     allowOrigins: ['*'],
    //   },
    // });

    const readEquipmentIntegration = new HttpLambdaIntegration(
      'ReadIntegration',
      getAllEquipmentsFunction,
    )

    const writeEquipmentIntegration = new HttpLambdaIntegration(
      'WriteIntegration',
      addEquipmentFunction,
    )

    const readDeviceIntegration = new HttpLambdaIntegration(
      'ReadIntegration',
      getAllDevicesFunction,
    )

    const writeDeviceIntegration = new HttpLambdaIntegration(
      'WriteIntegration',
      addDeviceFunction,
    )

    equipmentApi.addRoutes({
      integration: readEquipmentIntegration,
      methods: [HttpMethod.GET],
      path: '/equipment',
    })

    equipmentApi.addRoutes({
      integration: writeEquipmentIntegration,
      methods: [HttpMethod.POST],
      path: '/equipment',
    })

    equipmentApi.addRoutes({
      integration: readDeviceIntegration,
      methods: [HttpMethod.GET],
      path: '/device',
    })

    equipmentApi.addRoutes({
      integration: writeDeviceIntegration,
      methods: [HttpMethod.POST],
      path: '/device',
    })

    new CfnOutput(this, 'HttpApiUrl1', { value: equipmentApi.apiEndpoint })
    // new CfnOutput(this, 'HttpApiUrl2', { value: deviceApi.apiEndpoint });

    const websiteBucket = new Bucket(this, 'WebsiteBucket', {
      autoDeleteObjects: true,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY,
    })

    const originAccessIdentity = new OriginAccessIdentity(
      this,
      'OriginAccessIdentity',
    )
    websiteBucket.grantRead(originAccessIdentity)

    const distribution = new Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: new S3Origin(websiteBucket, { originAccessIdentity }),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
      ],
    })

    const execOptions: ExecSyncOptions = {
      stdio: ['ignore', process.stderr, 'inherit'],
    }

    const bundle = Source.asset(join(__dirname, 'web'), {
      bundling: {
        command: [
          'sh',
          '-c',
          'echo "Docker build not supported. Please install esbuild."',
        ],
        image: DockerImage.fromRegistry('alpine'),
        local: {
          tryBundle(outputDir: string) {
            try {
              execSync('esbuild --version', execOptions)
            } catch {
              return false
            }
            execSync('npx vite build', execOptions)

            copySync(join(__dirname, '../dist'), outputDir, {})
            return true
          },
        },
      },
    })
    new BucketDeployment(this, 'DeployWebsite', {
      destinationBucket: websiteBucket,
      distribution,
      logRetention: RetentionDays.ONE_DAY,
      prune: false,
      sources: [bundle],
    })

    new AwsCustomResource(this, 'ApiUrlResource', {
      logRetention: RetentionDays.ONE_DAY,
      onUpdate: {
        action: 'putObject',
        parameters: {
          Body: Stack.of(this).toJsonString({
            [this.stackName]: { HttpApiUrl: equipmentApi.apiEndpoint },
          }),
          Bucket: websiteBucket.bucketName,
          CacheControl: 'max-age=0, no-cache, no-store, must-revalidate',
          ContentType: 'application/json',
          Key: 'config.json',
        },
        physicalResourceId: PhysicalResourceId.of('config'),
        service: 'S3',
      },
      policy: AwsCustomResourcePolicy.fromStatements([
        new PolicyStatement({
          actions: ['s3:PutObject'],
          resources: [websiteBucket.arnForObjects('config.json')],
        }),
      ]),
    })

    // new AwsCustomResource(this, 'ApiUrlResource2', {
    //   logRetention: RetentionDays.ONE_DAY,
    //   onUpdate: {
    //     action: 'putObject',
    //     parameters: {
    //       Body: Stack.of(this).toJsonString({
    //         [this.stackName]: { HttpApiUrl: deviceApi.apiEndpoint },
    //       }),
    //       Bucket: websiteBucket.bucketName,
    //       CacheControl: 'max-age=0, no-cache, no-store, must-revalidate',
    //       ContentType: 'application/json',
    //       Key: 'config.json',
    //     },
    //     physicalResourceId: PhysicalResourceId.of('config'),
    //     service: 'S3',
    //   },
    //   policy: AwsCustomResourcePolicy.fromStatements([
    //     new PolicyStatement({
    //       actions: ['s3:PutObject'],
    //       resources: [websiteBucket.arnForObjects('config.json')],
    //     }),
    //   ]),
    // });

    new CfnOutput(this, 'DistributionDomain', {
      value: distribution.distributionDomainName,
    })
  }
}
