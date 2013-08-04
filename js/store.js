/**
 * User: Kieranties
 * Date: 04/08/13
 */

angular.module('store',[])
    .factory('Store', function(){
        var _type = 'local';
        var _accessor = chrome.storage[_type];

        function get(key, callback){
            _accessor.get(key, callback);
        }

        function set(obj, callback){
            _accessor.set(obj, callback);
        }

        function auth(callback){
            get('auth', callback);
        }

        return {
            get: get,
            set: set,
            auth: auth
        }
    })
