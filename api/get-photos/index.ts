import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda'
import { S3 } from 'aws-sdk'

const bucketName = process.env.PHOTO_BUCKET_NAME as string;
  
const s3 = new S3()

async function generateUrl(object: S3.Object): Promise<{ filename: string, url: string }> {
  const url = await s3.getSignedUrlPromise('getObject', {
    BucketName: bucketName,
    Key: object.Key!,
    Expires: (24 * 60 * 60)
  })
  return {
    filename: object.Key!,
    url
  }
}

async function getPhotos(event: APIGatewayProxyEventV2, context: Context): Promise<APIGatewayProxyResultV2> {
  try {
    const objects = await s3.listObjects({ Bucket: bucketName }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(objects.Contents)
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify(err)
    }
  }
}

export { getPhotos }