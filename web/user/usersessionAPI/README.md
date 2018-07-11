### Travel Browser - usersessionAPI

The User Profile application consists of three parts.

1. The AWS API Gateway web service that performs the interactions to AWS
1. The AWS Lambda function that executes lookup and update queries to DynamoDB
1. The static web page assets: html, css, javascript files managed in the [www](../www/) folder

#### Setup steps

1. Create Lambda function from lambda/index.js
1. Instead of an Alexa trigger, define an AWS API Gateway trigger, and 

Define AWS API Gateway trigger, it asks you if you want to create a new API, say yes


API Gateway setup notes

choose proxy integration to Lambda?
