### Travel browser - web browser

Your skill can instruct a user to go to a short URL like bit.ly link browser, followed by a three-part pass phrase.
This browser page prompts for the pass phrase, which is then authenticated against an AWS API Gateway to your skill DynamoDB table.

The page then renders a form, filled with user attribute data, for display or editing.
The page loads and saves data via xhttp to an api endpoint you create, which loads and saves to the user's database record.

For each new user session, the skill will generate a temp pass phrase.
This pass phrase is stored in the user's tempPassPhrase attribute, where it can be located
by a the API Gateway Lambda function.


### Setup steps

You will be creating a new Lambda function, a DynamoDB table,
and an API Gateway that exposes a basic authentication service.
See folder /usersessionAPI

A single-page web app can be tested directly from the project, and then copied to a public web host
for live skill users.
See folder /www


