
// https://s3.amazonaws.com/skill-images-789/mp3/Recording2.mp3
// Darth! <audio src="https://s3.amazonaws.com/skill-images-789/mp3/faith.mp3" />


(function ($) {
    'use strict';

    let audioContext    = new AudioContext,
        mixer           = audioContext.createGain(),
        URL             = window.URL || window.webkitURL,
        blobs           = {},
        microphone;

    navigator.getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;

    navigator.getUserMedia({ audio: true }, function(stream) {
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(mixer);
        // mixer.connect(audioContext.destination);
        mixer.gain.value = 1;
    }, function(error) {
        window.alert("Could not get audio input.");
    });

    let $time  = $('#time'),
        $start = $('#start'),
        $stop  = $('#stop'),
        $list  = $('#audio-list');

    let audioRecorder = new WebAudioRecorder(mixer, {
        workerDir : 'lib/',
        encoding  : 'mp3',
    });

    let minSecStr = function(n) {
        return (n < 10 ? "0" : "") + n;
    };

    let updateDateTime = function() {
        var sec;
        sec = audioRecorder.recordingTime() | 0;
        $time.html("" + (minSecStr(sec / 60 | 0)) + ":" + (minSecStr(sec % 60)));
    };

    window.setInterval(updateDateTime, 200);

    $start.on('click', function (e) {
        e.preventDefault();
        $start.get(0).disabled = true;
        $stop.get(0).disabled = false;
        $("#time").attr('class', 'timeRec');

        audioRecorder.startRecording();
    });

    $stop.on('click', function (e) {
        e.preventDefault();
        $stop.get(0).disabled = true;
        $start.get(0).disabled = false;
        $("#time").attr('class', 'timeDone');
        audioRecorder.finishRecording();
    });

    audioRecorder.onComplete = function (recorder, blob) {
        let url   = URL.createObjectURL(blob),
            total = ++$list.find('li').length;

        blobs['total'] = blob;
//list-group-item clearfix
        const html = '<li class="recList" data-blob="total">' +
            '<div class="row">' +
            '<table border="0" class="recListTable" width="90%" ><tr><td width="200px">' +
            '<audio controls src="' + url + '"></audio></td><td>&nbsp;</td><td>' +
            'Recording_' + total + '.mp3' + '</td><td>' +
            '<button class="btn btn-xs btn-info upload">Save to Skill</button> ' +
            '<button class="btn btn-xs btn-secondary delete">[X]</button></td></tr></table>' +

            // '<div class="col-md-2"><audio controls src="' + url + '"></audio></div>' +
            // '<div class="col-md-2">Recording_' + total + '.mp3</div>' +
            // '<div class="col-md-2 text-right">' +
            //
            // '<button class="btn btn-xs btn-success upload">Save to Skill</button> ' +
            // // '<a class="btn btn-xs btn-info save" href="' + url + '" download="Recording ' + total + '.mp3">Download</a> ' +
            // '<button class="btn btn-xs btn-error delete">Delete</button></div>' +
            '</div>' +
            '</li>';


        $list.append(html);
    };

    // var bucket = window.bucket = new AWS.S3({
    //        params: {
    //            Bucket: 'rtcrec789'
    //        }
    //    });

    // bucket.config.credentials = new AWS.WebIdentityCredentials({
    //     RoleArn: 'arn:aws:iam::629661557679:user/joe',
    // });

    let upload = function (blob) {
        // let buff = new Buffer(blob, 'base64');
        toBase64(blob); // in userdata.js
        // saveAttrs(blob);  // in userdata.js

        // let fd = new FormData(),
        //     reader = new FileReader();
        //
        // reader.onload = function (e) {
        //     fd.append('name', 'recording.mp3');
        //     fd.append('data', e.target.result);
        //
        //     $.ajax({
        //         type : 'POST',
        //         url  : 'https://24kzsfwcoi.execute-api.us-east-1.amazonaws.com/prod/update?tempPassPhrase=sweet-dog-721',
        //         data : fd,
        //         processData : false,
        //         contentType : 'application/json' // false,
        //     }).done(function (data) {
        //         alert(data);
        //     });
        // };
        //
        // reader.readAsDataURL(blob);
    };


    $('#postSample').click(function(){
        postSample();
    });

    let postSample = function () {

        let file = new File("../mp3/helloworld.mp3", "helloworld.mp3");

        //let fd = new FormData();
        let reader = new FileReader(file);

        let ret = {"attributes":{"audioClip":"new"}, "file": file};

        reader.onload = function (e) {
            //fd.append('name', 'recording.mp3');
            //fd.append('data', e.target.result);

            $.ajax({
                type : 'POST',
                url  : 'https://24kzsfwcoi.execute-api.us-east-1.amazonaws.com/prod/update?tempPassPhrase=sweet-dog-721',
                data : ret,
                processData : false,
                contentType : 'application/json' // false,
            }).done(function (data) {
                alert(data);
            });
        };

        reader.readAsDataURL(file);
    };

    $list.on('click', 'button.upload', function (e) {
        e.preventDefault();

        let id = $(this).closest('li').attr('data-blob'),
            blob = blobs[id];

        upload(blob);
    });

    $list.on('click', 'button.delete', function (e) {
        e.preventDefault();

        let $li = $(this).closest('li'),
            url = $li.find('audio').attr('src');

        $li.remove();
        URL.revokeObjectURL(url);
    });

})(jQuery);

// function upload2(blob) {
//     alert('uploading.....');
//
//     let s3 = new AWS.S3({
//         apiVersion: '2006-03-01',
//         params: {Bucket: 'skill-images-789'}
//     });
//
//     const s3params = {
//         Key: 'mySuperFile.mp3',
//         Body: blob,
//         ACL: 'public-read'
//     };
//
//     s3.upload(s3params, function(err, data) {
//         if (err) {
//             return console.log('There was an error uploading your file: ', err.message);
//         }
//         alert('Successfully uploaded file.');
//
//     });
//
// }
