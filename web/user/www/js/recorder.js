(function ($) {
    'use strict';

    var audioContext    = new AudioContext,
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

    var $time  = $('#time'),
        $start = $('#start'),
        $stop  = $('#stop'),
        $list  = $('#audio-list');

    var audioRecorder = new WebAudioRecorder(mixer, {
        workerDir : 'lib/',
        encoding  : 'mp3',
    });

    var minSecStr = function(n) {
        return (n < 10 ? "0" : "") + n;
    };

    var updateDateTime = function() {
        var sec;
        sec = audioRecorder.recordingTime() | 0;
        $time.html("" + (minSecStr(sec / 60 | 0)) + ":" + (minSecStr(sec % 60)));
    };

    window.setInterval(updateDateTime, 200);

    $start.on('click', function (e) {
        e.preventDefault();
        $start.get(0).disabled = true;
        $stop.get(0).disabled = false;
        audioRecorder.startRecording();
    });

    $stop.on('click', function (e) {
        e.preventDefault();
        $stop.get(0).disabled = true;
        $start.get(0).disabled = false;
        audioRecorder.finishRecording();
    });

    audioRecorder.onComplete = function (recorder, blob) {
        var url   = URL.createObjectURL(blob),
            total = ++$list.find('li').length;

        blobs['total'] = blob;

        var html = '<li class="list-group-item clearfix" data-blob="total">' +
            '<div class="row">' +
            '<div class="col-md-6"><audio controls src="' + url + '"></audio></div>' +
            '<div class="col-md-3">Recording ' + total + '.mp3</div>' +
            '<div class="col-md-3 text-right">' +
            '<a class="btn btn-sm btn-success save" href="' + url + '" download="Recording ' + total + '.mp3">Save</a> ' +
            '<button class="btn btn-sm btn-primary upload">Upload</button> ' +
            '<button class="btn btn-sm btn-danger delete">Delete</button></div>' +
            '</div>' +
            '</li>';

        $list.append(html);
    };

    // var bucket = window.bucket = new AWS.S3({
    //        params: {
    //            Bucket: 'rtcrecordings'
    //        }
    //    });

    // bucket.config.credentials = new AWS.WebIdentityCredentials({
    //     RoleArn: 'arn:aws:iam::629661007679:user/sagir',
    // });

    var upload = function (blob) {
        var fd = new FormData(),
            reader = new FileReader();

        reader.onload = function (e) {
            fd.append('name', 'recording.mp3');
            fd.append('data', e.target.result);

            $.ajax({
                type : 'POST',
                url  : 'upload.php',
                data : fd,
                processData : false,
                contentType : false,
            }).done(function (data) {
                alert(data);
            });
        };

        reader.readAsDataURL(blob);
    };

    $list.on('click', 'button.upload', function (e) {
        e.preventDefault();

        var id = $(this).closest('li').attr('data-blob'),
            blob = blobs[id];

        upload(blob);
    });

    $list.on('click', 'button.delete', function (e) {
        e.preventDefault();

        var $li = $(this).closest('li'),
            url = $li.find('audio').attr('src');

        $li.remove();
        URL.revokeObjectURL(url);
    });

})(jQuery);