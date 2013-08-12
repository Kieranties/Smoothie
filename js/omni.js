/**
 * User: Kieranties
 * Date: 02/08/13
 */

// 'ng' must be explicitly added so $q, $http etc is set
// see http://docs.angularjs.org/api/angular.injector
angular.injector(['ng', 'format', 'rtm', 'chrome'])
    .invoke(function(Format, Rtm, Chrome, $q){

        function authCheck(){
            var d = $q.defer();
            Rtm.hasAuth().then(
                function(){ d.resolve(); },
                function(){
                    d.reject();
                    console.log("NO AUTH");
            });
            return d.promise;
        }

        Chrome.omnibox.onInputStarted.addListener(function(){
            authCheck();
        });

        //suggest on user updates
        Chrome.omnibox.onInputChanged.addListener(function(text, callback){
            Chrome.omnibox.setDefaultSuggestion({description: Format.matchText("Create task") + " - " + text});
            callback(Format.suggest(text));
        });

        //submit on enter
        Chrome.omnibox.onInputEntered.addListener(function(text){
            // check we have authentication
            authCheck()
                .then(function(){
                    return Rtm.getData("rtm.timelines.create")
                })
                .then(function(rsp){
                    return Rtm.getData("rtm.tasks.add", {timeline: rsp.timeline, name: text, parse: 1})
                })
                .then(function(rsp){
                    console.log(rsp);
                    // display a notification on success
                    //notify(rsp.list);
                })
            });
   })