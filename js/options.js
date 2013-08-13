/**
 * User: Kieranties
 * Date: 14/07/13
 */

angular.module('options', ['rtm', 'store'])
    .controller('auth', function ($scope, Rtm, Store) {
        $scope.data = {};

        function setAuthData() {
            Store.auth(function (auth) {
                $scope.data.auth = auth;
            });
        }

        $scope.authorise = function () {

            var error = function (data) {
                console.log(data)
            }

            var authSuccess = function (data) {
                Store.set(data);
                setAuthData();
            }

            var frobSuccess = function (rsp) {
                var frob = {frob: rsp.frob};
                Store.set(frob);

                chrome.tabs.create({url: Rtm.getAuth(rsp.frob) }, function (tab) {
                    chrome.tabs.onUpdated.addListener(function (id, info) {
                        if (id === tab.id && info.status === "complete") {
                            // refresh auth status
                            Rtm.getData("rtm.auth.getToken", frob).then(authSuccess, error);
                        }
                    });
                });
            }

            Rtm.getData('rtm.auth.getFrob').then(frobSuccess, error);
        }

        setAuthData();

    });