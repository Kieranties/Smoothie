/**
 * User: Kieranties
 * Date: 02/08/13
 */

angular.module('rtm', ['md5', 'store'])
    .constant('Api', {
        url: 'https://api.rememberthemilk.com/services/rest/',
        authUrl: 'https://www.rememberthemilk.com/services/auth/',
        permissions: 'delete',
        format: 'json',
        key: "##APIKEY##",
        secret: "##APISECRET##"
    })
    .factory('Rtm', function(Api, Store, md5, $q, $http){

        // compose default parameters
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
            var execute = function(authToken){
                if(!!authToken){ params.auth_token = authToken }
                return $http.get(Api.url, {params: params});
            }

            return Store.get('auth')
                .then(function(auth){
                    if(!!auth){ return execute(auth.token); }
                    else { return execute; }
                }, execute);
        }

        return {
            getAuth: getAuth,
            getData: getData
        }
    })
