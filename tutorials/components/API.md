
### travel-browser
## API Setup
We now have a DynamoDB table with key of "id" running.



This API, and an accompanying web page we setup later, will authenticate a skill user,
GET their attribute data,
POST any updates to attributes the user provides.

#### Lambda function
The API itself is just a proxy to a new Lambda function that performs the work.
See [/web/user/usersessionAPI](../../web/user/usersessionAPI/README.md)

1. Create a Lambda function.  You can choose the default "Author from scratch".
1. Name the function **AlexaMemoryUserProfileFunction**
1. For Runtime, choose the option: **Node.JS 8.10**
1. Select or create an IAM role that has read and write access to the **askMemorySkillTable**
1. On the next page, scroll down to the Cloud9 code editor that has the index.js file open.
1. Clear the contents and paste in the contents of  [usersessionAPI/lambda/index.js](../../web/user/usersessionAPI/lambda/index.js)

Later on, use this event as a new Test definition within the Lambda console.

```
    { "queryStringParameters" :
        {
            "tempPassPhrase":fast-car-345
        },
        "path":"/lookup"
    }
```

#### API Trigger
Normally when we create a Lambda function we attach the Alexa Skills Kit trigger.
For this function, we willl attach the **API Gateway** trigger.
1. On the left, from the Triggers list, click "API Gateway" trigger.
1. Scroll all the way down, and the panel prompts you to selct an API or create a new one.
1. Choose "Create a new API"
1. For Security, choose "Open"
1. Click ADD.
1. Scroll up to the top and click SAVE.

#### API Gateway
A new API Gateway such as AlexaMemoryUserProfile-API has now been created for you.
We can review the settings, test, and deploy the API.

1. Click to the [API Gateway console](https://console.aws.amazon.com/apigateway/home#/apis) console.
1. CLick on your new API.
1. Underneath Resources, you should see the tag "ANY".
1. Click the Test lightning bolt.
1. Choose method GET, proxy of "lookup", and Query String like tempPassPhrase=fast-car-345
1. Click TEST.  You should see some raw log messages and JSON.  Scan for any errors, particularly at the end of the log.

Your API needs to be deployed in order to be used by anyone else.
1. From the Actions button, choose Deploy API.
1. For Deployment Stage, choose New Stage
1. Call your Stage "dev" and click Deploy
1. You can now see your stage within the Stages view
1. Click into your stage and open the GET and POST verbs
1. You will see an Invoke URL.  This is your live web service.
1. Copy this down.  We will be pasting it into the file /www/js/userdata.js in a later step.

You should be able to try the url in a browser.  Just append a query string like ?tempPassPhrase=fast-car-345

If necessary, re-launch the travel browser skill and say "link session".  This will generate a fresh new pass phrase.

#### Configuration
Within the Lambda function, review settings for the TableName and tempPassPhraseExpiryMinutes.
This value can be boosted from 5 minutes to a larger value for easier testing.


### Next Step
 * Setup the [User Profile page](./WEB.md)