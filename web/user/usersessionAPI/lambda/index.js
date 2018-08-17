// This is an authentication and user profile service.
// A user will pass in a three part tempPassPhrase
// This is used to scan a DynamoDB table for a matching record
// But only if the record's tempPassPhrase is less than 5 minutes old
// Upon success, the user's entire attribute record is returned
// The user may update their attribute map with the same fresh tempPassPhrase
const bucket = 'skill-images-789';

const TableName = process.env.DYNAMODB_TABLE || 'ask-travel-browser';

const tempPassPhraseExpiryMinutes = 14400;  // = 14400 minutes is ten days, adjust to 5 minutes before going live


const AWS = require('aws-sdk');
AWS.config.region = process.env.AWS_REGION || 'us-east-1';


// console.log('*** loading AlexaMemoryUserProfileFunction\n\n');

exports.handler = function(event, context, callback) {

    let tempPassPhrase = '';

    if (event.queryStringParameters !== null && event.queryStringParameters !== undefined) {
        if (event.queryStringParameters.tempPassPhrase !== undefined &&
            event.queryStringParameters.tempPassPhrase !== null &&
            event.queryStringParameters.tempPassPhrase !== "") {
            // console.log("Received\ntempPassPhrase: " + event.queryStringParameters.tempPassPhrase + '\nevent.path: ' + event.path);
            tempPassPhrase = event.queryStringParameters.tempPassPhrase;
        }
    }
    //
    // if(event.file) {
    //     let buff = new Buffer(event.file, 'base64');
    //
    //     saveFile(buff, 'abcde333.mp3', function(result) {
    //         console.log('saved, result: ' + result);
    //
    //     });
    // }

    // if (event.path === '/update') {

        scanDynamoTableForPhrase(tempPassPhrase, TableName, userRecord=>{
            console.log(`userRecord\n${JSON.stringify(userRecord)}`);
            if ('attributes' in userRecord) {  // found user
                // console.log(`**** event.body.attributes: ${event.body.attributes}`);

                if(event.path === `/lookup`) { // GET read user profile

                    const response = {
                        statusCode: 200,
                        headers: {"Access-Control-Allow-Origin": "*"},
                        // isBase64Encoded: "false",
                        body: JSON.stringify(userRecord)
                    };
                    callback(null, response);


                } else { // POST update user profile

                    // AWS API Gateway Lambda Proxy event.body is string format
                    //  Usually Lambda inputs are JSON

                    let bodyObj = (typeof event.body === 'string' ? JSON.parse(event.body) : event.body );

                    console.log(`***** event.body\n${event.body}`);


                    let newAttrObj = Object.assign(userRecord.attributes, bodyObj.attributes);

                    // return object of userRecord with any event.body source values updated
                    let buff;
                    let newObjName;
                    if (bodyObj.file) { // Save new media file
                        let token = makeid(12);
                        newObjName = `${userRecord.id.slice(-10)}${token}.mp3`;
                        buff = new Buffer(bodyObj.file, 'base64');

                        // console.log(`newObjName:\n${newObjName}`);
                        newAttrObj['audioClip'] = newObjName;
                    }

                    console.log(`newObjName: ${newObjName}`);

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
                            body: JSON.stringify(params.Item)
                        };

                        if (bodyObj.file) {
                            // console.log(`$$$$$ event.body.file ${typeof event.body.file}`);

                            saveFile(buff, newObjName, function(result) {
                                console.log('saved file!');

                                callback(null, response);
                            });
                        } else {
                            callback(null, response);
                        }

                    });

                }
            }
        });
    // } else {  // lookup user attributes based on pass phrase - HTTPS GET
    //
    //     scanDynamoTableForPhrase(tempPassPhrase, TableName, userRecord => {
    //         // console.log(userRecord);
    //         const response = {
    //             statusCode: 200,
    //             headers: {"Access-Control-Allow-Origin": "*"},
    //             isBase64Encoded: false,
    //             body: userRecord
    //         };
    //         callback(null, response);
    //
    //     });
    //
    // }

};
// -----------------------------------------

function scanDynamoTableForPhrase(tempPassPhrase, TableName, callback) {

    const Now = new Date();
    const CutoffTime = new Date(Now - tempPassPhraseExpiryMinutes * 60000);

    const params = {
        TableName: TableName,
        FilterExpression: "attributes.tempPassPhrase = :tempPassPhrase AND attributes.linkTimestamp > :linkTimestamp",
        ExpressionAttributeValues: { ":tempPassPhrase": tempPassPhrase, ":linkTimestamp": CutoffTime.getTime() }
    };

    let docClient = new AWS.DynamoDB.DocumentClient();

    // console.log('###############\nscanning items from DynamoDB table\n');

    docClient.scan(params, (err, data) => {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));

        } else {
            // console.log(`\n##### found ${data.Items.length} records`);

            if (data.Items.length === 1) {  // lookup success, one record found
                const rec = data.Items[0];
                let lts =  rec.attributes.linkTimestamp || 0;
                let elapsed = timeDelta(Now.getTime() - (tempPassPhraseExpiryMinutes * 60000), lts);
                //
                // console.log(`\nlts: ${lts}`);
                // console.log(`elapsed: ${JSON.stringify(elapsed, null, 2)}`);
                rec.timeLeft = elapsed.timeSpanSEC;

                callback(rec);

            } else {

                callback({"error":"session not found"});

            }


        }
    });

}
// -----------------------------------------

function writeDynamoItem(params, callback) {

    let docClient = new AWS.DynamoDB.DocumentClient();

    docClient.put(params, (err, data) => {
        if (err) {
            console.error("Unable to write item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            //console.log('writeDynamoItem succeeded:", JSON.stringify(data, null, 2));

            callback(data);

        }
    });

}

function saveFile(file, fileName, callback) {

    // console.log(`^^^^ sf ${typeof file}`);
    // console.log(`^^^^ sf ${file}`);

    if(!file) {
        callback(fileName);
    }

    let fn = `mp3/user/${fileName}`;

    params = {
        Bucket: bucket,
        Key: fn,
        Body: file,
        ACL: "public-read"
    };

    const s3 = new AWS.S3();

    s3.putObject(params, function(err, data) {
        if (err) {
            console.log(err);
            callback('error saving file');

        } else {
            console.log("Successfully uploaded file to S3");
            callback(fileName);
        }
    });

}


function timeDelta(t1, t2) {

    const dt1 = new Date(t1);
    const dt2 = new Date(t2);
    const timeSpanMS = dt2.getTime() - dt1.getTime();
    const span = {
        "timeSpanSEC": Math.floor(timeSpanMS / (1000 )),
        "timeSpanMIN": Math.floor(timeSpanMS / (1000 * 60 )),
        "timeSpanHR":  Math.floor(timeSpanMS / (1000 * 60 * 60)),
        "timeSpanDAY": Math.floor(timeSpanMS / (1000 * 60 * 60 * 24)),
        "timeSpanDesc" : ""
    };

    // if (span.timeSpanHR < 2) {
    //     span.timeSpanDesc = span.timeSpanMIN + " minutes";
    // } else if (span.timeSpanDAY < 2) {
    //     span.timeSpanDesc = span.timeSpanHR + " hours";
    // } else {
    //     span.timeSpanDesc = span.timeSpanDAY + " days";
    // }

    return span;

}

function makeid(size) {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < size; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
