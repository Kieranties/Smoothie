/**
 * User: Kieranties
 * Date: 14/07/13
 */

$(function(){
    var reload = function(){ location.reload();};
    //toggle the state of the auth box
    chrome.storage.local.get('auth', function(data){
        if(!!data.auth){
            $('#unauthed, #authed').toggle();
            $('#username').html(data.auth.user.username);
        }
    })

    // wire events
    $('#authBtn').click(function(){
        rtm.get("rtm.auth.getFrob", null, function(data){
            chrome.storage.local.set({frob: data.frob});

            var authUrl = rtm.getAuth(data.frob);

            chrome.tabs.create({url: authUrl }, function(tab){
                chrome.tabs.onUpdated.addListener(function(id, info){
                    if(id === tab.id && info.status === "complete"){
                        // refresh auth status
                        rtm.get("rtm.auth.getToken", {frob: data.frob}, function(auth){
                            //build list cache?
                            //build location cache?
                            chrome.storage.local.set(auth, reload);
                        });
                    }
                })
            });
        });
    });

    $('#unauthBtn').click(function(){
        chrome.storage.local.clear(reload);
    });
});