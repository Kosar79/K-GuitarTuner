KGuitarModule.factory("contextFactory",
    function() {
        var contextFactory = {};
        contextFactory.defineContext = function() {
            var contextClass = (window.AudioContext ||
                window.webkitAudioContext ||
                window.mozAudioContext ||
                window.oAudioContext ||
                window.msAudioContext);
            if (!contextClass) return false;
            if (!contextClass.createGain)
                contextClass.createGain = contextClass.createGainNode;
            if (!contextClass.createDelay)
                contextClass.createDelay = contextClass.createDelayNode;
            if (!contextClass.createScriptProcessor)
                contextClass.createScriptProcessor = contextClass.createJavaScriptNode;
            if (!contextClass.createAnalyser)
                contextClass.createAnalyser = contextClass.createAnalyserNode;
            return new contextClass();
        }
        var minDecibels = -140;
        var maxDecibels = 0;
        var fftSize = 2048;
        var minSample = 0;
        contextFactory.minSample = minSample;
        contextFactory.createAudioGraph = function(context) {
            // make sure to get the audioContext graph plotted correctly; 
            //meaning connect them in a meaningful order. 
            //In this one we have source gain and destination.
            //In order to have gainNode to work, here is the graph: source -> gainNode -> destination
            var source = context.createBufferSource();
            var gainNode = context.createGain();
            var analyzer = context.createAnalyser();
            analyzer.minDecibels = minDecibels;
            analyzer.maxDecibels = maxDecibels;
            analyzer.fftSize = fftSize;
            source.connect(gainNode);
            gainNode.connect(analyzer);
            analyzer.connect(context.destination);
            return { "source": source, "gainNode": gainNode, "analyzer": analyzer };
        }
        contextFactory.errorMessage = "Operation failed! Your browser doesn't support user media!";
        contextFactory.constraints = {
            "audio": {
                "mandatory": {
                    "googEchoCancellation": "false",
                    "googAutoGainControl": "false",
                    "googNoiseSuppression": "false",
                    "googHighpassFilter": "false"
                },
                "optional": []
            }
        };
        var error = function() {
            alert(contextFactory.errorMessage);
        };


        contextFactory.mediaDevices = navigator.mediaDevices ||
            ((navigator.mozGetUserMedia || navigator.webkitGetUserMedia) ? {
            getUserMedia: function (c) {
                return new Promise(function (y, n) {
                    (navigator.mozGetUserMedia ||
                     navigator.webkitGetUserMedia).call(navigator, c, y, n);
                });
            }
        } : null);

        return contextFactory;
    });