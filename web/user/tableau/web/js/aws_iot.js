/*
 * Create a request for wss iot endpoint and return a PAHO MQTT clientId
 *
 * @ param : options
       var options  = {
 regionName   : "us-east-1",
 secretKey    : "...",
 accessKey    : "..",
 sessionToken : "..",
 endpoint     : "abcd.iot.us-east-1.amazonaws.com",
 clientId     : "1234"
 };
 *
 * TODO : add support for SessionToken
*/
function createMQTTClient(options) {

    var time = moment.utc();
    var dateStamp = time.format('YYYYMMDD');
    var amzdate = dateStamp + 'T' + time.format('HHmmss') + 'Z';
    var service = 'iotdevicegateway';
    var region = options.regionName;
    var secretKey = options.secretKey;
    var accessKey = options.accessKey;
    var algorithm = 'AWS4-HMAC-SHA256';
    var method = 'GET';
    var canonicalUri = '/mqtt';
    var host = options.endpoint.toLowerCase();

    var credentialScope = dateStamp + '/' + region + '/' + service + '/' + 'aws4_request';
    var canonicalQuerystring = 'X-Amz-Algorithm=AWS4-HMAC-SHA256';
    canonicalQuerystring += '&X-Amz-Credential=' + encodeURIComponent(accessKey + '/' + credentialScope);
    canonicalQuerystring += '&X-Amz-Date=' + amzdate;
    canonicalQuerystring += '&X-Amz-SignedHeaders=host';

    var canonicalHeaders = 'host:' + host + '\n';
    var payloadHash = SigV4Utils.sha256('');
    var canonicalRequest = method + '\n' + canonicalUri + '\n' + canonicalQuerystring + '\n' + canonicalHeaders + '\nhost\n' + payloadHash;
    //console.log('canonicalRequest ' + canonicalRequest);

    var stringToSign = algorithm + '\n' + amzdate + '\n' + credentialScope + '\n' + SigV4Utils.sha256(canonicalRequest);
    var signingKey = SigV4Utils.getSignatureKey(secretKey, dateStamp, region, service);
    var signature = SigV4Utils.sign(signingKey, stringToSign);

    canonicalQuerystring += '&X-Amz-Signature=' + signature;
    var requestUrl = 'wss://' + host + canonicalUri + '?' + canonicalQuerystring;
    if (options.sessionToken) {
        requestUrl += "&X-Amz-Security-Token=" + encodeURIComponent(options.sessionToken);
    }
    //console.log(requestUrl);
    return new Paho.MQTT.Client(requestUrl, options.clientId);
}
