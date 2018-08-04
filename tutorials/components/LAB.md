
### travel-browser
## Lab instructions


Now that you have setup the travel browser skill, think of ways you may like to customize it for your own organization.

The raw data for the cities is stored in /lambda/custom/data/cities.json


### Lab 1
1. Open the cities.json file and make updates to one of the city records.
1. Save and deploy the Lambda function.  You should hear Alexa describe the city according to the data.
1. Review the file /lambda/custom/data.js where the lookup helper functions are defined.

### Lab 2
1. Add a new lookup function in data.js.
1. Have the function load data from an external service, such as a public API, a SQL database query, or a text file in an S3 bucket.

#### Lab 3
1. Review the code in the /web/user/www/js/userdata.js file. This script interacts with your user session API service to load and save user profile data.
1. The script shows a subset of all user attributes, only those that appear in the editableAttributes array.
1. Comment out the last three, 'IotTopic', 'IdentityPoolId', 'mqttEndpoint', since the user should not need to view or update these.


#### Lab 4
1. Review the code in the /web/user/www/js/updateDOM.js file.  This script starts off by handling new IOT messages in the handleMessage function.
1. Follow the code to see how list elements are generated and rendered on the IOT panel.

