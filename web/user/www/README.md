### Travel browser - web browser components


### Browser scripts

The html page loads and uses a few custom browser scripts.

 * userdata.js
    This script autheticates the page to the API service, renders the profile edit form, and posts any updates back to the API.

 * connectAsThing.js
    This uses an AWS Cognito Pool to connect to the AWS IOT service and subscribe to a topic.

 * updateDom.js
    Upon new messages from the skill, this function re-paints the screen with DOM manipulations.




See the /js folder for the full set of .js scripts.

