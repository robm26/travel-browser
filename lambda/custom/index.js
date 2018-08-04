// Travel Browser sample skill
// The function's IAM role requires DynamoDB and IOT permissions

'use strict';

const Alexa = require("ask-sdk");

const data      = require('./data.js');

const constants    = require('./constants.js');
const helpers      = require('./helpers.js');
const customhelpers = require('./customhelpers.js');
const interceptors = require('./interceptors.js');

const AWS = constants.AWS;
const DYNAMODB_TABLE = constants.DYNAMODB_TABLE;

// let AWS = require('aws-sdk');
// AWS.config.region = process.env.AWS_REGION || 'us-east-1';

const invocationName = constants.invocationName;

const LaunchHandler = {
    canHandle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const launchCount = sessionAttributes['launchCount'] || 0;

        return (handlerInput.requestEnvelope.request.type === 'LaunchRequest' || launchCount === 0);

    },
    handle(handlerInput) {

        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        const launchCount = sessionAttributes['launchCount'];
        const lastUseTimestamp = sessionAttributes['lastUseTimestamp'];

        const joinRank = '3'; // sessionAttributes['joinRank'];
        const skillUserCount = sessionAttributes['skillUserCount'];
        const preferredGreeting = sessionAttributes['preferredGreeting'] || `Welcome, `;

        const thisTimeStamp = new Date(handlerInput.requestEnvelope.request.timestamp).getTime();
        // console.log('thisTimeStamp: ' + thisTimeStamp);

        const span = helpers.timeDelta(lastUseTimestamp, thisTimeStamp);

        let namePronounce = sessionAttributes['namePronounce']
            || sessionAttributes['name']
            || helpers.randomArrayElement(['friend','buddy','dear user']);

        let say = ``;
        if (launchCount == 1) {
            say = `welcome new user! `
                + `<audio src='https://s3.amazonaws.com/ask-soundlibrary/magic/amzn_sfx_magic_blast_1x_01.mp3'/> `
                + `This skill will tell you about travel destinations. `;

        } else {

            say = `${preferredGreeting} ${namePronounce}.  `;
            if(launchCount % 2 == 0) {
                say += `This is your <say-as interpret-as="ordinal">${launchCount}</say-as> time using the skill.`;
                say += ` and it has been ${span.timeSpanDesc}. `;
            }

        }
        if(sessionAttributes.audioClip && sessionAttributes.audioClip.length === 26) {
        // say += `<audio src="https://s3.amazonaws.com/skill-images-789/mp3/user/5YC7UID123pSNhtEF7u6dB.mp3" />`;
        say += `Here is your audio message, <audio src="${constants.bucketUrlPath}${sessionAttributes.audioClip}" />`;

        }
        say += ' Say help to hear some options, or say browse cities. ';

        const responseBuilder = handlerInput.responseBuilder;

        const DisplayImg1 = constants.getDisplayImg1();
        const DisplayImg2 = constants.getDisplayImg2();

        if (helpers.supportsDisplay(handlerInput)) {
            const myImage1 = new Alexa.ImageHelper()
                .addImageInstance(DisplayImg1.url)
                .getImage();

            const myImage2 = new Alexa.ImageHelper()
                .addImageInstance(DisplayImg2.url)
                .getImage();

            const primaryText = new Alexa.RichTextContentHelper()
                .withPrimaryText('Welcome to the skill!')
                .getTextContent();

            responseBuilder.addRenderTemplateDirective({
                type : 'BodyTemplate2',
                token : 'string',
                backButton : 'HIDDEN',
                backgroundImage: myImage2,
                image: myImage1,
                title: helpers.capitalize(invocationName),
                textContent: primaryText,
            });
        }
        const welcomeCardImg = constants.getWelcomeCardImg();

        return handlerInput.responseBuilder
            .speak(say)
            .reprompt(say)
            .withStandardCard(`Welcome!`,
                `Hello!\nThis is a card for your skill, ${helpers.capitalize(invocationName)}\n\nhttps://bit.ly/travelbrowser\nEnjoy!`,
                welcomeCardImg.smallImageUrl,
                welcomeCardImg.largeImageUrl)
            .getResponse();

 //    .withStandardCard(`Travel Browser Pass Phrase`, `Go to:\nhttps://bit.ly/travelbrowser\n\nand enter:\n${phraseArray[0]} ${phraseArray[1]} ${phraseArray[2]}`)


    }
};

const LinkSessionHandler = {
    canHandle(handlerInput) {

        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'LinkSessionIntent');
    },

    async handle(handlerInput) {

        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;


        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        sessionAttributes['tempPassPhrase'] = helpers.generatePassPhrase().word1 + '-' + helpers.generatePassPhrase().word2 + '-' + helpers.generatePassPhrase().number;
        sessionAttributes['linkTimestamp'] = new Date(request.timestamp).getTime();

        let phraseArray = sessionAttributes.tempPassPhrase.split('-');

        let phrase = phraseArray[0] + ', ' + phraseArray[1] + ', <say-as interpret-as="digits">' + phraseArray[2] + '</say-as> ';

        sessionAttributes['IotTopic'] = 'ask' + handlerInput.requestEnvelope.session.user.userId.slice(-10);

        handlerInput.attributesManager.setPersistentAttributes(sessionAttributes);
        handlerInput.attributesManager.savePersistentAttributes();

        let say = `Okay I will tell you a web site and then a three part password. The password expires in five minutes. `;
        say += `The website is, bit dot lee, slash travel browser. `;
        say += `The password is ${phrase} .  Thats ${phrase} . `;
        say += `I have sent this to the Alexa app on your phone. `;
        say += ` Goodbye for now.`;

        return handlerInput.responseBuilder
            .speak(say)
            .withShouldEndSession(true)

            .withStandardCard(`Travel Browser Pass Phrase`, `Go to:\nhttps://bit.ly/travelbrowser\n\nand enter:\n${phraseArray[0]} ${phraseArray[1]} ${phraseArray[2]}`)
            .getResponse();

    }
};

const BrowseCitiesHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'BrowseCitiesIntent';
    },


    async handle(handlerInput) {

        const request = handlerInput.requestEnvelope.request;

        let say = ``;

        let slotStatus = ``;

        let slotValues = helpers.getSlotValues(request.intent.slots);
        const countryList = await data.getCountryList();
        // getSlotValues returns .heardAs, .resolved, and .isValidated for each slot, according to request slot status codes ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions

        // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
        //   SLOT: country
        let country = slotValues.country.resolved || slotValues.country.heardAs || '';

        let list = data.getCityList(country);
        let sortedList = helpers.sortArray(list.slice());
        const cityListShort = helpers.sayArray(helpers.shuffleArray(list).slice(0,3));

        if (slotValues.country.heardAs) {
            slotStatus += ` Here are some cities we serve in ${slotValues.country.heardAs}. `;

            if (slotValues.country.ERstatus === 'ER_SUCCESS_MATCH') {
                if(slotValues.country.resolved !== slotValues.country.heardAs) {
                    slotStatus += `a valid synonym for ` + slotValues.country.resolved + `. `;
                }
            }

            slotStatus += `${cityListShort} `;

        } else {

            slotStatus += `Here are some cities we serve. ${cityListShort}. `;
            slotStatus += `You can also ask me to filter the list.  Just say, browse by `;
        }


        if (slotValues.country.ERstatus === 'ER_SUCCESS_NO_MATCH') {
            slotStatus += `which is not a country I know about yet. `;
            console.log(`***** consider adding "${slotValues.country.heardAs}" to the custom slot type used by slot country! `);
        }

        if( (slotValues.country.ERstatus === 'ER_SUCCESS_NO_MATCH') ||  (!slotValues.country.heardAs) ) {

            slotStatus += helpers.sayArray(helpers.shuffleArray(countryList).slice(0,3), `or`) + `, for example. `;
       }

        say += slotStatus;

        const cardText = helpers.displayListFormatter(sortedList, `card`);

        const itemList = helpers.displayListFormatter(sortedList, `list`);

        const DisplayImg1 = constants.getDisplayImg1();
        const DisplayImg2 = constants.getDisplayImg2();

        if (helpers.supportsDisplay(handlerInput)) {


            handlerInput.responseBuilder.addRenderTemplateDirective({
                type : 'ListTemplate1',
                token : 'string',
                backButton : 'hidden',
                backgroundImage: DisplayImg2,
                image: DisplayImg1,
                title: helpers.capitalize(invocationName),
                listItems : itemList

            });
        }

        return handlerInput.responseBuilder
            .speak(say)
            .reprompt(`Try again.  ${say}`)
            .withSimpleCard(` ${country} Destinations`, cardText)
            .getResponse();
    }
};

const ShowCityHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'ShowCityIntent';
    },

    async handle(handlerInput) {

        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;

        let say = ``;
        let slotStatus = ``;

        let slotValues = helpers.getSlotValues(request.intent.slots);

        //   SLOT: city
        if (slotValues.city.heardAs) {
            slotStatus += `${helpers.randomArrayElement([`Here is`,`Let's visit`,`Welcome to`])}, ${slotValues.city.heardAs}. `;

        } else {
            slotStatus += `I didn\'t catch your city.  Can you repeat? `;
        }

        if (slotValues.city.ERstatus === 'ER_SUCCESS_MATCH') {

            if(slotValues.city.resolved !== slotValues.city.heardAs) {
                slotStatus += `a valid synonym for ` + slotValues.city.resolved + `. `;
            }

        }
        if (slotValues.city.ERstatus === 'ER_SUCCESS_NO_MATCH') {
            slotStatus += `which is a new city I am not familiar with yet. I am always learning from things you say.  For now, `;
            console.log(`***** consider adding "${slotValues.city.heardAs}" to the custom slot type used by slot city! `);
        }

        if( (slotValues.city.ERstatus === 'ER_SUCCESS_NO_MATCH') ||  (!slotValues.city.heardAs) ) {
            slotStatus += `A few valid values are, `
                + helpers.sayArray(helpers.getExampleSlotValues('ShowCityIntent','city'), 'or');

        }

        say += slotStatus;

        let city = slotValues.city.resolved || slotValues.city.heardAs || ``;

        // throw artificial error
        if (city === 'unicorn') {
            let foo = constants.getUnicorns();
        }

        let cardText = `${city} is an amazing city. `;

        const airportCode = data.getAirportCode(city);
        if (airportCode !== `unknown`) {
            say += `To book travel here, use airport code <say-as interpret-as="characters">${airportCode}</say-as>. `;
            cardText += `To book travel here, use airport code ${airportCode}.\n`;

        }
        const description = data.getDescription(city);
        say += description || ``;

        const img = data.getImgUrl(city);

        if (helpers.supportsDisplay(handlerInput)) {

            const myImage1 = new Alexa.ImageHelper()
                .addImageInstance(img)
                .getImage();

            const myImage2 = new Alexa.ImageHelper()
                .addImageInstance(img)
                .getImage();

            const primaryText = new Alexa.RichTextContentHelper()
                .withPrimaryText(`Here is ${city}!`)
                .getTextContent();

            responseBuilder.addRenderTemplateDirective({
                              type: 'BodyTemplate6',
                              token: 'string',
                              backButton: 'HIDDEN',
                              backgroundImage: myImage2,
                              image: myImage1,
                              title: helpers.capitalize(invocationName),
                              textContent: primaryText
                        });

        }

        return handlerInput.responseBuilder
            .speak(say)
            .reprompt(`Try again.  ${say}`)
            .withStandardCard(`${city}`, cardText, img, img)
            .getResponse();

    }
};

const MyNameIsHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'MyNameIsIntent';
    },

    handle(handlerInput) {
        const myName = handlerInput.requestEnvelope.request.intent.slots.firstname.value;
        let say;

        if(typeof myName == 'undefined') {
            say = `Sorry, I didn't catch your name. `;

        } else {
            say = `Hello, ${myName}. Did I pronounce that right? `;
            let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
            sessionAttributes['name'] = myName;

        }
        return handlerInput.responseBuilder
            .speak(say)
            .reprompt(say)
            .getResponse();

    }
};

const ElementSelectedHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'Display.ElementSelected';
    },
    handle(handlerInput) {
        let say = `You clicked on ${handlerInput.requestEnvelope.request.token}. `;

        return handlerInput.responseBuilder
            .speak(say)
            .reprompt(say)
            .getResponse();
    }
};

const MyNameIsYesNoHandler = {
    canHandle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        let previousIntent = '';
        if(sessionAttributes.history.length > 1) {
            previousIntent = sessionAttributes.history[sessionAttributes.history.length - 2].IntentRequest || ``;
        } else {
            previousIntent = '';
        }

        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.YesIntent' || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NoIntent')
            && previousIntent === 'MyNameIsIntent';
    },
    handle(handlerInput) {
        // const firstName = handlerInput.requestEnvelope.request.intent.slots.firstname.value || '';

        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        let previousIntent = sessionAttributes.history[sessionAttributes.history.length - 2];

        // console.log('*** previousIntent ' + JSON.stringify(previousIntent));

        const firstName = previousIntent.slots.firstname || ``;
        sessionAttributes["name"] = firstName;

        let say = ``;

        if (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.YesIntent'){

            sessionAttributes["namePronounce"] = firstName;
            say = ` Okay great, I will remember your name. What else can I help you with? `;
        } else {
            //sessionAttributes["name"] = '';
            sessionAttributes["namePronounce"] = ' ';
            sessionAttributes["name"] = ' ';
            say = ` Sorry I could not hear your name! `
                    + ` You can teach me how to pronounce your name on the companion web page.  Just say, link browser. `;
        }

        handlerInput.attributesManager.setPersistentAttributes(sessionAttributes);
        handlerInput.attributesManager.savePersistentAttributes();

        return handlerInput.responseBuilder
            .speak(say)
            .reprompt(say)
            .getResponse();

    }
};

const SpeakSpeedHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'SpeakSpeedIntent';
    },

    handle(handlerInput) {
        const speakingSpeedChange = handlerInput.requestEnvelope.request.intent.slots.speakingSpeedChange.value;
        let say;

        if(typeof speakingSpeedChange === 'undefined') {
            say = "Sorry, I didn't catch your speak speed.  Say, speak faster, or, speak slower. ";

        } else {

            const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

            let newSpeed = helpers.changeProsody('rate',sessionAttributes['speakingSpeed'],speakingSpeedChange);

            sessionAttributes['speakingSpeed'] = newSpeed;
            say = "Okay, I will speak " + speakingSpeedChange + " now!";

            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

            // handlerInput.attributesManager.setPersistentAttributes(sessionAttributes);
            // handlerInput.attributesManager.savePersistentAttributes();  // already saving in ResponseInterceptor
        }
        return handlerInput.responseBuilder
            .speak(say)
            .reprompt(say)
            .getResponse();

    }
};

const MyPhoneNumberHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'MyPhoneNumberIntent';
    },
    handle(handlerInput) {

        const request = handlerInput.requestEnvelope.request;

        const currentIntent = request.intent;

        if (request.dialogState && request.dialogState !== 'COMPLETED') {
            return handlerInput.responseBuilder
                .addDelegateDirective(currentIntent)
                .getResponse();
        }

        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        let slotStatus = '';
        let mobileNumber;

        if (request.intent.slots.mobileNumber.value) {
            mobileNumber = request.intent.slots.mobileNumber.value;
            slotStatus += ' slot mobile number was heard as ' + mobileNumber + '. ';
            sessionAttributes['mobileNumber'] = mobileNumber;

        } else {
            slotStatus += ' slot mobile number is empty. ';
        }
        const emojiSmile = constants.getEmoji('smile');
        const bodyText = 'Hello! ' + emojiSmile + ' from the Alexa skill!\n'
            + 'Here is the show I think you will love: \n'
            // + 'https://www.amazon.com/dp/B01C4MGKQE/ref=cm_sw_r_tw_dp_U_x_HNi4AbJEHN1G0';
            // + 'https://youtu.be/DLzxrzFCyOs'
             + 'https://www.amazon.com/dp/B06VYH1GF7/ref=cm_sw_r_tw_dp_x_55QoBbDZR11WN';


        const params = {
            PhoneNumber: mobileNumber.toString(),
            Message: bodyText
        };

        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

        return new Promise((resolve) => {
            helpers.sendTxtMessage(params, request.locale, myResult=>{
                let say = myResult + ' What else can I help you with?';

                resolve(handlerInput.responseBuilder
                    .speak(say)
                    .reprompt('Try again. ' + say)
                    .getResponse()
                );
            });
        });

    }
};



const HelpHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    async handle(handlerInput) {
        let say = `You asked for help. `;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        let history = sessionAttributes['history'];


        if (!handlerInput.requestEnvelope.session.new) {
            say += `Your last intent was ${history[history.length-2].IntentRequest}. `;
            // prepare context-sensitive help messages here
        }
        say += `You can say things like, browse cities, show cities in a country, go to a city, my name is, link browser, reset profile. `;

        return handlerInput.responseBuilder
            .speak(say)
            .reprompt('Try again. ' + say)
            .getResponse();
    }
};

const ResetHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'ResetIntent';
    },
    handle(handlerInput) {

        let say = '<say-as interpret-as="interjection">heads up</say-as>, I will clear all your profile data and history for this skill.  Are you sure?';

        return handlerInput.responseBuilder
            .speak(say)
            .reprompt('Try again. ' + say)
            .getResponse();
    }
};

const YesHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.YesIntent';
    },
    handle(handlerInput) {
        let say = '';
        let end = false;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        let previousIntent = sessionAttributes.history[sessionAttributes.history.length - 2].IntentRequest;

        if (handlerInput.requestEnvelope.session.new) {
            say = 'Yes! Welcome to the skill';
        } else {
            if (previousIntent === "ResetIntent") {

                const initialAttributes = constants.getMemoryAttributes();

                sessionAttributes = initialAttributes;

                handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
                handlerInput.attributesManager.setPersistentAttributes(sessionAttributes);
                handlerInput.attributesManager.savePersistentAttributes();
                end = true;

                say = 'okay, I have deleted all your profile data.  When you open this skill again you will be a new user.';

            } else {
                say = 'You said yes.  Your previous intent was ' + previousIntent + '. Say help if you want to hear some options? ';
            }

        }
        if (end) {
            return handlerInput.responseBuilder
                .speak(say)
                .withShouldEndSession(true)
                .getResponse();

        } else {
            return handlerInput.responseBuilder
                .speak(say)
                .reprompt('Try again. ' + say)
                .getResponse();

        }

    }
};

const NoHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NoIntent';
    },
    handle(handlerInput) {

        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        let say = ``;

        if (sessionAttributes.history.length < 2) {
            say = `No? Okay. What can I help you with?`;
        } else {
            let previousIntent = sessionAttributes.history[sessionAttributes.history.length - 2].IntentRequest;
            if (previousIntent === "ResetIntent") {

                say = `okay, I will not delete anything.  What else can I help you with?`;

            } else {
                say = `Okay. What can I help you with?`;
            }

        }

        return handlerInput.responseBuilder
            .speak(say)
            .reprompt('Try again. ' + say)
            .getResponse();
    }
};

const ExitHandler = {
    canHandle(handlerInput) {
        return (handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
            || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent')
        ) || handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';

    },
    handle(handlerInput) {
        const responseBuilder = handlerInput.responseBuilder;

        return responseBuilder
            .speak('Talk to you later!')
            .withShouldEndSession(true)
            .getResponse();
    }
};

const UnhandledHandler = {
    canHandle(handlerInput) {
        return true;  // will catch AMAZON.FallbackIntent or any other requests
    },
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        console.log('Unhandled request: ');
        console.log(JSON.stringify(request, null, 2));
        let IntentRequest = (request.type === 'IntentRequest' ? request.intent.name : request.type);

        const outputSpeech = (constants.debug ? `Sorry, I don\'t have a handler for ${IntentRequest}` : `Sorry , I didn\'t understand that. Please try something else.`);

        return handlerInput.responseBuilder
            .speak(outputSpeech)
            .reprompt(outputSpeech)
            .getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const debug = true;
        const stack = error.stack.split('\n');
        console.log(stack[0]);
        console.log(stack[1]);
        console.log(stack[2]);

        let errorLoc = stack[1].substring(stack[1].lastIndexOf('/') + 1, 900);

        errorLoc = errorLoc.slice(0, -1);

        const file = errorLoc.substring(0, errorLoc.indexOf(':'));
        let line = errorLoc.substring(errorLoc.indexOf(':') + 1, 900);
        line = line.substring(0, line.indexOf(':'));

        let speechOutput = 'Sorry, an error occurred. ';
        if(debug) {
            speechOutput +=  error.message + ' in ' + file + ', line ' + line;
        }

        return handlerInput.responseBuilder
            .speak(speechOutput)
            .reprompt(speechOutput)
            .getResponse();
    },
};


const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
    .addRequestHandlers(
        ElementSelectedHandler,
        BrowseCitiesHandler,
        ShowCityHandler,

        LinkSessionHandler,
        MyNameIsHandler,
        MyNameIsYesNoHandler,

        LaunchHandler,
        MyPhoneNumberHandler,
        SpeakSpeedHandler,

        ResetHandler,
        HelpHandler,
        ExitHandler,

        YesHandler,
        NoHandler,
        UnhandledHandler
    )
    .addErrorHandlers(ErrorHandler)
    .addRequestInterceptors(interceptors.RequestPersistenceInterceptor)
    .addRequestInterceptors(interceptors.RequestHistoryInterceptor)
    .addRequestInterceptors(interceptors.RequestJoinRankInterceptor)

    .addResponseInterceptors(interceptors.ResponsePersistenceInterceptor)
    .addResponseInterceptors(interceptors.SpeechOutputInterceptor)
    .addResponseInterceptors(interceptors.IotInterceptor)

    .withTableName(DYNAMODB_TABLE)
    .withAutoCreateTable(true)

    // .withPartitionKeyGenerator(PartitionKeyGenerators.userId or deviceId (define values stored in "id" column)
    // .withPartitionKeyName('myKeyName') // override default primary key name "id"
    // .withDynamoDbClient(constants.localDynamoClient)

    .lambda();

//------------------------------------------------------------------------------
