### travel-browser
## Skill Setup

This assumes you are familiar with all the steps to setup a skill in developer.amazon.com and aws.amazon.com.
If not, [start here](https://github.com/alexa/skill-sample-nodejs-city-guide/blob/master/instructions/1-voice-user-interface.md).

### Skill Steps

The high level steps are:

Sign In to [developer.amazon.com](https://developer.amazon.com/ask) and create a new skill called **Travel Browser** with invocation name: "travel browser".

From the Build tab:
1. Click "JSON Editor" and paste in the /models/en-US.json file to define the language model.
1. Click "Interfaces" and enable the Display Interface option.
1. Click "Build Model"

### IAM Steps
1. Go to the AWS IAM console
1. Locate your skill's Role, sometimes called "lambda_basic_execution",
1. Verify or attach a policy such as DynamoDBFullAccess, to grant your Lambda function access to the DynamoDB service.

### Lambda Steps
1. Create a new Lambda Function.  Start with a blank function.
1. Select an ASK Trigger from the left, scroll down and Disable Skill ID verification for now, and scroll up click SAVE.
1. Update the Execution Role to the existing role you just updated.

### Deploy and Test
1. From a command prompt, navigate to /lambda/custom
1. Type "npm install"  Node.JS will download and install several packages to the node_modules folder.  You can optionally delete the node_modules/aws folder to save space.
1. Zip and upload the contents of the /lambda/custom folder to your Lambda function. You can use the CLI or  ./deploylambda.sh to automate this step.
1. Test your skill with a complete interaction, such as "open travel browser" and "stop".
1. The skill may fail the first time, it will be creating a new DynamoDB table for you called askMemorySkillTable.
1. Test again, for example, "tell travel browser my name is sam", then "stop".  When you return to the skill you should be greeted with a first name.
1. Review the Alexa App cards and any Echo Display screen to see visual content.

### Next Step
 * [Setup the Web Service](./API.md)
