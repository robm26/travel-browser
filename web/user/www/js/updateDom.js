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
        LogSpanIntent.className = 'LogSpanSlots';
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
    // ----- output
    const outputSpeech = msg.outputSpeech.ssml || msg.outputSpeech.text;

    LogSpanResponse.innerHTML = outputSpeech;
    LogSpanResponse.className = 'iotResponseSpan';

    LogDivResponse.appendChild(LogSpanResponse);

    LogDivResponse.className = (msg.shouldEndSession ? 'iotResponseEndDiv' : 'iotResponseDiv');
    addSessionLogEvent('response', LogDivResponse, msg.shouldEndSession);

    // ------- attributes
    const sa = msg.sessionAttributes || {};

    LogSpanAttributes.innerHTML = JSON.stringify(sa, null, '&nbsp;').replace(/\n/g, '<br />');
    LogSpanAttributes.className = 'iotAttributesSpan';

    LogDivAttributes.appendChild(LogSpanAttributes);

    LogDivAttributes.className = 'iotAttributesDiv';
    addSessionLogEvent('response', LogDivAttributes);

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
        // document.getElementById('cardImgImg').src = card.image.smallImageUrl
    } else if (card && card.text) {
        content = (card.text || ``).replace(/\n/g, `<br/>`);
        document.getElementById('cardContent').innerHTML = content;
    } else {
        document.getElementById('cardContent').innerHTML = ``;
    }

    if (card && card.image && card.image.smallImageUrl) {
        let img = document.getElementById('cardImgImg');

        img.src = card.image.smallImageUrl;
    } else {
        img.src = ``;
    }


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
            // alert(`${eventType} ${display}`);
        }
    }

}

// let bod = `hello\nhttps://www.amazon.com\nbig world`;
// console.log(bod);
// console.log(linkify(bod));
// document.getElementById('footer').innerHTML = 'copyright  2018';
// // let foot = document.getElementById('footer');
// // foot.innerHTML = 'abc';

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

