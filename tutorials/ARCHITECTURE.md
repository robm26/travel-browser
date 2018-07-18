### travel-browser
## Architecture

#### Base skill
The skill features a data file with city information, an intent to browse a list of cities,
and an intent to show details for a specific city.  Information is rendered in voice, card, and display formats.

The skill relies on DynamoDB to remember key information for each user.
For example, if a user says "my name is Madeline", the name is stored as an attribute.
Now, every time the user launches the skill, they will hear a personalized welcome message, "welcome Madeline".

The minimum components for the skill are:
1. A traditional skill [model](./models/en-US.json)
and [lambda function](./lambda/custom/).
1. An AWS IAM role for the function that includes DynamoDB permissions
1. A DynamoDB table with primary key of "id", which the skill can create for you

#### User console
The user profile console is a web app that allows the user to review and update their settings.
The console UI is a lightweight single-page webapp
running as [web/user/www/userprofile.html](./web/user/www/userprofile.html)
The profile page does not connect directly to the cloud,
rather it makes standard xhttp calls to a public user session API (see below)
that you deploy as part of the solution.

User flow:
1. The user says "link session"
1. The skill generates a new random three part pass phrase, such as "fast car 789"
and stores this as a persistent attribute, i.e. a value in the DynamoDB record for the user.
1. The skill instructs the user to visit a short URL such as bit.ly/travelbrowser
1. The user enters the three part pass phrase on the web form, which is sent to the user session API.
1. The API scans all records in the DynamoDB table and if it finds a match less than five minutes old, retrieves the user profile.
1. The web page displays a form containing text fields for each persistent attribute.
1. The user can update the page, for example, by correcting the name spelling,
adding a "name pronounce" hint, updating their contact information, etc.
1. The user presses "save" and the page calls the service with the pass phrase and new data, for update in DynamoDB.
1. The user re-launches the skill.  Now the user is greeted with the new name or "name pronounce" that the user had entered.
1. The user can click the Recording tab to record a new audio clip from their browser.
1. The recording file is is saved to a cloud bucket and filename is saved to the user profile.
1. The recording can be heard as ssml audio during the next skill session.

## User Session API
The user session API is defined in [web/user/usersessionAPI](../web/user/usersessionAPI/).
The API is a simple authentication service.  It sits atop the DynamoDB table used by the skill,
and grants read and update access to callers with a valid pass phrase.
The API is a pass through to a Lambda function that performs the database interactions.
The API itself provides a layer of separation between public internet users and your DynamoDB table or S3 bucket.
For example, you can increase security by lowering the per-second throttling,
define custom security settings in your code, or disable the API altogether,
without affecting function, DynamoDB table or skill.

#### User Session Lambda function
The Lambda function is defined in [web/user/usersessionAPI/lambda](../web/user/usersessionAPI/lambda)
This function performs the lookups and updates as described above.
It loads the AWS SDK and uses DynamoDB.DocumentClient to interact with the skill table.

This Lambda function requires a trigger to be set for the API Gateway service,
and an IAM role with appropriate DynamoDB permissions.


## IOT console
Browsers that connect to the IOT service can reflect the skill's state and be controlled by the skill,
as documented in the
[alexa-cookbook](https://github.com/alexa/alexa-cookbook/tree/master/aws/Amazon-IOT)
or via the [State Games](https://alexa.design/stategames) demo.

User Flow:
1. The user successfully authenticates via the web app, as described above.  This starts a new mqtt connection to the IOT broker endpoint.
1. The user clicks the IOT tab in the web console.
1. The user watches their next skill session reflected in a live dialog simulator.
1. The user can see a rendering of card data and images

The 'link session' handler in the skill populates an attribute with a new random pass phrase.
This handler also fills in certain additional profile attributes with connection information
to allow the browser to connect to the AWS IOT service,
such as "Identity Pool ID", "MQTT Endpoint", and "IOT Topic".

The IOT tab of the browser will use these to initiate a connection
to the AWS IOT service via Cognito as an anonymouse user.


