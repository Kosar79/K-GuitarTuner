
//var get_user_media = navigator.getUserMedia;
var get_user_media = navigator.getUserMedia = (navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia);
var contextClass = (window.AudioContext ||
        window.webkitAudioContext ||
        window.mozAudioContext ||
        window.oAudioContext ||
        window.msAudioContext);
if (contextClass) {
    var context = new contextClass();
} else {
    alert("Sorry audio API is not supported in your browser!");
}

navigator.getUserMedia({ "audio": true }, use_stream, function () { });
//*************************
var request = new XMLHttpRequest();
var url = "audio/Kashmir.mp3";
var buffer;
request.open('Get', url, true);
request.responseType = 'arraybuffer';
request.onload = function() {
    context.decodeAudioData(request.response, function(theBuffer) {
        buffer = theBuffer;
        playSound(buffer);
    }, onerror);
}
request.send();

function onerror(e) {
    alert("Error with decoding audio data" + e.err);
}

function playSound(buffer) {
    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(0);
}
//********************
function use_stream(stream) {
    var microphone = context.createMediaStreamSource(stream);
    // do something with the microphone stream...
}