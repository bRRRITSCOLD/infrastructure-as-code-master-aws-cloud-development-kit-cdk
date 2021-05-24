import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as InfrastructureAsCodeMasterAwsCloudDevelopmentKitCdk from '../lib/infrastructure-as-code-master-aws-cloud-development-kit-cdk-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new InfrastructureAsCodeMasterAwsCloudDevelopmentKitCdk.InfrastructureAsCodeMasterAwsCloudDevelopmentKitCdkStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
