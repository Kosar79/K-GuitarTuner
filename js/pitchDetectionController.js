KGuitarModule.controller("pitchDetectionController", [
    "$scope","contextFactory","pitchDetectionFactory",
    function ($scope, contextFactory, pitchDetectionFactory) {
        var self = this;
        var context,
            analyser,
            minSample,
            buffer,
            fftSize,
            bufferlength;

        self.data = {
            pitch: "",
            note:""
           
        }

        var init = function () {
           // bufferlength = 1024;
            bufferlength = 2048;
            minSample = 0;
            fftSize = 2048;
            buffer = new Float32Array(bufferlength);
        }

        init();
        
        self.getLivePitch = function () {
            if (!context) {
                context = contextFactory.defineContext();
            }

            if (!contextFactory.mediaDevices) {
                alert(contextFactory.errorMessage);
                return;
            }

            contextFactory.mediaDevices.getUserMedia(contextFactory.constraints).then(useStream);
              
        };

        var useStream = function (stream) {
            var liveSource = context.createMediaStreamSource(stream);
            analyser = context.createAnalyser();
            analyser.fftSize = fftSize;
            liveSource.connect(analyser);
            getPich();
        }
        var getPich = function () {
            console.log(context.sampleRate);
            var b = buffer;
            analyser.getFloatTimeDomainData(buffer);
            var pitch = pitchDetectionFactory.processSignal(buffer, context.sampleRate, minSample);
            if (pitch) {
                self.data.pitch += " " + Math.round(pitch);
                var noteNumber = pitchDetectionFactory.getNoteNumberFromPitch(pitch);
                self.data.note += " " + pitchDetectionFactory.getNoteName(noteNumber);
            }

            if (!window.requestAnimationFrame)
                window.requestAnimationFrame = window.webkitRequestAnimationFrame;
            window.requestAnimationFrame(getPich);
            $scope.$apply();
        }
    }
]);