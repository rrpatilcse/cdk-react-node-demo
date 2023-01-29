import type { APIGatewayProxyResultV2 } from 'aws-lambda'

import { Devices } from './tables'

export const handler = async (): Promise<APIGatewayProxyResultV2> => {
  try {
    const devices = await Devices.find(
      { pk: 'deviceId' },
      { limit: 10, reverse: true },
    )
    console.log(`Data fetched from db: `, devices)

    return { body: JSON.stringify(devices), statusCode: 200 }
  } catch (error) {
    console.log(`Error occurred in get all devices`, error)
    return {
      //@ts-ignore
      body: JSON.stringify({ error: error.message || 'Internal Server Error' }),
      statusCode: 500,
    }
  }
}
