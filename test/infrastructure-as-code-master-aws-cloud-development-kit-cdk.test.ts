import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as InfrastructureAsCodeMasterAwsCloudDevelopmentKitCdk from '../lib/infrastructure-as-code-master-aws-cloud-development-kit-cdk-stack';
import '@aws-cdk/assert/jest'

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new InfrastructureAsCodeMasterAwsCloudDevelopmentKitCdk.InfrastructureAsCodeMasterAwsCloudDevelopmentKitCdkStack(app, 'InfrastructureAsCodeMasterAwsCloudDevelopmentKitCdkStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {
        "MySimpleAppBucket6B59014A": {
          "Type": "AWS::S3::Bucket",
          "Properties": {
            "BucketEncryption": {
              "ServerSideEncryptionConfiguration": [
                {
                  "ServerSideEncryptionByDefault": {
                    "SSEAlgorithm": "AES256"
                  }
                }
              ]
            }
          },
          "UpdateReplacePolicy": "Retain",
          "DeletionPolicy": "Retain"
        }
      },
      "Outputs": {
        "MySimpleAppBucketNameExport": {
          "Value": {
            "Ref": "MySimpleAppBucket6B59014A"
          },
          "Export": {
            "Name": "MySimpleAppBucketName"
          }
        }
      }
    }, MatchStyle.EXACT))
});

test('Stack creates an S3 bucket', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new InfrastructureAsCodeMasterAwsCloudDevelopmentKitCdk.InfrastructureAsCodeMasterAwsCloudDevelopmentKitCdkStack(app, 'InfrastructureAsCodeMasterAwsCloudDevelopmentKitCdkStack');
  // THEN
  expect(stack).toHaveResource('AWS::S3::Bucket')
});
