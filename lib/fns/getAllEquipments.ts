import type { APIGatewayProxyResultV2 } from 'aws-lambda'

import { Equipments } from './tables'

export const handler = async (): Promise<APIGatewayProxyResultV2> => {
  try {
    const equipments = await Equipments.find(
      { pk: 'equipmentNumber' },
      { limit: 10, reverse: true },
    )
    console.log(`Data fetched from db: `,equipments)
    return { body: JSON.stringify(equipments), statusCode: 200 }
  } catch (error) {
    console.log(`Error occurred in get all equipments`, error)
    return {
      //@ts-ignore
      body: JSON.stringify({ error: error.message || 'Internal Server Error' }),
      statusCode: 500,
    }
  }
}
