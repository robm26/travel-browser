/**
 * Created by mccaul on 4/7/18.
 */

// const DYNAMODB_TABLE = 'askMemorySkillTable';

const serviceurl = `https://24kzsfwcoi.execute-api.us-east-1.amazonaws.com/prod`;

//"https://2f1u50gvwh.execute-api.us-east-1.amazonaws.com/prod";


const editableAttributes = [ // for display in profile form
    'name',
    'namePronounce',
    'preferredGreeting',
    'speakingSpeed',

    'audioClip',
    'mobileNumber',
    'homeAirport',
    'visitWishList',

    'IotTopic',
    'IdentityPoolId',
    'mqttEndpoint'
];  // skipping other non-editable attributes

function testy(){

    document.getElementById('word1').value = 'sweet';
    document.getElementById('word2').value = 'dog';
    document.getElementById('number').value = 721;

}
function init() {
    testy();
    document.getElementById('apiurl').href = serviceurl; // from userdata.js
    setStatus('ready');
    document.getElementById('word1').focus();
    document.getElementById('word1').select();

    $('.nav-tabs a').on('shown.bs.tab', function(event){
        const x = $(event.target).text();         // active tab
        // const y = $(event.relatedTarget).text();  // previous tab
        if(x === 'Recording') {
            // console.log('audio tab shown');

        } else {

        }

    });
    // toggleConnected(false);

}
function clearForm() {

    document.getElementById('word1').value = '';
    document.getElementById('word2').value = '';
    document.getElementById('number').value = '';
    setStatus('ready');
    clearEditTable();

    document.getElementById('word1').focus();
    document.getElementById('word1').select();

}
function clearIot() {
    document.getElementById('iotMainPanel').innerText = '';

}
function clearEditTable () {
    document.getElementById('EditFormTable').innerHTML = '';
    document.getElementById('saveButton').style.display = 'none';

}

function setStatus(status, level) {
    if (level === 'warn' || level === 'error') {
        document.getElementById('status').className = 'statusWarn';
    } else {
        document.getElementById('status').className = 'statusNormal';
    }

    document.getElementById('status').innerHTML = status;

    // document.getElementById('status').className = 'statuslookup';

}
function validatePassPhrase() {
    const word1 = document.getElementById('word1').value.toLowerCase();
    const word2 = document.getElementById('word2').value.toLowerCase();
    const number = document.getElementById('number').value.toLowerCase();
    if (word1 === '' || word2 === '' || number === '') {
        setStatus('You must enter a three part pass phrase!');
        return false;

    } else {
        return word1 + '-' + word2 + '-' + number.toString();

    }

}

function loadAttrs() {
    clearEditTable();
    setStatus('loading...');

    let passPhrase = validatePassPhrase();

    if (passPhrase) {

        let url = serviceurl + "/lookup?tempPassPhrase=" + passPhrase;

        let xhttp = new XMLHttpRequest({mozSystem: true});

        xhttp.open("GET", url, true);
        xhttp.setRequestHeader('Content-Type', 'application/json');

        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                let data = JSON.parse(xhttp.responseText);

                if ('attributes' in data) { // success
                    console.log('***** data from call');
                    console.log(data);
                    renderEditForm(data);

                    ConnectIot(data.attributes.mqttEndpoint,
                                data.attributes.IdentityPoolId,
                                `$aws/things/${data.attributes.IotTopic}/shadow/update/accepted`);

                    setStatus('lookup success');

                    setTimeLeft(data.timeLeft);


                } else {
                    setStatus(' invalid pass phrase','error');
                }

            } else {
                setStatus('error: http status' + xhttp.status)
            }
        };

        xhttp.send();
    }
    // xhttp.send(JSON.stringify(payload));

}


function renderEditForm(data) {
    toggleConnected(true);
    clearEditTable();

    // console.log(JSON.stringify(data, null, 2));
    let tbl = document.getElementById('EditFormTable');
    let header = tbl.createTHead();
    let hrow = header.insertRow(0);

    hrow.className = 'maintableheader';

    let hcell1 = hrow.insertCell(0);

    hcell1.innerHTML = 'Attribute';

    hcell1.className = "EditTableNameHeader";

    let hcell2 = hrow.insertCell(1);

    hcell2.innerHTML = `Values for userId: ${data.id.slice(-10)} `;

    // let saveButton = document.createElement('button');
    // saveButton.innerHTML = 'SAVE';
    // saveButton.className = 'btn btn-primary btn-xs';
    // saveButton.addEventListener("click", saveAttrs());
    //
    // hcell2.appendChild(saveButton);
    hcell2.className = "EditTableValueHeader";

    for(attrName in sortAttrsForDisplay(data.attributes)) {
        addTableRow(attrName, data.attributes[attrName] || '', tbl);
    }

    document.getElementById('saveButton').style.display = '';

}

function sortAttrsForDisplay(obj) {

    let i = 0;
    let sortedObj = {};
    for (key in editableAttributes) {
        if(obj[editableAttributes[i]] !== 'undefined') {
            // console.log('key ' + key);
            // console.log(obj[editableAttributes[i]]);
            sortedObj[editableAttributes[i]] = obj[editableAttributes[i]];
            i = i + 1;
        }

    }
    return sortedObj;
}
function addTableRow(attrName, attrValue, tbl) {

    let row = tbl.insertRow(-1);
    row.className = 'updateAttrs';

    let cell1 = row.insertCell();
    cell1.className = "EditTableNameColumn";
    cell1.innerHTML = attrName;

    let cell2 = row.insertCell();
    cell2.className = "EditTableValueColumn";

    let input = document.createElement('input');

    input.type = "text";
    input.value = attrValue;
    input.className = 'form-control';
    input.setAttribute("id", 'update-' + attrName);

    cell2.appendChild(input);

}

function toBase64(blob) {
    let reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function() {

        file64 = reader.result;
        saveAttrs(file64);

    };
}

function saveAttrs(withFile) {
    setStatus('saving...');
    console.log('***** in saveAttrs();');
    console.log(withFile !== null);

    let updates = {};

    let tbl = document.getElementById('EditFormTable');
    if (withFile !== null) {
        updates['audioClip'] = "new";


    } else {
        for (let i = 1, row; row = tbl.rows[i]; i++) {
            let name = row.cells[0].innerHTML;
            let value = row.cells[1].childNodes[0].value;
            if (value !== '' && value !== null) {
                updates[name] = value;
            }
        }
    }

    let passPhrase = validatePassPhrase();
    if (passPhrase) {
        const url = serviceurl + "/update?tempPassPhrase=" + passPhrase;
        console.log('url ' + url);

        let xhttp = new XMLHttpRequest({mozSystem: true});

        xhttp.open("POST", url, true);

        let post_data = {  // will appear on API Lambda as event.body
                "attributes": updates,
                "file": withFile
        };

        xhttp.setRequestHeader('Content-Type', 'application/json');

        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                // let data = JSON.parse(xhttp.responseText);
                setStatus('save complete');
            } else {
                setStatus('save failed.  Your pass phrase may have timed out.');
            }
        };

        xhttp.send(JSON.stringify(post_data));
    }
}

function setTimeLeft(seconds) {
    // let label = `update form within ${seconds} seconds`;
    const Now = new Date();
    const expireTime = Now.getTime() + (seconds * 1000);

    document.getElementById('timeLeft').className = 'timeLeftVisible';
    // document.getElementById('timeLeft').innerHTML = label;

    let secondsLeft = seconds;

    let timeinterval = setInterval(function(){

        const NowNew = new Date();
        let tl = Math.round((expireTime - NowNew.getTime()) / 1000);
        if (tl >= 0) {
            document.getElementById('timeLeft').innerHTML = `update form within ${tl} seconds`;
        } else {
            clearInterval(timeinterval);
            // setStatus('new pass phrase needed', 'warn');
            document.getElementById('timeLeft').innerHTML = `new pass phrase needed`
        }

    },1000); // 1 second

}

// ----------------------------------------------------------------------

function ConnectIot(mqttEndpoint, IdentityPoolId, IotTopic) {
    document.getElementById("SubscribeTopicValue").innerText = IotTopic;
    document.getElementById("mqttEndpointValue").innerText   = mqttEndpoint;
    document.getElementById("IdentityPoolIdValue").innerText = IdentityPoolId;
    document.getElementById("MQTTstatus").innerText = 'CONNECTED';

    AWS.config.region = REGION;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        'IdentityPoolId': IdentityPoolId
    });

    console.log('***** in ConnectIot \nabout to call getAWSCredentials()');
    console.log(AWS.config.region);
    console.log(AWS.config.credentials);

    // AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    //     IdentityPoolId: IdentityPoolId
    // });

    getAWSCredentials();

}

function handleEnter(e){
    const keycode = (e.keyCode ? e.keyCode : e.which);
    if (keycode == '13') {
        // console.log('You pressed enter!');
        loadAttrs();
    }
}

function toggleConnected(connected) {
    console.log(`toggleConnected(${connected})`);

    if(connected) {
        document.getElementById('profilepanel').style.display = 'block';
        document.getElementById('card').style.display = 'block';
    } else {
        document.getElementById('profilepanel').style.display = 'none';
        document.getElementById('card').style.display = 'block';
    }
    // let pan = document.getElementById('profilepanel');
    // // alert(`connected\n${connected}\ndisplay\n${pan.style.display}`);
    //
    // pan.style.display = (connected ? 'block' : 'none');
}

function setAnswer(answer) {
    //alert(answer);
}
