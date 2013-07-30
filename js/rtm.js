/**
 * User: Kieranties
 * Date: 15/07/13
 */

(function(exports, $, md5){

    var rtm = exports.rtm || {};

    var apiUrl = "https://api.rememberthemilk.com/services/rest/";
    var authUrl = "https://www.rememberthemilk.com/services/auth/";
    var perms = "delete";

    // returns the default params object for a request
    function defaultParams(method){
        var params = {api_key: rtm.api.apiKey, format: "json" };
        if(!!method) { params.method = method; }

        return params;
    }

    // general error handler
    function onError(error, callback){
        console.error(error);
        if(callback){ callback(error); }
    }

    // general success handler
    function onSuccess(data, successCallback, errorCallback){
        if(successCallback && (data.rsp.stat === "ok")){
            successCallback(data.rsp);
        }else{
            onError(data, errorCallback);
        }
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

        signature = rtm.api.sharedSecret + signature;
        return md5(signature);
    }

    // private request executor
    function executeRequest(url, params, successCallback, errorCallback){
        if(rtm.auth.token) { params.auth_token = rtm.auth.token; }
        params.api_sig = sign(params);

        $.ajax(url,{
            data: params,
            dataType: "json",
            success: function(data){ onSuccess(data, successCallback, errorCallback); },
            error: function(data){ onError(data, errorCallback); }
        });
    }

    // gets an auth url for rtm
    rtm.getAuth = function(frob){
        var params = $.extend({}, defaultParams(), {frob: frob, perms: perms});
        params.api_sig = sign(params);

        return authUrl + '?' + $.param(params);
    }

    // makes a request for data to RTM
    rtm.getData = function(method, params, successCallback, errorCallback){
        var params = $.extend({}, defaultParams(method), params);

        executeRequest(apiUrl, params, successCallback, errorCallback);
    }

    chrome.storage.local.get("auth", function(data){
        if(!!data.auth){
            rtm.auth = data.auth;

            // cache the users lists on load
            rtm.getData("rtm.lists.getList",null, function(rsp){
                rtm.lists = {};
                $.each(rsp.lists.list, function(idx, list){
                    rtm.lists[list.id] = list;
                });
            });
        }
    });

    exports.rtm = rtm;

})(this, $, md5);