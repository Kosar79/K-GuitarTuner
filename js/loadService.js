KGuitarModule.service("loadAssets", ['$http', function($http) {
    this.loadAudio = function (context, url, callback) {
        var req = {
            method:'GET',
            url:url,
            responseType:'arraybuffer'
        }
        var res = {};
        var runCallback = function() {
            if (callback && typeof (callback) === "function") {
                callback(res);
            }
        }
        return $http(req).then(
            function (response) {
                context.decodeAudioData(response.data, function (theBuffer) {
                    res.buffer = theBuffer;
                    runCallback();
                }, function(err) {
                    res.err = err;
                    runCallback();
                });
                
            },
            function (errResponse) {
                res.err = errResponse.statusText;
                runCallback();
            }
        );       
    }
}]);  