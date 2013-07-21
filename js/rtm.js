/**
 * User: Kieranties
 * Date: 15/07/13
 */

(function(auth, $, md5){

    var apiUrl = "https://api.rememberthemilk.com/services/rest/";
    var authUrl = "https://www.rememberthemilk.com/services/auth/";
    var perms = "delete";

    // returns the default params object for a request
    var defaultParams = function(method){
        var params = {api_key: auth.apiKey, format: "json" };
        if(!!method) { params.method = method; }

        return params;
    }

    // general error handler
    var onError = function(error, callback){
        console.error(error);
        if(callback){ callback(error); }
    }

    // general success handler
    var onSuccess = function(data, successCallback, errorCallback){
        if(successCallback && (data.rsp.stat === "ok")){
            successCallback(data.rsp);
        }else{
            onError(data, errorCallback);
        }
    }

    // returns a signature for the given params
    var sign = function(params){
        var params = params || {};
        var keys = Object.keys(params);
        keys.sort();
        var signature = '';
        for(var i = 0, max = keys.length; i < max; i++){
            signature += (keys[i] + params[keys[i]]);
        }

        signature = auth.sharedSecret + signature;
        return md5(signature);
    }

    // private request executor
    var executeRequest = function(url, params, successCallback, errorCallback){
        params.api_sig = sign(params);

        $.ajax(url,{
            data: params,
            dataType: "json",
            success: function(data){ onSuccess(data, successCallback, errorCallback); },
            error: function(data){ onError(data, errorCallback); }
        });
    }

    // gets an auth url for rtm
    var getAuth = function(frob){
        var params = $.extend({}, defaultParams(), {frob: frob, perms: perms});
        params.api_sig = sign(params);

        return authUrl + '?' + $.param(params);
    }

    // makes a request for data to RTM
    var get = function(method, params, successCallback, errorCallback){
        var params = $.extend({}, defaultParams(method), params);

        executeRequest(apiUrl, params, successCallback, errorCallback);
    }

    window.rtm = {
        getAuth: getAuth,
        get: get
    };

})(auth, jQuery, md5);