KGuitarModule.factory("pitchDetectionFactory", [function () {

    var noteArray = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    var getNoteNumberFromPitch = function (frequency) {
        var noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
        return Math.round(noteNum) + 69;
    }

    var getNoteName = function(noteNumber) {
        return noteArray[noteNumber % 12];
    }  

    var getFrequencyFromNoteNumber = function (noteNumber) {
        return 440 * Math.pow(2, (noteNumber - 69) / 12);
    }

    var centsOffFromPitch = function (frequency, noteNumber) {
        return Math.floor(1200 * Math.log(frequency / getFrequencyFromNoteNumber(noteNumber)) / Math.log(2));
    }

    var processSignal = function (buffer, sampleRate, minSample) {
        var size = buffer.length;
        var maxSamples = Math.floor(size / 2);
        var bestOffset = -1;
        var bestCorrelation = 0;
        var rms = 0;
        var foundGoodCorrelation = false;
        var correlations = new Array(maxSamples);
        for (var i = 0; i < size; i++) {
            var val = buffer[i];
            rms += val * val;
        }

        rms = Math.sqrt(rms / size);
        if (rms < 0.01) { // not enough signal
            return null;
            // return -1;
        }

        var lastCorrelation = 1;
        for (var offset = minSample; offset < maxSamples; offset++) {
            var correlation = 0;

            for (var ii = 0; ii < maxSamples; ii++) {
                correlation += Math.abs((buffer[ii]) - (buffer[ii + offset]));
            }
            correlation = 1 - (correlation / maxSamples);
            correlations[offset] = correlation; // store it, for the tweaking we need to do below.
            if ((correlation > 0.9) && (correlation > lastCorrelation)) {
                foundGoodCorrelation = true;
                if (correlation > bestCorrelation) {
                    bestCorrelation = correlation;
                    bestOffset = offset;
                }
            } else if (foundGoodCorrelation) {
                // short-circuit - we found a good correlation, then a bad one, so we'd just be seeing copies from here.
                // Now we need to tweak the offset - by interpolating between the values to the left and right of the
                // best offset, and shifting it a bit.  This is complex, and HACKY in this code (happy to take PRs!) -
                // we need to do a curve fit on correlations[] around best_offset in order to better determine precise
                // (anti-aliased) offset.

                // we know best_offset >=1, 
                // since foundGoodCorrelation cannot go to true until the second pass (offset=1), and 
                // we can't drop into this clause until the following pass (else if).
                var shift = (correlations[bestOffset + 1] - correlations[bestOffset - 1]) / correlations[bestOffset];
                return sampleRate / (bestOffset + (8 * shift));
            }
            lastCorrelation = correlation;
        }
        if (bestCorrelation > 0.01) {
            // console.log("f = " + sampleRate/best_offset + "Hz (rms: " + rms + " confidence: " + best_correlation + ")")
            return sampleRate / bestOffset;
        }
       // return -1;
        return null;
        //	var best_frequency = sampleRate/best_offset;
    } // end processSignal
    var calculateBuffer = function (buferlength) {
        return new Float32Array(buferlength);
    }

    return {
        calculateBuffer:calculateBuffer,
        processSignal: processSignal,
        getNoteNumberFromPitch: getNoteNumberFromPitch,
        getFrequencyFromNoteNumber: getFrequencyFromNoteNumber,
        centsOffFromPitch: centsOffFromPitch,
        getNoteName: getNoteName

    }

}]);