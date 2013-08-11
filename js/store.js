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
                if(data[key]){d.resolve(data[key])}
                else {d.reject()}
            });

            return d.promise;
        }

        function set(obj){
            var d = $q.defer();

            _accessor.set(obj, function(){
                d.resolve();
            });

            return d.promise;
        }

        function auth(){
            return get('auth');
        }

        return {
            get: get,
            set: set,
            auth: auth
        }
    })
