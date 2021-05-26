#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { InfrastructureAsCodeMasterAwsCloudDevelopmentKitCdkStack } from '../lib/infrastructure-as-code-master-aws-cloud-development-kit-cdk-stack';

const app = new cdk.App();
new InfrastructureAsCodeMasterAwsCloudDevelopmentKitCdkStack(app, 'InfrastructureAsCodeMasterAwsCloudDevelopmentKitCdkStack-dev', {
  env: { region: "us-east-1" },
  envName: 'dev'
});

new InfrastructureAsCodeMasterAwsCloudDevelopmentKitCdkStack(app, 'InfrastructureAsCodeMasterAwsCloudDevelopmentKitCdkStack-prod', {
  env: { region: "us-east-1" },
  envName: 'prod'
});
