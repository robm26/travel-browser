
let AWS = require('aws-sdk');
AWS.config.region = process.env.AWS_REGION || 'us-east-1';

const DYNAMODB_TABLE = process.env.DYNAMODB_TABLE || 'askMemorySkillTable';

const IdentityPoolId = process.env.IdentityPoolId; // || 'us-east-1:583dd84a-7792-49a6-9ce5-5624f80378e7';
const bucketUrlPath = process.env.bucketUrlPath || `https://s3.amazonaws.com/skill-images-789/mp3/user/`;

console.log('DYNAMODB_TABLE ' + DYNAMODB_TABLE);

const localDynamoClient = new AWS.DynamoDB({apiVersion : 'latest', endpoint : 'http://localhost:8000'});

module.exports = {
        'debug':true,
        'AWS': AWS,
        'DYNAMODB_TABLE': DYNAMODB_TABLE,
        "IdentityPoolId": IdentityPoolId,
        "bucketUrlPath":  bucketUrlPath,
        'invocationName': 'travel browser',

        'getMemoryAttributes': function() {
            const memoryAttributes = {

            "history":[],

            "launchCount":0,
            "lastUseTimestamp":0,
            "joinRank": 1,
            "skillUserCount": 1,

            "name":" ",
            "namePronounce":" ",
            "preferredGreeting":"hello",
            "speakingSpeed":"medium",
            "mobileNumber":" ",
            "audioClip": " ",
            "homeAirport":"BOS",
            "visitWishList":[],

            "tempPassPhrase":"sweet-dog-721",
            "linkTimestamp":0,

            "mqttEndpoint":" ",
            "IdentityPoolId":IdentityPoolId,
            "IotTopic":"ask-thing-topic"

            // "email":"",
            // "mobileNumber":"",
            // "city":"",
            // "state":"",
            // "postcode":"",
            // "birthday":"",
            // "wishlist":[],

        };

        return memoryAttributes;
    },
    'getWelcomeCardImg': function() {
        return {
            smallImageUrl: "https://s3.amazonaws.com/skill-images-789/cards/card_plane720_480.png",
            largeImageUrl: "https://s3.amazonaws.com/skill-images-789/cards/card_plane1200_800.png"
        };
    },
    'getDisplayImg1': function() {
        return {
            title: 'Jet Plane',
            url: 'https://s3.amazonaws.com/skill-images-789/display/plane340_340.png',

        };
    },
    'getDisplayImg2': function() {
        return  {
                    title: 'Starry Sky',
                    url: 'https://s3.amazonaws.com/skill-images-789/display/background1024_600.png'

        };
    },


    'getMaxHistorySize': function() {  // number of intent/request events to store
        return 3;
    },


    'getEmoji': function(emojiName) {

        const emoji = {
            'thumbsup': '\uD83D\uDC4D',
            'smile': '\uD83D\uDE0A',
            'star': '\uD83C\uDF1F',
            'robot': '\uD83E\uDD16',
            'germany': '\ud83c\udde9\ud83c\uddea',
            'uk': '\ud83c\uddec\ud83c\udde7',
            'usa': '\ud83c\uddfa\ud83c\uddf8'
            // Escaped Unicode for other emoji:  https://github.com/wooorm/gemoji/blob/master/support.md

        };

        if (emojiName in emoji) {
            return emoji[emojiName];
        } else {
            return 'NotFound';
        }
    }

};

