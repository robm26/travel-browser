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

### The Problem
The Alexa Language model is highly accurate in hearing slot values like
COUNTRY, CITY, NUMBER, NAME, or custom slot values.
However, certain data values like Last Name and Email Address for example
are notoriously difficult to use in voice, due to their limitless variation.

**Alexa Account Linking** is one approach thousands of voice developers use for getting and using a complete user profile.
Account Linking assumes you have an existing user directory, setup and shared via an OAuth service.
Then, you as a developer must make your skill interact with this OAuth service.
Read more at [Understanding Account Linking](https://developer.amazon.com/docs/account-linking/understand-account-linking.html)

While the Account Linking model works great for many of the most popular skills,
some developers may find the requirements to be daunting.

Presented here is an alternate approach, where you build your own custom auth service for the skill.

### User Console
A sample web page application is included that allows users to update profile attributes and
and follow the conversation from their browser.
The user console is a single page web app that calls AWS cloud services.
The user loads the userprofile.html page from a browser and types into a form the pass phrase that the skill provides.
Once authenticated, the user can review and update profile fields, view live skill usage, or record a new audio message for the skill.

* See the live sample console at [bit.ly/travelbrowser](https://bit.ly/travelbrowser)

### Authentication Service
The Console relies on an external public https API Gateway web service.
First it issues a GET with a valid tempPassPhrase parameter less than five minutes old,
and receives the user's profile attributes.
The save button will call a POST that updates attributes to the skill record,
also when saving an audio recording to the skill's S3 bucket.


### Cloud Services Used
 * AWS Lambda
 * AWS DynamoDB
 * AWS S3
 * AWS API Gateway
 * AWS Cognito
 * AWS IOT
 * AWS IAM

### Get Started

Check out the application's [ARCHITECTURE](./tutorials/ARCHITECTURE.md) or dive into the [SETUP](./tutorials/SETUP.md)

