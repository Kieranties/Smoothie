/**
 * User: Kieranties
 * Date: 12/07/13
 */

Date.prototype.getDayName = function() {
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    return days[this.getDay()];
}

var omni = {
    text: {
        dim: function(text){ return "<dim>" + text +"</dim>";},
        match: function(text){ return "<match>" + text +"</match>";},
        url : function(text){ return "<url>" +text + "</url>";}
    },
    suggest: function(text){
        var match =  /([\^!@\*#=]{1})(\w+|$)$/ig.exec(text);
        var suggestions = [];
        if(!!match){
            var suggestContent = text.substring(0, text.length-(match[2].length));
            var matchedChar = omni.text.match(match[1]);
            var addSuggestion = function(typeValue, typeName){
                suggestions.push({
                    content: suggestContent + typeValue,
                    description: [omni.text.dim(typeName), "-", matchedChar + typeValue].join(' ')
                });
            }
            switch (match[1]){
                case "^":
                    var typeName = "Due Date";
                    addSuggestion("today", typeName);
                    addSuggestion("tomorrow", typeName);
                    var date = new Date();
                    date.setDate(date.getDate() + 2);
                    for(var i = 0; i < 3; i++){
                        var day = date.getDayName();
                        addSuggestion(day, typeName);
                        date.setDate(date.getDate() + 1);
                    }
                    break;
                case "!":
                    var typeName = "Priority";
                    for(var i = 1; i <= 3; i++){
                        addSuggestion(i, typeName);
                    }
                    break;
                case "@":
                        // get locations
                    break;
                case "*":
                    var typeName = "Recurring";
                    addSuggestion("daily", typeName);
                    addSuggestion("weekly", typeName);
                    addSuggestion("monthly", typeName);
                    addSuggestion("after 1 day", typeName);
                    addSuggestion("after 1 week", typeName);
                    break;
                case "#":
                        // get lists / tags
                    break;
                case "=":
                    var typeName = "Time Estimate";
                    addSuggestion("2 min", typeName);
                    addSuggestion("5 min", typeName);
                    addSuggestion("10 min", typeName);
                    addSuggestion("30 min", typeName);
                    addSuggestion("1 hour", typeName);
                    break;
            }
        }
        return suggestions;
    }
}

// triggered when the user starts an omnibox session for this app
chrome.omnibox.onInputStarted.addListener(function(){
    console.log("Smoothie: started!");
})

// triggers when the user starts typing in the omnibox session
chrome.omnibox.onInputChanged.addListener(function(text, suggest){
    chrome.omnibox.setDefaultSuggestion({description: omni.text.match("Create task") + " - " + text});
    suggest(omni.suggest(text));
})

// triggers when the users hits enter
chrome.omnibox.onInputEntered.addListener(function(text,disposition){
    console.log("Smoothie: final text - " + text)
    console.log(disposition);
});

// triggered on user bailing from omnibox session
chrome.omnibox.onInputCancelled.addListener(function() {
    console.log("Smoothie: user bailed!")
})