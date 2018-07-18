### Travel Browser - usersessionAPI

#### Background
You can create a back end API service to be called by the user profile web app.

#### Authorization Function
The API is a proxy for a Lambda function that will scan the skill's DynamoDB table,
seeking a match on "tempPassphrase"
where the "linkTimestamp" is less than five minutes old.
If not located, the function returns a generic "session not found" message.
If located, the web page receives the full metadata for their skill user profile.

#### Read and Write
The page can either send a GET to the /lookup path, or POST new attribute data to the /update path.

1. The AWS API Gateway web service that performs the interactions to AWS
1. The AWS Lambda function that executes lookup and update queries to DynamoDB
1. The static web page assets: html, css, javascript files managed in the [www](../www/) folder

#### Setup steps

1. Create Lambda function from lambda/index.js
1. Instead of an Alexa trigger, define an AWS API Gateway trigger
1. Continue to create an AWS API gateway as a proxy for this Lambda.
