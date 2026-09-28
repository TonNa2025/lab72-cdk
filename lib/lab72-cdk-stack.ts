import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class Lab72CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const myFunction = new lambda.Function(this, 'HelloWorldFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        exports.handler = async function(event) {
          return {
            statusCode: 200,
            body: JSON.stringify('Good night Na!'),
          };
        };
      `),
    });
    const myFunctionUrl = myFunction.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    });
    myFunction.addPermission('FunctionURLAllowPublicAccess', {
      principal: new cdk.aws_iam.AnyPrincipal(),
      action: 'lambda:InvokeFunctionUrl',
      functionUrlAuthType: lambda.FunctionUrlAuthType.NONE,
    });
    myFunction.addPermission('FunctionURLInvokeAllowPublicAccess', {
      principal: new cdk.aws_iam.AnyPrincipal(),
      action: 'lambda:InvokeFunction',
      invokedViaFunctionUrl: true,
    });

    new cdk.CfnOutput(this, 'myFunctionUrlOutput', {
      value: myFunctionUrl.url,
    });
  }
}
