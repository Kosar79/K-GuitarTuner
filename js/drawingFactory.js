KGuitarModule.factory("drawingFactory",[
    function () {
        return {
            freqDomainChart: function (analyzer, drawContext, params) {
                var freqs = new Uint8Array(analyzer.frequencyBinCount);
                analyzer.getByteFrequencyData(freqs);
                // Draw the frequency domain chart.
                for (var ii = 0; ii < analyzer.frequencyBinCount; ii++) {
                    var value = freqs[ii];
                    var percent = value / 256;
                    var height = params.HEIGHT * percent;
                    var offset = params.HEIGHT - height - 1;
                    var barWidth = params.WIDTH / analyzer.frequencyBinCount;
                    var hue = ii / analyzer.frequencyBinCount * 360;
                    drawContext.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
                    drawContext.fillRect(ii * barWidth, offset, barWidth, height);
                }
            },
            
            timeDomainChart: function (analyzer, drawContext, params) {
                var times = new Uint8Array(analyzer.frequencyBinCount);
                analyzer.getByteTimeDomainData(times);
                // Draw the time domain chart.
                for (var q = 0; q < analyzer.frequencyBinCount; q++) {
                    var value = times[q];
                    var percent = value / 256;
                    var height = params.HEIGHT * percent;
                    var offset = params.HEIGHT - height - 1;
                    var barWidth = params.WIDTH / analyzer.frequencyBinCount;
                    drawContext.fillStyle = 'white';
                    drawContext.fillRect(q * barWidth, offset, 1, 2);
                }
            }
        }
    }
]);