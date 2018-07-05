// Customize how the browser will display the contents of Thing update messages received
//

function handleMessage(msgRaw) {  // called from within connectAsThing.js
     // display the JSON message in a panel
    // document.getElementById('iotResponse').innerHTML = msg;

    const msg = JSON.parse(msgRaw);

    prepareSessionLogEvent(msg);

    // other custom app DOM logic




    //document.getElementById('iotIntentRequest').innerText = IntentRequest;
    //document.getElementById('iotResponse').innerText = outputSpeech;

    //document.getElementById('iotMainPanel').innerHTML += `<br/>${JSON.stringify(msg)}`;

    // stateFilter(JSON.parse(msg).state);
    // document.getElementById('panel').innerHTML = msg;
    //
    // // unpack the message and find the city value.  Pop a child browser window to display images.
    // var myCity = JSON.parse(msg).city;
    // var ImgUrl = "https://www.google.com/search?tbm=isch&q=" + encodeURI(myCity);  // Message Body (Image Search URL)
    //
    // pop(ImgUrl);
}

function prepareSessionLogEvent(msg) {
    let LogDiv = document.createElement('div');
    let LogSpan = document.createElement('span');
    let LogDivResponse = document.createElement('div');
    let LogSpanResponse = document.createElement('span');
    let LogDivAttributes = document.createElement('div');
    let LogSpanAttributes = document.createElement('span');
    let statusLine = '';
    if(msg.request.type === 'IntentRequest') {
        const intent = msg.request.intent;

        let slots = intent.slots;
        console.log('*** slots \n' + slots);

        if(intent.slots && Object.keys(slots).length > 0) {
            statusLine += ` with slots`;
            Object.keys(slots).forEach(function(key) {
                statusLine += ` ${slots[key]}`;
            });
        }

        LogSpan.innerHTML = statusLine + intent.name + statusLine;
        LogDiv.appendChild(LogSpan);
        LogDiv.className = 'iotIntentDiv';
        addSessionLogEvent('intent', LogDiv, null);

    } else {
        // msg.request.type
        LogSpan.innerHTML = msg.request.type;
        LogDiv.appendChild(LogSpan);
        LogDiv.className = 'iotRequestDiv';
        addSessionLogEvent('request', LogDiv, null);
    }
    // ----- output
    const outputSpeech = msg.outputSpeech.ssml || msg.outputSpeech.text;

    LogSpanResponse.innerHTML = outputSpeech;
    LogSpanResponse.className = 'iotResponseSpan';

    LogDivResponse.appendChild(LogSpanResponse);

    LogDivResponse.className = (msg.shouldEndSession ? 'iotResponseEndDiv' : 'iotResponseDiv');
    addSessionLogEvent('response', LogDivResponse, msg.shouldEndSession);

    // ------- attributes
    const sa = msg.sessionAttributes;

    LogSpanAttributes.innerHTML = JSON.stringify(sa, null, '&nbsp;').replace(/\n/g, '<br />');
    LogSpanAttributes.className = 'iotAttributesSpan';

    LogDivAttributes.appendChild(LogSpanAttributes);

    LogDivAttributes.className = 'iotAttributesDiv';
    addSessionLogEvent('response', LogDivAttributes);

}

function addSessionLogEvent(event, IntentRequestDiv, shouldEndSession) {
    let panel = document.getElementById('iotMainPanel');
    const pastDivs = panel.getElementsByTagName('div');

    for(let i = 0; i < pastDivs.length - 2; i++) {
        const spans = pastDivs[i].getElementsByTagName('span');
        // pastDivs[i].style.backgroundColor = 'whitesmoke';
        // spans[0].style.color = 'grey';
    }

    //
    //
    // let div = document.createElement('div');
    // let span = document.createElement('span');
    //
    // if(event === 'request') {
    //     div.className = 'iotRequestDiv';
    //     span.className = 'iotRequestSpan';
    //
    // } else if (event === 'intent') {
    //     div.className = 'iotIntentDiv';
    //     span.className = 'iotIntentSpan';
    //
    // } else { // response
    //
    //     if (shouldEndSession) {
    //         div.className = 'iotResponseEndDiv';
    //     } else {
    //         div.className = 'iotResponseDiv';
    //     }
    //     span.className = 'iotResponseSpan';
    // }
    //
    // span.innerHTML = data;
    // div.appendChild(span);

    panel.appendChild(IntentRequestDiv);

    panel.scrollTop = panel.scrollHeight;

}
function toggleView(eventType) {

    if(eventType === 'request') {

    } else if (eventType === 'response') {

    } else if (eventType === 'attributes') {
        let elements = document.getElementsByClassName('iotAttributesDiv');
        if(elements.length > 0) {
            const display = elements[0].style.display;
            alert(`${eventType} ${display}`);
        }
    }

}

function reloader() {
    location.reload(true);  // hard reload including .js and .css files

}

