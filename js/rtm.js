/**
 * User: Kieranties
 * Date: 02/08/13
 */

angular.module('rtm', ['md5'])
    .constant('Api', {
        url: 'https://api.rememberthemilk.com/services/rest/',
        authUrl: 'https://www.rememberthemilk.com/services/auth/',
        permissions: 'delete',
        format: 'json',
        key: "",
        secret: ""
    })
    .factory('Rtm', function(Api, md5, $q, $http){

        // use promise for auth item
        var _auth = (function(){
            var d = $q.defer();

            getData('rtm.auth.getFrob', null).then(function(rsp){
                chrome.tabs.create({url: getAuth(rsp.frob) }, function(tab){
                    chrome.tabs.onUpdated.addListener(function(id, info){
                        if(id === tab.id && info.status === "complete"){
                            // refresh auth status
                            getData("rtm.auth.getToken", {frob: rsp.frob})
                                .then(function(auth){
                                    chrome.storage.local.set(auth);
                                    d.resolve(auth);
                                });
                        }
                    });
                });
            });

            return d.promise;
        })();

        function defaultParams(method){
            var params = {api_key: Api.key, format: Api.format };
            if(!!method) { params.method = method; }

            return params;
        }

        // returns a signature for the given params
        function sign(params){
            var params = params || {};
            var keys = Object.keys(params);
            keys.sort();
            var signature = '';
            for(var i = 0, max = keys.length; i < max; i++){
                signature += (keys[i] + params[keys[i]]);
            }

            signature = Api.secret + signature;
            return md5.createHash(signature);
        }

        // private request executor
        function executeRequest(url, params){
            var process = function(p){
                var d = $q.defer();
                p.api_sig = sign(p);
                $http.get(url, {params: p})
                    .success(function(data){
                        if(data.rsp.stat === "ok"){
                            d.resolve(data.rsp);
                        } else {
                            d.reject(data.rsp);
                        }
                    })
                    .error(function(data){
                        console.log(data);
                        d.reject(data);
                    });

                return d.promise;
            }

            if (_auth) {
                return _auth.then(function(auth){
                    params.auth_token = auth.token;
                    return process(params);
                }, function(){
                    return process(params);
                });
            } else {
                return process(params);
            }
        }

        // gets an auth url for rtm
        function getAuth(frob){
            var params = angular.extend({}, defaultParams(), {frob: frob, perms: Api.permissions});
            params.api_sig = sign(params);

            //encode the params - simple implementation as not needed elsewhere
            var paramsString = ''
            angular.forEach(params, function(v, k){
                paramsString += k + '=' + encodeURIComponent(v) + '&'
            });

            return Api.authUrl + '?' + paramsString;
        }

        // makes a request for data to RTM
        function getData(method, params){
            var params = angular.extend({}, defaultParams(method), params);

            return executeRequest(Api.url, params);
        }

        return {
            getAuth: getAuth,
            getData: getData
        }
    })