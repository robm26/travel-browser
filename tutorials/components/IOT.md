### travel-browser
## IOT Setup


The Internet of Things, or IOT, normally refers to a network of physical endpoint devices, or things.

Using messaging and routing services within AWS IOT,
we can build a skill that pushes live session data into a web browser over a MQTT websocket connection.


#### Steps
1. You have the AWS CLI installed on your command line.  Type: ```aws iot describe-endpoint```
1. Copy the value, such as ```a3npzlqqmmvra.iot.us-east-1.amazonaws.com```
1. Paste this near the top of the skill constants file:
 * /lambda/custom/constants.js   mqttEndpoint
1. Re-deploy your skill Lambda code


The web app authenticate to the will call the usersessionAPI, and receive the user's persistent attributes,
which include three key connection details:
 * IdentityPoolId
 * mqttEndpoint
 * IotTopic

 Rest API endpoint using MQTT.
 It will specify a topic to listen to, such as:
 ```$aws/things/thing1/shadow/update/accepted```

 You are done!  Go to configuring [S3](./S3.md)

Continue on to create a thing shadow ad get the Rest endpoint manually (optional).

1. Within the [AWS Console](https://console.aws.amazon.com/iot/home), Search for IOT, choose IOT Core.
1. Cancel any popups and intro panels.
1. On the left menu, select Manage, then Things.
1. You should see and click a button to Create a new thing.
1. Click "Create a single thing"
1. Give your thing a name: "thing1" and click Next
1. Click "Create thing without certificate"
1. A new thing appears in a box on the Manage/Things page.
1. Click on the thing to load the Thing Details page.
1. From the left menu, click on "Interact"
1. A HTTPS Rest API endpoint is displayed, such as ```a3npzlqqmmvra.iot.us-east-1.amazonaws.com```

If you had a physical IOT hardware device such as a Raspberry PI,
you could create another thing with certificates, and get drivers to link the device directly to AWS IOT.

Instead, we will use our browser app to connect like a physical device.
The browser can listen to any topic whether or not a thing exists.
The skill assigns a unique topic to each skill user, so as to maintain privacy between skill users.

Continue on to create an [S3](./S3.md)
