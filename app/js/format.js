/**
 * User: Kieranties
 * Date: 02/08/13
 */

angular.module('format',[])
    .factory('Format',function(){
        function dimText(text){ return "<dim>" + text +"</dim>";}
        function matchText(text){ return "<match>" + text +"</match>";}
        function urlText(text){ return "<url>" +text + "</url>";}
        function priorityString(val){
            switch(String(val)){
                case "1": return "1 - High";
                case "2": return "2 - Medium";
                case "3": return "3 - Low";
                default: return "None";
            }
        }
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

        return {
            dimText: dimText,
            matchText: matchText,
            urlText: urlText,
            priorityString: priorityString,
            suggest: suggest
        }
    })
    .run(function(){
        Date.prototype.getDayName = function() {
            var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
            return days[this.getDay()];
        }
    })