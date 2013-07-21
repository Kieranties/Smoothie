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