### travel-browser
## Cognito Pool Setup

AWS Cognito is a service that grants permission to authenticated or unauthenticated users on the Internet.

We can setup a pool, and accompanying IAM role, to grant public users certain rights.
We want to allow users to connect to the AWS IOT thing subscription service, otherwise known as the MQTT Gateway,
and subscribe to be notified about new messages on certain defined topics.

1. Click to the [AWS Cognito console](https://console.aws.amazon.com/cognito/home)
1. Click the second button, Manage Identity Pools
1. Create a new Identity Pool
1. Call the pool askPool
1. Click **enable access to unauthenticated identities**
1. Click Create Pool

On the next page, you can review the two new Roles to be created.
Note the name of the second role, such as ```Cognito_askPoolUnauth_Role```
1. Click Allow without making any changes
1. The next page shows Sample Code.  Within the code, copy the red value called "Identity Pool ID"
1. Save this value.
1. Paste this value into the IdentityPoolId variable within the skill function: /lambda/custom/constants.js
1. Re-deploy your skill Lambda


### Next Step
 * Setup the [IOT Endpoint](./IOT.md)