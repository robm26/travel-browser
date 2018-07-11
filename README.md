# travel-browser
## Alexa skill sample with integrated web browser

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
* Multi-modal: Strategies for cards, Echo displays and browser
* Using Echo display templates for list, detail and image
* Guiding the user with sample slot values
* Context using a history session attribute
* Using DynamoDB persistence to remember the user preferences


### Advanced Learning Objectives
* Tracking data with user's permission
* Tracking user against all users
* Integrating Web Browsers
 * Authentication page
 * User profile page
 * Live session page
* Simulation with TestFlow


### User Console
A sample web page application is included that allows users to update settings and
and follow the conversation from their browser.
The user console is a solution built from several AWS cloud services.




