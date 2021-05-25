import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda'

function getPhotos(event: APIGatewayProxyEventV2, context: Context): Promise<APIGatewayProxyResultV2> {
  const bucketName = process.env.PHOTO_BUCKET_NAME;
  return Promise.resolve({
    statusCode: 200,
    body: bucketName
  });
}

export { getPhotos }