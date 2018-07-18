/**
 * Created by mccaul on 5/11/18.
 */
const constants = require('./constants.js');
const helpers = require('./helpers.js');

const AWS = constants.AWS;
const DYNAMODB_TABLE = constants.DYNAMODB_TABLE;

module.exports = {
    'IotInterceptor':{
        process(handlerInput, responseOutput) {

            return new Promise((resolve, reject) => {

                // console.log('******** in IotInterceptor');

                const flattenedRequest = flattenRequest(handlerInput.requestEnvelope.request);

                const fullEvent = {
                    "request":  flattenedRequest,

                    "sessionAttributes":  handlerInput.requestEnvelope.session.attributes,
                    // "sessionAttributes":  responseOutput.sessionAttributes,
                    //"context":  handlerInput.requestEnvelope.context,  // display support

                    "outputSpeech":responseOutput.outputSpeech,
                    "reprompt":responseOutput.reprompt,
                    // "directives":responseOutput.directives,  // nested too deep
                    "card":responseOutput.card,
                    "shouldEndSession":responseOutput.shouldEndSession
                };

                // console.log(JSON.stringify(responseOutput, null, 2));
                let userId = handlerInput.requestEnvelope.session.user.userId;
                let userIdShort = 'ask' + userId.slice(-10);

                // console.log(`updating shadow\n${userIdShort}`);


                helpers.updateShadow(constants.mqttEndpoint, userIdShort, fullEvent, result => {
                    // console.log(`helpers.updateShadow result ${result}`);
                    resolve();
                });


            });

            // console.log(`result : ${result}`);
        }
    },

    'RequestHistoryInterceptor': {
        process(handlerInput) {

            const maxHistorySize = constants.getMaxHistorySize();  // number of intent/request events to store

            const thisRequest = handlerInput.requestEnvelope.request;
            let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

            let history = sessionAttributes['history'];

            let IntentRequest = {};
            if (thisRequest.type === 'IntentRequest') {

                let slots = {};

                IntentRequest = {
                    'IntentRequest': thisRequest.intent.name
                };

                if (thisRequest.intent.slots) {

                    for (let slot in thisRequest.intent.slots) {
                        slots[slot] = thisRequest.intent.slots[slot].value;
                    }

                    IntentRequest = {
                        'IntentRequest': thisRequest.intent.name,
                        'slots': slots
                    };

                }

            } else {
                IntentRequest = {'IntentRequest': thisRequest.type};
            }

            if (history.length >= maxHistorySize) {
                history.shift();
            }
            history.push(IntentRequest);

            handlerInput.attributesManager.setPersistentAttributes(sessionAttributes);

            // }

        }
    },

    'RequestPersistenceInterceptor': {
        process(handlerInput) {
            if(handlerInput.requestEnvelope.session['new']) {

                return new Promise((resolve, reject) => {

                    handlerInput.attributesManager.getPersistentAttributes()

                        .then((sessionAttributes) => {
                            sessionAttributes = sessionAttributes || {};

                            // console.log(JSON.stringify(sessionAttributes, null, 2));

                            if(Object.keys(sessionAttributes).length === 0) {
                                // console.log('--- First Ever Visit for userId ' + handlerInput.requestEnvelope.session.user.userId);

                                const initialAttributes = constants.getMemoryAttributes();
                                sessionAttributes = initialAttributes;

                            }

                            sessionAttributes['launchCount'] += 1;
                            // sessionAttributes['tempPassPhrase'] = generatePassPhrase().word1 + '-' + generatePassPhrase().word2 + '-' + generatePassPhrase().number;

                            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

                            handlerInput.attributesManager.savePersistentAttributes()
                                .then(() => {
                                    resolve();
                                })
                                .catch((err) => {
                                    reject(err);
                                });

                        });

                });

            } // end session['new']


        }
    },

    'RequestJoinRankInterceptor': {
        process(handlerInput) {
            if(handlerInput.requestEnvelope.session['new']) {

                return new Promise((resolve) => {
                    helpers.getRecordCount(skillUserCount => {

                        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

                        if(sessionAttributes['launchCount'] === 1) {
                            sessionAttributes['joinRank'] = skillUserCount;
                        }
                        sessionAttributes['skillUserCount'] = skillUserCount;
                        resolve();

                    });
                });

            }

        }
    },

    'ResponsePersistenceInterceptor': {
        process(handlerInput, responseOutput) {

            const ses = (typeof responseOutput.shouldEndSession == "undefined" ? true : responseOutput.shouldEndSession);

            if(ses || handlerInput.requestEnvelope.request.type == 'SessionEndedRequest') { // skill was stopped or timed out

                let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

                sessionAttributes['lastUseTimestamp'] = new Date(handlerInput.requestEnvelope.request.timestamp).getTime();

                handlerInput.attributesManager.setPersistentAttributes(sessionAttributes);

                return new Promise((resolve, reject) => {
                    handlerInput.attributesManager.savePersistentAttributes()
                        .then(() => {
                            resolve();
                        })
                        .catch((err) => {
                            reject(err);
                        });

                });

            }

        }
    },
    'SpeechOutputInterceptor': {
        process(handlerInput, responseOutput) {

            let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

            let speakingSpeed = sessionAttributes['speakingSpeed'] || 'medium';
            if (responseOutput.outputSpeech && responseOutput.outputSpeech.ssml) {
                // dialog delegate prompt
                let speechOutput = responseOutput.outputSpeech.ssml;

                speechOutput = speechOutput.replace('<speak>', '').replace('</speak>', '');

                speechOutput = '' + speechOutput + '';

                let rate = 'medium';
                if (speakingSpeed && speakingSpeed !== 'medium') {

                    speechOutput = "<speak><prosody rate='" + speakingSpeed + "'>" + speechOutput + "</prosody></speak>";
                    // console.log(speechOutput);
                    responseOutput.outputSpeech.ssml = speechOutput;

                } else {
                    speechOutput = "<speak>" + speechOutput + "</speak>";

                }
            } // else no outputSpeech.ssml; dialog delegate output

        }
    }

};

function flattenRequest(obj) { // maximum of 6 levels of JSON for IOT shadow
    if ( obj.type === 'IntentRequest' && obj.intent.slots ) {

        // console.log(getSlotValues(obj.intent.slots));
        // console.log(`flattening ${JSON.stringify(obj, null, 2)}`);

        let flatter = Object.assign({}, obj);

        flatter.intent.slots = getSlotValues(obj.intent.slots);
        // console.log(flatter.intent.slots);

        return flatter;

    } else {
        return obj;
    }
}

function getSlotValues(filledSlots) {
    let slotValues = {};

    Object.keys(filledSlots).forEach((item) => {
        const name  = filledSlots[item].name;

        if (filledSlots[item] &&
            filledSlots[item].resolutions &&
            filledSlots[item].resolutions.resolutionsPerAuthority[0] &&
            filledSlots[item].resolutions.resolutionsPerAuthority[0].status &&
            filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) {
            switch (filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) {
                case 'ER_SUCCESS_MATCH':

                    let resolutions = [];
                    let vals = filledSlots[item].resolutions.resolutionsPerAuthority[0].values;
                    for (let i = 0; i < vals.length; i++) {
                        resolutions.push(vals[i].value.name);
                    }
                    slotValues[name] = {
                        heardAs: filledSlots[item].value,

                        resolved: filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0].value.name,
                        resolutions: resolutions,

                        ERstatus: 'ER_SUCCESS_MATCH'
                    };
                    break;
                case 'ER_SUCCESS_NO_MATCH':
                    slotValues[name] = {
                        heardAs: filledSlots[item].value,
                        resolved: '',
                        ERstatus: 'ER_SUCCESS_NO_MATCH'
                    };
                    break;
                default:
                    break;
            }
        } else {
            slotValues[name] = {
                heardAs: filledSlots[item].value,
                resolved: '',
                ERstatus: ''
            };
        }
    }, this);

    return slotValues;
}