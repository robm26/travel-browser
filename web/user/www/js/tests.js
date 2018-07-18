function testUpdateDom(testName) {
    console.log(`\n*****running testUpdateDom("${testName}")`);
    const desired = testMessages[testName];

    const test = {"payloadString": ""};
    test.payloadString = JSON.stringify({"state":{"desired":desired}});

    onMessageArrived(test);
}

const testMessages = {
    'launch':
        {
            "request": {
                "type": "LaunchRequest",
                "locale": "en-US",
                "requestId": "amzn1.echo-api.request.90e15a67-dd2d-4cf2-93bd-7a1234d0139f",
                "shouldLinkResultBeReturned": false,
                "timestamp": "2018-07-12T18:57:02.673Z"
            },
            "sessionAttributes": {"name":"pat"},
            "outputSpeech": {
                "type": "SSML",
                "ssml": "<speak><prosody rate='fast'>hello Bobby.   Say help to hear some options, or say browse cities.</prosody></speak>"
            },
            "reprompt": {
                "outputSpeech": {
                    "type": "SSML",
                    "ssml": "<speak>hello Bobby.   Say help to hear some options, or say browse cities.</speak>"
                }
            },
            "card": {
                "type": "Standard",
                "title": "Welcome!",
                "text": "Hello!\nThis is a card for your skill, Travel Browser\n\nhttps://bit.ly/travelbrowser\nEnjoy!",
                "image": {
                    "smallImageUrl": "https://s3.amazonaws.com/skill-images-789/cards/card_plane720_480.png",
                    "largeImageUrl": "https://s3.amazonaws.com/skill-images-789/cards/card_plane1200_800.png"
                }
            },
            "shouldEndSession": false
        },
    'name':
        {
            "request": {
                "type": "IntentRequest",
                "timestamp": "2018-07-12T19:00:18.721Z",
                "requestId": "amzn1.echo-api.request.90e15a67-dd2d-4cf2-93bd-7a1234d0139f",
                "shouldLinkResultBeReturned": false,
                "intent": {
                    "name": "MyNameIsIntent",
                    "slots": {
                        "firstname": {
                            "heardAs": "Dale",
                            "resolved": "",
                            "ERstatus": ""
                        }
                    }
                },
                "locale": "en-US"
            },
            "sessionAttributes": {"name":"delta"},
            "outputSpeech": {
                "type": "SSML",
                "ssml": "<speak><prosody rate='fast'>Hello, Dale. Did I pronounce that right?</prosody></speak>"
            },
            "reprompt": {
                "outputSpeech": {
                    "type": "SSML",
                    "ssml": "<speak>Hello, Dale. Did I pronounce that right?</speak>"
                }
            },
            "shouldEndSession": false
        }
};
