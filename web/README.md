### Travel browser - web browser and service

For each new user session, the skill will generate a temp pass phrase, such as Fast Cat 345.
This pass phrase is stored in a tempPassPhrase attribute, saved to the user's DynamoDB record.

Your skill can instruct a user to go to a short URL like bit.ly travel browser, followed by the three-part pass phrase.
This browser page prompts for the pass phrase, which is then authenticated against an AWS API Gateway to your skill's DynamoDB table.

The page then renders a form, filled with user attribute data, for display or editing.

The page gets and posts data to an API Gateway service that interacts with DyanmoDB.



### Setup steps
Setup the basic Alexa skill via the /lambda and /models folders.
Be sure to grant your skill's role access to DynamoDB, using the IAM console.
The skill will create a DynamoDB table to store persistent attributes.
Test your skill by saying "link session".
The skill will store a temp pass phrase for the user in the table.

With this table as a foundation, you will build a service and web page to allow users to update their attributes online.

 * Next step: [usersessionAPI](./user/usersessionAPI/README.md)

