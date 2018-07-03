const AWSregion = 'us-east-1';  // us-east-1
const TableName = process.env.DYNAMODB_TABLE || 'askMemorySkillTable';

const AWS = require('aws-sdk');
AWS.config.update({
    region: AWSregion
});


console.log('*** loading AlexaMemoryUserProfileFunction\n\n');

exports.handler = function(event, context, callback) {

    let tempPassPhrase = '';

    if (event.queryStringParameters !== null && event.queryStringParameters !== undefined) {
        if (event.queryStringParameters.tempPassPhrase !== undefined &&
            event.queryStringParameters.tempPassPhrase !== null &&
            event.queryStringParameters.tempPassPhrase !== "") {
            console.log("Received tempPassPhrase: " + event.queryStringParameters.tempPassPhrase);
            tempPassPhrase = event.queryStringParameters.tempPassPhrase;
        }
    }

    if (event.path === '/update') {

        console.log('*** in post body section');

        scanDynamoTableForPhrase(tempPassPhrase, TableName, userRecord=>{
            console.log(userRecord);
            if ('attributes' in userRecord) {  // found user

                let newAttrObj = Object.assign(userRecord.attributes, JSON.parse(event.body).attributes);

                // console.log('*** newAttrObj: ' + JSON.stringify(newAttrObj));
                const params = {
                    TableName: TableName,
                    Item: {
                        "id": userRecord.id,
                        "attributes": newAttrObj
                    }
                };

                writeDynamoItem(params, myResult => {
                    // callback(null, myResult);
                    const response = {
                        statusCode: 200,
                        headers: {"Access-Control-Allow-Origin":"*"},
                        body: JSON.stringify(myResult)
                    };
                    callback(null, response);

                });

            }

        });

    } else {  // lookup user attributes based on pass phrase

        scanDynamoTableForPhrase(tempPassPhrase, TableName, userRecord => {
            // console.log(userRecord);
            const response = {
                statusCode: 200,
                headers: {"Access-Control-Allow-Origin": "*"},
                body: JSON.stringify(userRecord)
            };
            callback(null, response);

        });
    }


};
// -----------------------------------------

function scanDynamoTableForPhrase(tempPassPhrase, TableName, callback) {

    const params = {
        TableName: TableName,
        FilterExpression: "attributes.tempPassPhrase = :tempPassPhrase",
        ExpressionAttributeValues: { ":tempPassPhrase": tempPassPhrase }

    };

    let docClient = new AWS.DynamoDB.DocumentClient();

    // console.log('scanning items from DynamoDB table');

    docClient.scan(params, (err, data) => {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));

        } else {

            if (data.Items.length === 1) {  // lookup success, one record found

                callback(data.Items[0]);

            } else {

                callback({"error":"single record not found"});

            }


        }
    });

}
// -----------------------------------------

function readDynamoItem(params, callback) {

    var AWS = require('aws-sdk');
    AWS.config.update({region: AWSregion});

    var docClient = new AWS.DynamoDB.DocumentClient();

    console.log('reading item from DynamoDB table');

    docClient.get(params, (err, data) => {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            // console.log("readDynamoItem succeeded:", JSON.stringify(data, null, 2));

            callback(JSON.stringify(data));


        }
    });

}
// -----------------------------------------
function writeDynamoItem(params, callback) {

    var AWS = require('aws-sdk');
    AWS.config.update({region: AWSregion});

    var docClient = new AWS.DynamoDB.DocumentClient();

    console.log('writing item to DynamoDB table');

    docClient.put(params, (err, data) => {
        if (err) {
            console.error("Unable to write item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            //console.log('writeDynamoItem succeeded:", JSON.stringify(data, null, 2));

            callback(JSON.stringify(data));

        }
    });

}
