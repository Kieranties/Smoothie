/**
 * User: Kieranties
 * Date: 14/07/13
 */


var connect = function(){
    rtm.get("rtm.auth.getFrob", null, function(data){
        var authUrl = rtm.getAuth(data.frob);
        chrome.tabs.create({url: authUrl});
    });
}

$(function(){
    //toggle the state of the auth box
    chrome.storage.local.get('auth', function(data){
        if(!!data.auth){
            $('#unAuthed, #authed').toggle();
        }
    })

    // wire events
    $('#unAuthed').click(function(){
        rtm.get("rtm.auth.getFrob", null, function(data){
            chrome.storage.local.set({frob: data.frob});

            var authUrl = rtm.getAuth(data.frob);

            chrome.tabs.create({url: authUrl }, function(tab){
                chrome.tabs.onUpdated.addListener(function(id, info){
                    if(id === tab.id && info.status === "complete"){
                        // refresh auth status
                        rtm.get("rtm.auth.getToken", {frob: data.frob}, function(auth){
                            chrome.storage.local.set({auth: auth}, function(){
                                window.location = window.location;
                            });
                        });
                    }
                })
            });
        });
    });
});