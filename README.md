# travel-browser
### Alexa skill sample with integrated web browser

Welcome voice developers!
This sample project includes a skill for searching and finding information about travel destinations.
City information, including images and airport details, are tracked in a data file in the project.

### Sample session
Users interested in travel can ask travel browser to "browse cities" or "show cities".
The skill suggests three random cities that are available and renders a full list via card and display.
The user can narrow the long list by repeating the request with a country slot:
"show cities in Canada" for example.

If the user says "show Seattle" or "go to Boston" or just "London", the skill will respond
 with information about the airport for the city.
 A photo and text summary is presented to users of the Alexa app,
 or users who are on an Echo Show or Spot device.


### Learning Objectives
* Multi-modal: Strategies for cards and Echo displays
* Using Echo display templates for list, detail and image
* Guiding the user with sample slot values
* Context using a history session attribute
* Using DynamoDB persistence to remember the user preferences


### Advanced Learning Objectives
* Simulating the skill with TestFlow
* Tracking data with user's permission
* Clearing the user's profile data
* Integrating Web Browsers
 * User profile panel
 * Live session panel
 * Web audio recorder panel


### User Console
A sample web page application is included that allows users to update settings and
and follow the conversation from their browser.
The user console is a single page webapp that calls AWS cloud services.
You run the userprofile.html page from a browser and type in the pass phrase that the skill provides.
Once authenticated, you can update profile fields, view live skill usage, or record a new audio message for your skill.

### Authentication Service
The Console relies on an external public https API Gateway web service.
First it issues a GET with a valid tempPassPhrase parameter less than five minutes old, and receives the user's profile attributes.
The save button will call a POST that updates attributes to the skill record,
also when saving an audio recording to the skill's S3 bucket.

### Services Used
 * AWS Lambda
 * AWS DynamoDB
 * AWS S3
 * AWS API Gateway
 * AWS Cognito
 * AWS IOT
 * AWS IAM

### Get Started

Check out the application's [ARCHITECTURE](./tutorials/ARCHITECTURE.md) or dive into the [SETUP](./tutorials/SETUP.md)

