### travel-browser
## Setup Steps

This skill requires several AWS services to be configured.  See [ARCHITECTURE.md](ARCHITECTURE.md) for more details.

The complete app will be delivered via an AWS Serverless Application Model template,
which is a wizard for deploying a "stack" of components all at once.  (coming soon)

The manual steps for deploying this project are presented here.


### Pre-requisites

* Experience building Alexa skills with AWS Lambda

Laptop environment:
* [Node.JS](https://nodejs.org/en/download/) version 8 or higher
* [AWS CLI](https://aws.amazon.com/cli/) and [ASK CLI](https://developer.amazon.com/docs/smapi/quick-start-alexa-skills-kit-command-line-interface.html) for zipping and deploying your project to AWS Lambda.
* [AWS-SDK](https://www.npmjs.com/package/aws-sdk) Run ```npm install aws-sdk --global```
* Clone or download this repository to a local folder


### Next Steps
 * Setup the [Skill](./components/SKILL.md)
 * Setup the [Web Service](./components/API.md)
 * Setup the [Cognito Pool](./components/COGNITO.md)
 * Setup the [IOT Endpoint](./components/IOT.md)
 * Setup the [S3 Bucket](./components/S3.md)

