/**
 * User: Kieranties
 * Date: 12/07/13
 */

(function(rtm){
    var currentNotifications = {};

    function getPriorityString(val){
        switch(String(val)){
            case "1": return "1 - High";
            case "2": return "2 - Medium";
            case "3": return "3 - Low";
            default: return "None";
        }
    }
    function dimText(text){ return "<dim>" + text +"</dim>";}
    function matchText(text){ return "<match>" + text +"</match>";}
    function urlText(text){ return "<url>" +text + "</url>";}

    function suggest(text){
        var match =  /([\^!@\*#=]{1})(\w+|$)$/ig.exec(text);
        var suggestions = [];
        if(!!match){
            var suggestContent = text.substring(0, text.length-(match[2].length));
            var matchedChar = matchText(match[1]);
            function addSuggestion(typeValue, typeName){
                suggestions.push({
                    content: suggestContent + typeValue,
                    description: [dimText(typeName), "-", matchedChar + typeValue].join(' ')
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

    function notify(data){
        var items = [
            { title: "List", message: rtm.lists[data.id].name },
            { title: "Priority", message: getPriorityString(data.taskseries.task.priority) }
        ];

        if(data.taskseries.task.estimate){
            items.push({title: "Estimate", message: data.taskseries.task.estimate})
        }

        if(!!data.taskseries.tags.tag) {
            for(var x = 0, max = data.taskseries.tags.tag.length; x < max; x++){
                items.push({title: "Tag", message: data.taskseries.tags.tag[x]})
            }
        }

        var opt = {
            type: "list",
            title: data.taskseries.name,
            message: data.taskseries.name,
            iconUrl: "/img/icons/icon128.png",
            items: items,
            buttons: [
                { title: "Delete", iconUrl: "/img/icons/icon128.png" }
            ]
        };

        chrome.notifications.create('', opt, function(notificationId){
            currentNotifications[notificationId] = {
                listLink: "https://www.rememberthemilk.com/home/" + rtm.auth.user.username + "/" + data.id,
                data: data
            }
        })
    }

    // set default option and suggestions as user types
    chrome.omnibox.onInputChanged.addListener(function(text, callback){
        chrome.omnibox.setDefaultSuggestion({description: matchText("Create task") + " - " + text});
        callback(suggest(text));
    })

    // process user entry
    chrome.omnibox.onInputEntered.addListener(function(text){
        // adding a task requires a timeline
        rtm.getData("rtm.timelines.create", null, function(rsp){
            var params = {timeline: rsp.timeline, name: text, parse: 1};
            // add the task itself
            rtm.getData("rtm.tasks.add", params, function(rsp){
                console.log(rsp);
                // display a notification on success
                notify(rsp.list);
            })
        })
    });
    chrome.notifications.onClicked.addListener(function(notificationId){
        var instance = currentNotifications[notificationId];
        if(!!instance){
            chrome.notifications.clear(notificationId, function(wasCleared){
                if(!wasCleared) { return; }
                delete currentNotifications[notificationId];
                chrome.tabs.create({
                    url: instance.listLink
                });
            });
        }
    });
})(rtm);