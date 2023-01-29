# NODE REACT CDK DEMO
## Useful commands

* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template

## Sample API Input
/device
    ```json 
    {
      equipmentNumber: '107AZ203300060',
      deviceId: 'CPU',
      deviceType: 'KCECPUCc',
      deviceStatus: 'Connect',
      provisionStatus: 'Active',
      swVersion: '5.0.4'
    }
    ```
/equipment
```json 
    {
        "equipmentNumber": "107AZ203300060",
        "equipmentLocation": "TestLocation"
    }
``` 