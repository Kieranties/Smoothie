/**
 * User: Kieranties
 * Date: 14/07/13
 */

angular.module('options', ['rtm', 'store'])
    .controller('auth', function ($scope, Rtm, Store) {
        var error = console.error;
        $scope.data = {};

        $scope.auth = function () {
            $scope.hasAuth
                .then(Store.remove('auth'), function(){
                    Rtm.getData('rtm.auth.getFrob')
                        .then(console.log, error)
                })
        }

        $scope.hasAuth =  Store.get('auth');
    });

//            var authSuccess = function (data) {
//                Store.set(data);
//                setAuthData();
//            }
//
//            var frobSuccess = function (rsp) {
//                var frob = {frob: rsp.frob};
//                Store.set(frob);
//
//                chrome.tabs.create({url: Rtm.getAuth(rsp.frob) }, function (tab) {
//                    chrome.tabs.onUpdated.addListener(function (id, info) {
//                        if (id === tab.id && info.status === "complete") {
//                            // refresh auth status
//                            Rtm.getData("rtm.auth.getToken", frob).then(authSuccess, error);
//                        }
//                    });
//                });
//            }
//
//            Rtm.getData('rtm.auth.getFrob')
//                .then(function(rsp){ return Store.set(rsp.frob)}, error)
//                .then(function(){
//                    chrome.tabs.create({url: Rtm.getAuth(rsp.frob) }, function (tab) {
//                        chrome.tabs.onUpdated.addListener(function (id, info) {
//                            if (id === tab.id && info.status === "complete") {
//                                // refresh auth status
//                                Rtm.getData("rtm.auth.getToken", frob)
//                                    .then(authSuccess, error);
//                            }
//                        });
//                    })
//                })
//        }
//
//        setAuthData();
//
//    });