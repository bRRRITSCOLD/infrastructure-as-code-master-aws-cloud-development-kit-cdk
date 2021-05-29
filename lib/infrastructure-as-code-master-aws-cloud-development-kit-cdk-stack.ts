import { BucketEncryption } from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda-nodejs';
import { Runtime } from '@aws-cdk/aws-lambda';
import * as path from 'path';
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';
import { PolicyStatement } from '@aws-cdk/aws-route53/node_modules/@aws-cdk/aws-iam';
import { CorsHttpMethod, HttpApi, HttpMethod } from '@aws-cdk/aws-apigatewayv2';
import { LambdaProxyIntegration } from '@aws-cdk/aws-apigatewayv2-integrations';
import { CloudFrontWebDistribution } from '@aws-cdk/aws-cloudfront';
import { AutoDeleteBucket } from '@mobileposse/auto-delete-bucket';
import { S3BucketWithDeploy } from './s3-bucket-with-deploy';

interface InfrastructureAsCodeMasterAwsCloudDevelopmentKitCdkStackPropsInterface extends cdk.StackProps {}
export class InfrastructureAsCodeMasterAwsCloudDevelopmentKitCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: InfrastructureAsCodeMasterAwsCloudDevelopmentKitCdkStackPropsInterface) {
    super(scope, id, props);

    const { bucket: photosBucket } = new S3BucketWithDeploy(this, 'MySimpleAppPhotosBucket', {
      deploymentSources: ['..', 'photos'],
      encryption: BucketEncryption.S3_MANAGED
    })

    const frontendBucket = new AutoDeleteBucket(this, 'MySimpleAppFrontendBucket', {
      encryption: BucketEncryption.S3_MANAGED,
      websiteIndexDocument: 'index.html',
      publicReadAccess: true
    });

    const frontEndcloudFrontDistribution = new CloudFrontWebDistribution(this, 'MySimpleAppFrontendCloudFrontDistribution', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: frontendBucket
          },
          behaviors: [{ isDefaultBehavior: true }]
        }
      ]
    });

    const frontendBucketDeployment = new BucketDeployment(this, 'MySimpleAppFrontendBucketDeployment', {
      sources: [
        Source.asset(path.join(__dirname, '..', 'frontend', 'build'))
      ],
      destinationBucket: frontendBucket as any,
      distribution: frontEndcloudFrontDistribution
    });

    const getPhotos = new lambda.NodejsFunction(this, 'MySimpleAppLambda', {
      runtime: Runtime.NODEJS_14_X,
      entry: path.join(__dirname, '..', 'api', 'get-photos', 'index.ts'),
      handler: 'getPhotos',
      environment: {
        PHOTO_BUCKET_NAME: photosBucket.bucketName,
      }
    });

    const bucketContainerPermissions = new PolicyStatement();
    bucketContainerPermissions.addResources(photosBucket.bucketArn);
    bucketContainerPermissions.addActions('s3:ListBucket');

    const bucketPermissions = new PolicyStatement();
    bucketPermissions.addResources(`${photosBucket.bucketArn}/*`)
    bucketPermissions.addActions('s3:GetObject', 's3:PutObject');
  
    getPhotos.addToRolePolicy(bucketPermissions)
    getPhotos.addToRolePolicy(bucketContainerPermissions)

    const httpApi = new HttpApi(this, 'MySimpleAppHttpApi', {
      corsPreflight: {
        allowOrigins: ['*'],
        allowMethods: [CorsHttpMethod.GET]
      },
      apiName: 'phots-api',
      createDefaultStage: true
    });

    const lambdaIntegration = new LambdaProxyIntegration({
      handler: getPhotos,
    });

    httpApi.addRoutes({
      path: '/photos',
      methods: [HttpMethod.GET],
      integration: lambdaIntegration
    });

    new cdk.CfnOutput(this, 'MySimpleAppPhotoBucketNameExport', {
      value: photosBucket.bucketName,
      // exportName: `MySimpleAppPhotBucketName${props?.envName}`
      exportName: `MySimpleAppPhotBucketName`
    });

    new cdk.CfnOutput(this, 'MySimpleAppFrontendBucketNameExport', {
      value: frontendBucket.bucketName,
      // exportName: `MySimpleAppFrontendBucketName${props?.envName}`
      exportName: `MySimpleAppFrontendBucketName`
    });

    new cdk.CfnOutput(this, 'MySimpleAppFrontendCloudFrontDistributionUrlExport', {
      value: frontEndcloudFrontDistribution.distributionDomainName,
      // exportName: `MySimpleAppFrontendCloudFrontDistributionUrl${props?.envName}`
      exportName: `MySimpleAppFrontendCloudFrontDistributionUrl`
    });

    new cdk.CfnOutput(this, 'MySimpleAppHttpApiUrlExport', {
      value: httpApi.url!,
      // exportName: `MySimpleAppHttpApiUrl${props?.envName}`
      exportName: `MySimpleAppHttpApiUrl`
    });

    // The code that defines your stack goes here
  }
}
