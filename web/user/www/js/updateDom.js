// Customize how the browser will display the contents of Thing update messages received
//

function handleMessage(msgRaw) {  // called from within connectAsThing.js
     // display the JSON message in a panel
    // document.getElementById('iotResponse').innerHTML = msg;

    const msg = JSON.parse(msgRaw);

    prepareSessionLogEvent(msg);

}

function prepareSessionLogEvent(msg) {
    let LogDiv = document.createElement('div');
    let LogSpanIntent = document.createElement('span');
    let LogSpanSlots = document.createElement('span');

    let LogDivResponse = document.createElement('div');
    let LogSpanResponse = document.createElement('span');

    let LogDivAttributes = document.createElement('div');
    let LogSpanAttributes = document.createElement('span');

    let statusLine = ``;
    console.log(`*********** msg\n${JSON.stringify(msg)}`);

    if(msg.request.type === 'IntentRequest') {
        console.log('*** in IntentRequest handlerr..');
        const intent = msg.request.intent;

        let slots = intent.slots;

        if(intent.slots && Object.keys(slots).length > 0) {
            // statusLine += ` with slots`;
            Object.keys(slots).forEach(function(key) {
                // console.log('*** slots \n' + slots[key]);
                let resolved = slots[key].resolved;
                let heardAs = slots[key].heardAs;
                let value = resolved || heardAs;
                if(resolved && heardAs && resolved !== heardAs) {
                    value = `${heardAs}/${resolved}`;
                } else {
                    value = value || ``;
                }

                statusLine += ` ${key}=<b>${value}</b>`;
            });
        }

        LogSpanIntent.innerHTML =  intent.name;
        LogSpanIntent.className = 'LogSpanIntent';
        LogDiv.appendChild(LogSpanIntent);

        LogSpanSlots.innerHTML =  statusLine;
        LogSpanSlots.className = 'LogSpanSlots';
        LogDiv.appendChild(LogSpanSlots);

        LogDiv.className = 'iotIntentDiv';

        addSessionLogEvent('intent', LogDiv, null);

    } else {
        // msg.request.type
        LogSpanIntent.innerHTML = msg.request.type;
        LogDiv.appendChild(LogSpanIntent);
        LogDiv.className = 'LogSpanIntent';
        addSessionLogEvent('request', LogDiv, null);
    }

    LogDiv.className = 'iotRequestDiv';

    if(getViewStatus('request').value === 'true' ) {
        LogDiv.style.display = '';
    } else {
        LogDiv.style.display = 'none';
    }

    // ----- output
    const outputSpeech = msg.outputSpeech.ssml || msg.outputSpeech.text;

    LogSpanResponse.className = 'iotResponseSpan';

    LogSpanResponse.innerHTML = outputSpeech;

    LogDivResponse.appendChild(LogSpanResponse);

    LogDivResponse.className = 'iotResponseDiv';
    if(getViewStatus('response').value === 'true' ) {
        LogDivResponse.style.display = '';
    } else {
        LogDivResponse.style.display = 'none';
    }

    addSessionLogEvent('response', LogDivResponse, msg.shouldEndSession);

    // ------- attributes
    const sa = msg.sessionAttributes || {};

    LogSpanAttributes.innerHTML = JSON.stringify(sa, null, '&nbsp;').replace(/\n/g, '<br />');
    LogSpanAttributes.className = 'iotAttributesSpan';

    LogDivAttributes.appendChild(LogSpanAttributes);
    LogDivAttributes.className = 'iotAttributesDiv';
    if(getViewStatus('attributes').value === 'true' ) {
        LogDivAttributes.style.display = '';
    } else {
        LogDivAttributes.style.display = 'none';
    }

    // alert(LogSpanAttributes.innerHTML);

    addSessionLogEvent('attributes', LogDivAttributes, null);


    // ------- cards
    const card = msg.card;

    // document.getElementById("cardImg").src="";
    console.log(`***** card \n${JSON.stringify(card, null, 2)}`);

    if (card) {
        document.getElementById('cardTitle').style.visibility = 'visible';
        document.getElementById('cardContent').style.visibility = 'visible';
    } else {
        document.getElementById('cardTitle').style.visibility = 'hidden';
        document.getElementById('cardContent').style.visibility = 'hidden';

        document.getElementById('cardTitle').innerHTML = ``;
        document.getElementById('cardContent').innerHTML = ``;
        document.getElementById('cardImg').src = ``;
    }
    if(card && card.title) {
        document.getElementById('cardTitle').innerHTML = card.title;
    } else {
        document.getElementById('cardTitle').innerHTML = ``;
    }
    let content = ``;

    if (card && card.content) {
        // content = linkify(card.content); // .replace(/\n/g, `<br/>`);
        // alert(content);
        content = (card.content || ``).replace(/\n/g, `<br/>`);
        document.getElementById('cardContent').innerHTML = content;

    } else if (card && card.text) {
        content = (card.text || ``).replace(/\n/g, `<br/>`);
        document.getElementById('cardContent').innerHTML = content;
    } else {
        document.getElementById('cardContent').innerHTML = ``;
    }
    let img = document.getElementById('cardImgImg');

    if (card && card.image && card.image.smallImageUrl) {


        img.src = card.image.smallImageUrl;
    } else {
        img.src = ``;
    }

}

function addSessionLogEvent(event, newDiv, shouldEndSession) {
    let panel = document.getElementById('iotMainPanel');
    panel.appendChild(newDiv);
    panel.scrollTop = panel.scrollHeight;

}
function getViewStatus(eventType) {
    let viewStatus = 'true';
    if(eventType === 'request') {
        viewStatus = document.getElementById('viewRequest');
    } else if (eventType === 'response') {
        viewStatus = document.getElementById('viewResponse');
    } else if (eventType === 'attributes') {
        viewStatus = document.getElementById('viewAttributes');
    }
    return viewStatus;
}
function toggleView(eventType) {

    let elements;
    let viewStatus = getViewStatus(eventType);

    // document.getElementById(`${eventType}Btn`).className = (viewStatus.value === 'true' ? 'btn btn-warn btn-xs' : 'btn btn.info btn-xs') ;
    document.getElementById(`${eventType}Btn`).style = (viewStatus.value === 'true' ? 'background-color:white' : 'background-color:lightblue' );

    if(eventType === 'request') {
        elements = document.getElementsByClassName('iotRequestDiv');

    } else if (eventType === 'response') {
        elements = document.getElementsByClassName('iotResponseDiv');

    } else if (eventType === 'attributes') {
        elements = document.getElementsByClassName('iotAttributesDiv');

    }

    viewStatus.value = (viewStatus.value === 'true' ? 'false' : 'true');

    for(let i = 0; i < elements.length; i++) {
        if(elements.length > 0) {
            if(viewStatus.value === 'true') {
                elements[i].style.display = '';
            } else {
                elements[i].style.display = 'none';
            }
        }

    }


}


function linkifylinkify(body) {
    let words = body.split('\n'); // assumes URL is on its own line

    for(let i=0; i<words.length; i++) {
        // alert(words[i].slice(0,4));
        if(words[i].slice(0,4) === `http`) {
            words[i] = `<a href="${words[i]}">${words[i]}</a>`;
        }
    }
    return words.join(`<br />`);
}
function reloader() {
    location.reload(true);  // hard reload including .js and .css files

}

