import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from 'aws-lambda'

import { Equipments } from './tables'

export const handler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> => {
  try {
    const body = event.body
    if (body) {
      const equipment = await Equipments.create(JSON.parse(body))
      return { body: JSON.stringify(equipment), statusCode: 200 }
    }
    return { body: 'Error, invalid input!', statusCode: 400 }
  } catch (error) {
    console.log(`Error occurred in add equipment`, error);
    //@ts-ignore
    return { body: JSON.stringify({error: error.message || 'Internal Server Error'}), statusCode: 500 }
  }
}
