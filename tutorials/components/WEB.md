
### travel-browser
## Web App Setup

The web app, called the User Profile page, is deployed entirely via static files.

Navigate to the [/web/user/www] folder.  You will see the following files.

* userprofile.html - the web app page
* /css - a stylesheet for customizing fonts, colors, and appearance of page elements
* /lib - files required by the web-audio-recorder code
* /js - a folder with several browser javascript files

 * /js/userdata.js - handles interactions to the API Gateway service.
 * /js/connectAsThing.js - initiates an AWS Cognito connection for the IOT mqtt feature, after successful auth
 * /js/updateDOM.js - processes new messages from IOT and renders page elements such as new log entries.
 * /js/recorder.js - handles recording and saving audio clips

#### Steps
1. Within the /js/userdata.js file update the serviceurl to be the Invoke URL from the previous step.
1. Launch the file userprofile.html in a browser.
1. Open the browser's Javascript Console.  Keep this open and scan for any error messages.
1. Type in a valid three part pass phrase and press LOAD.
1. You should see a success status and some profile data in the edit form.

You can deploy this www folder to your website, or public S3 bucket.
1. Create a shortened link to this page for users to visit, such as [bit.ly/travelbrowser](bit.ly/travelbrowser)
1. Update the /lambda/custom/index.js file, LinkSessionHandler function, to tell the user the correct website to visit.


### Next Step
 * Setup the [Cognito Pool](./COGNITO.md)

