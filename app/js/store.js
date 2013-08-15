/**
 * User: Kieranties
 * Date: 04/08/13
 */

angular.module('store',['chrome'])
    .factory('Store', function($q, Chrome){
        var _type = 'local';
        var _accessor = Chrome.storage[_type];

        function get(key){
            var d = $q.defer();

            _accessor.get(key, function(data){
                if(data && data[key]){d.resolve(data[key])}
                else {d.reject("Could not be found - " + key)}
            });

            return d.promise;
        }

        function set(obj){
            var d = $q.defer();

            _accessor.set(obj, function(){
                var err = Chrome.runtime.lastError;
                if(err) {d.reject("Could not set value - " + err.message)}
                else {d.resolve()};
            });

            return d.promise;
        }

        function remove(obj){
            var d = $q.defer();

            _accessor.remove(obj, function(){
                var err = Chrome.runtime.lastError;
                if(err) {d.reject("Could not remove " + obj + " - " + err.message)}
                else {d.resolve()};
            });

            return d.promise;
        }

        return {
            get: get,
            set: set,
            remove: remove
        }
    })
