### Integrate Alexa
## Lab Instructions

We will install a sample skil called "travel browser" that shows off
several approaches to integrating Alexa with other applications and services.
Read a full overview of the architecture [here](./ARCHITECTURE.md).
You can see a demo of this skill here: [vimeo.com/280584428](https://vimeo.com/280584428)

Once this skill is setup, you will have a working web app that connects to the cloud and receives updates from a skill.
You can follow this proof-of-concept to add voice to your existing web UI.

### 1. Pre-requisites (10 minutes)

Accounts:
* [developer.amazon.com](https://developer.amazon.com/ask)
* [aws.amazon.com](https://aws.amazon.com) (a credit card is required)

Laptop environment:

* [Node.JS](https://nodejs.org/en/download/) version 8 or higher
  * Type ```node -v``` to check
* [AWS-SDK](https://www.npmjs.com/package/aws-sdk)
  * Run ```npm install aws-sdk --global```

* Clone or download this repository to a local folder.
  * Run ```git clone https://github.com/robm26/travel-browser.git```
* AWS command line interface [AWS CLI](https://aws.amazon.com/cli/)
  * [Mac instructions](https://docs.aws.amazon.com/cli/latest/userguide/cli-install-macos.html)
  * [Windows instructions](https://docs.aws.amazon.com/cli/latest/userguide/awscli-install-windows.html)

Optional:
* The Alexa command line interface: [ASK CLI](https://developer.amazon.com/docs/smapi/quick-start-alexa-skills-kit-command-line-interface.html)

### 2. Setup the Skill (10 minutes)

Sign In to [developer.amazon.com](https://developer.amazon.com/ask)
and create a new skill called **Travel Browser** with invocation name: "travel browser".

From the Build tab:
1. Click "JSON Editor" and paste in the [/models/en-US.json](../models/en-US.json) file to define the language model.
1. Click "Interfaces" and enable the Display Interface option.
1. Click "Save" and "Build"


### 3. Setup the Lambda function and other cloud components (15 minutes)

The manual steps to install and configure each AWS cloud component are listed [here](./SETUP.md) for reference.
These steps would take a long time to perform.  Instead, we can use AWS CloudFormation to quickly setup everything.
CloudFormation defines a "stack" or integrated bundle of services.
You can install (and later delete) the entire stack within the AWS CloudFormation console.

1. Open the [AWS CloudFormation Console](https://console.aws.amazon.com/cloudformation/home)
1. Click "Create New Stack"
1. From the "Choose a Template" options, click the "Specify an Amazon S3 template URL" radio button
1. Paste in ```https://s3.amazonaws.com/skill-building-labs/travel-browser/travelbrowser-packaged.yaml``` and click Next.
1. For the stack name, enter ```travel-browser``` to match the project name, and click Next.
1. Scroll down on the next page, leaving fields empty, and click Next.
1. On the Review page, Capabilities section, click both checkboxes to acknowledge the warning.
1. Click the blue "Create Change Set" button.
1. Once the change set has bee created, scroll down and click "Execute"

The stack will take a minute or two to be created. Click the refresh circle button near the top right.

1. Once complete, review the tabs shown. Click on the Outputs tab.
1. Copy the "SkillLambdaFunction" value.
1. In another tab, review your Skill (on developer.amazon.com ) and click the Endpoint link near the bottom left of the Build page.
1. Click on Endpoint Type: AWS Lambda ARN.
1. Paste in the SkillLambdaFunction to the Default Region box.
1. Save and Build your skill.


### 4. Configure the web app
The web app needs the userprofileAPI URL to be updated.
With this, and a user-typed pass phrase, the remaining MQTT configuration values will be returned dynamically to the browser app.
1. From the CloudFormation console, travel-browser-stack, drill into the Outputs.
1. Locate the "usersessionAPI" value.  Copy this URL (an example: https://t7t524d7m2.execute-api.us-east-1.amazonaws.com/Prod/ )
1. On your laptop, from the cloned travel-browser project folder, open the file ```/web/user/www/js/userdata.js```
1. Update the usersessionApiUrl field at the top of this file with your new API URL, and save.
1. An empty S3 bucket has been created for you to host your web app.  See the CloudFormation output for the bucket name and public URL.
 * OPTIONAL: copy the entire /web/user/www folder contents to this S3 bucket, or to your own web server.
 * See the www/sync.sh file for a command to automate publlishing your static web content to S3.

### 5. Test components

Skill
1. Launch the skill from the Test page of the developer console. Type in "open travel browser" and hear the welcome message.
1. Next, type in "link session" and hear a three part pass phrase.
1. Write down this pass phrase. For example, sweet dog 721

User Profile Page
1. Open up the www/userprofile.html page.  Enter in the three part pass phrase and click Load.
1. You should see a status of "lookup success"

DynamoDB
1. Click to the DynamoDB service in the AWS console, and click Tables from the left menu.
1. Click to your new table, "ask-travel-browser"
1. Click on Items, you should see a record.  It will appear as a long blue link in the "id" column.
1. Click the item and drill into the the attributes map.  You should see the tempPassPhrase value and other values.

Lambda function
1. Create a unit test in the console similar to this block:

```
    { "queryStringParameters" :
        {
            "tempPassPhrase":"sweet-dog-721"
        },
        "path":"/lookup"
    }
```

API Gateway
1. Click into your API within your stack.  It's logical name is: ServerlessRestApi.
1. From the API Gateway console, left menu, click to "Stages"
1. Click the "Prod" stage.  On the right you should see a URL for your API.
1. Append the path (/lookup) and query string parameter (tempPassPhrase) to test this API.  An example of a full URL is: ```https://co78yaslj8.execute-api.us-east-1.amazonaws.com/Prod/lookup?tempPassPhrase=sweet-dog-721```
1. You should see a block of JSON that corresponds to your DynamoDB record.  The tempPassPhrase is amongst the returned fields.


### 6. Customize
Follow [LAB2](./components/LAB2.md) to make small changes to the app and source data to start customizing the solution for your needs.
