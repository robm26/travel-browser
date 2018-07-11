// This is an authentication and user profile service.
// A user will pass in a three part tempPassPhrase
// This is used to scan a DynamoDB table for a matching record
// But only if the record's tempPassPhrase is less than 5 minutes old

// Upon success, the user's entire attribute record is returned
// The user may update their attribute map with the same fresh tempPassPhrase


const AWSregion = 'us-east-1';  // us-east-1
const TableName = process.env.DYNAMODB_TABLE || 'askMemorySkillTable';

const tempPassPhraseExpiryMinutes = 5;

const AWS = require('aws-sdk');
AWS.config.region = process.env.AWS_REGION || 'us-east-1';

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

    const Now = new Date();
    const CutoffTime = new Date(Now - tempPassPhraseExpiryMinutes * 60000);

    console.log(Now);
    console.log(CutoffTime);

    const params = {
        TableName: TableName,
        FilterExpression: "attributes.tempPassPhrase = :tempPassPhrase AND attributes.linkTimestamp > :linkTimestamp",
        ExpressionAttributeValues: { ":tempPassPhrase": tempPassPhrase, ":linkTimestamp": CutoffTime.getTime() }
    };

    let docClient = new AWS.DynamoDB.DocumentClient();

    console.log('###############\nscanning items from DynamoDB table\n');

    docClient.scan(params, (err, data) => {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));

        } else {
            console.log(`\n##### found ${data.Items.length} records`);

            if (data.Items.length === 1) {  // lookup success, one record found
                const rec = data.Items[0];
                // const lastUseTime = JSON.stringify(rec.attributes.lastUseTimestamp);
                // const span = timeDelta(t1, t2);
                // if(span.timeSpanMIN <= 5) {
                //
                callback(rec);
                // } else {
                //     //
                // }
                // console.log(`rec.lastUseTimestamp :  `);



            } else {

                callback({"error":"session not found"});

            }


        }
    });

}
// -----------------------------------------


function writeDynamoItem(params, callback) {

    const AWS = require('aws-sdk');
    AWS.config.update({region: AWSregion});

    let docClient = new AWS.DynamoDB.DocumentClient();

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


function timeDelta(t1, t2) {

    const dt1 = new Date(t1);
    const dt2 = new Date(t2);
    const timeSpanMS = dt2.getTime() - dt1.getTime();
    const span = {
        "timeSpanMIN": Math.floor(timeSpanMS / (1000 * 60 )),
        "timeSpanHR":  Math.floor(timeSpanMS / (1000 * 60 * 60)),
        "timeSpanDAY": Math.floor(timeSpanMS / (1000 * 60 * 60 * 24)),
        "timeSpanDesc" : ""
    };

    if (span.timeSpanHR < 2) {
        span.timeSpanDesc = span.timeSpanMIN + " minutes";
    } else if (span.timeSpanDAY < 2) {
        span.timeSpanDesc = span.timeSpanHR + " hours";
    } else {
        span.timeSpanDesc = span.timeSpanDAY + " days";
    }

    return span;

}
