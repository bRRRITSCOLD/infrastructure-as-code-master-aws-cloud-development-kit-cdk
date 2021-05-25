import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda'

function getPhotos(event: APIGatewayProxyEventV2, context: Context): Promise<APIGatewayProxyResultV2> {
  return Promise.resolve({
    statusCode: 200,
    body: 'Hello from lambda, it is alive!'
  });
}

export { getPhotos }