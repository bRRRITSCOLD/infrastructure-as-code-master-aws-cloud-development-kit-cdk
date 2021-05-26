import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment';
import * as cdk from '@aws-cdk/core';
import * as path from 'path';
import { AutoDeleteBucket } from '@mobileposse/auto-delete-bucket';
import { BucketEncryption, IBucket } from '@aws-cdk/aws-s3';

interface S3BucketWithDeployPropsInterface extends cdk.StackProps {
  deploymentSources: string[];
  encryption: BucketEncryption;
}

class S3BucketWithDeploy extends cdk.Construct {
  public readonly bucket: IBucket;

  constructor(scope: cdk.Construct, id: string, props: S3BucketWithDeployPropsInterface) {
    super(scope, id);
    this.bucket = new AutoDeleteBucket(this, 'S3BucketWithDeploy', {
      encryption: props.encryption
    });

    const bucketDeployment = new BucketDeployment(this, `S3BucketWithDeployDeployment`, {
      sources: [
        Source.asset(path.join(__dirname, ...props.deploymentSources))
      ],
      destinationBucket: this.bucket as any
    });
  }
}

export { S3BucketWithDeploy } 