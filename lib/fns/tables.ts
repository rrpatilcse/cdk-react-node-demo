import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { Entity, Table } from 'dynamodb-onetable'
import Dynamo from 'dynamodb-onetable/Dynamo'

const client = new Dynamo({ client: new DynamoDBClient({}) })

const schema = {
  indexes: {
    primary: {
      hash: 'pk',
      sort: 'sk',
    },
    gs1: {
      hash: 'gs1pk',
      sort: 'gs1sk',
    },
  },
  models: {
    equipments: {
      pk: { type: 'string', value: 'equipmentNumber' },
      sk: { type: 'string', value: 'equipmentLocation' },
      equipmentNumber: {
        required: true,
        type: 'string',
      },
      equipmentLocation: {
        required: true,
        type: 'string',
      },
    },
    devices: {
      pk: { value: 'deviceId', type: 'string' },
      sk: { value: 'equipments#${equipmentNumber}', type: 'string' },
      // gs1pk: { value: 'equipments#${equipmentNumber}', type: 'string' },
      // gs1sk: { value: 'deviceType', type: 'string' },

      equipmentNumber: {
        required: true,
        type: 'string',
      },
      deviceId: {
        required: true,
        type: 'string',
      },
      deviceType: {
        required: true,
        type: 'string',
      },

      deviceStatus: {
        required: false,
        type: 'string',
      },
      provisionStatus: {
        required: false,
        type: 'string',
      },
      swVersion: {
        required: false,
        type: 'string',
      },
    },
  },
  version: '0.1.0',
  params: {
    typeField: 'type',
  },
  format: 'onetable:1.0.0',
} as const

export type EquipmentType = Entity<typeof schema.models.equipments>
export type DeviceType = Entity<typeof schema.models.devices>

const equipmentTable = new Table({
  client,
  name: 'EquipmentsTable',
  schema: schema,
  timestamps: true,
})

const deviceTable = new Table({
  client,
  name: 'DeviceTable',
  schema: schema,
  timestamps: true,
})

export const Equipments = equipmentTable.getModel<EquipmentType>('equipments')
export const Devices = deviceTable.getModel<DeviceType>('devices')
