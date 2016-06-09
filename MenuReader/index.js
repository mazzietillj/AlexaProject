var alexa = require('alexa-app');
module.change_code = 1;
var app = new alexa.app('MenuReader');




/**
 * MenuReader is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 */
// var HowTo = function () {
//     AlexaSkill.call(this, APP_ID);
// };

var LIST_OF_CATEGORIES = ["breakfast", "lunch", "dinner", "beverages", "dessert"];
var BREAKFAST_SUBCATEGORIES = [];
var LUNCHDINNER_SUBCATEGORIES = [];
var BEVERAGE_SUBCATEGORIES = [];
var DESSERT_SUBCATEGORIES = [];
// to keep track of what previous choice was made
var categoryChoice = -1;
var subCategoryChoice = -1;
var stage = 0;
function isInArray(element, list){
  return list.indexOf(element) > -1; //returns true or false
}

app.intent('MenuIntent', {
  "slots":{},
  "utterances": ["MenuIntent what is the menu",
                "MenuIntent read me the menu",
                "MenuIntent what can I have to eat",
                "MenuIntent what's on the menu"]//so the user is able to go back to the top of the tree of questions
}, function(req, res){
      res.say('Would you like to hear the menu for breakfast, lunch, dinner, beverages, or dessert?');
      stage = 1;
});

app.intent('CategoryIncludedIntent', {
  "slots":{"Category":"LIST_OF_CATEGORIES"},
  "utterances": ["{Category}",
                  "CategoryIncludedIntent what's for {Category}",
                  "CategoryIncludedIntent what is for {Category}",
                  "CategoryIncludedIntent read me the menu for  {Category}",
                  "CategoryIncludedIntent read me the {Category}"]
}, function(req, res){
    var category = req.slot("Category");
    if(isInArray(category, LIST_OF_CATEGORIES)){
      if(category == "breakfast"){
        res.say("For breakfast, do you want to hear about juice, cereal, or pancakes?");
      }else if(category == "lunch" || category == "dinner"){
        res.say("For lunch or dinner, do you want to hear about burgers, pizza, or stir fry");
      }else if(category == "beverages"){
        res.say("To drink, would you like to hear about coffee, tea, or soft drinks");
      }else if(category == "dessert"){
        res.say("For dessert, would you like to hear about cake, pie, or ice cream");
      }else{
        res.say("I didn't recognize that category please try again.");
      }
      categoryChoice = LIST_OF_CATEGORIES.indexOf(category);//set the choice to the index of the category picked
      if(categoryChoice != -1){
        stage = 2;
      }
    }else{
      res.say("I didn't reconize that category, please try again.");
    }
   }
);

app.intent('SubcategoryIntent', {
  "slots":{"Subcategory":"LIST_OF_SUBCATEGORIES"},
  "utterances": ["SubcategoryIntent {Subcategory}",
                "SubcategoryIntent what are the options for {Subcategory}",
                "SubcategoryIntent what are the {Subcategory} choices",
                "SubcategoryIntent I want to hear about {Subcategory}"]
}, function(req, res){
    if(stage == 2){
      var subcategory = req.slot("Subcategory");
      if(subcategory != undefined){
        if(subcategory == "burgers"){
          res.say('The burger options are ketchup, pickles, and mustard. What subcategory would you like to hear?');
          stage = 2;
        }
    }else{
      console.log("Subcategory undefined");
    }
  }else{
    res.say("That wasn't one of the provided options, please try again.")
  }
});

app.intent('BackIntent', {
  "slots":{},
  "utterances":["BackIntent back",
                "BackIntent go back",
                "BackIntent back a page",
                "BackIntent previous page"]
},function(req, res){
    if(stage > 0){
      stage = stage - 1;
      if(stage == 1){
        res.say("Would you like to hear the menu for breakfast, lunch, dinner, beverages, or dessert?");
      }else if(stage == 2){
        res.say("You can choose from one of these subcategories [appropriate subcategory here]");
      }
    }else{
      res.say("I can't go back any further.");
    }
    //app.close() or something somewhere?
  }
);

app.intent('CancelIntent', {
  "slots":{},
  "utterances":["CancelIntent cancel",
                "CancelIntent stop",
                "CancelIntent done"]
},function(req, res){
    res.say('Closing menu reader');
    //app.close() or something somewhere?
  }
);

app.intent('HelpIntent', {
  "slots":{},
  "utterances":["MenuIntent help"]
},function(req, res){
    res.say('You can say things like what is on the menu, then choose a category to hear. You can also ' +
            'say cancel, stop, or done to exit');
  }
);


module.exports = app;

// Extend AlexaSkill
// HowTo.prototype = Object.create(AlexaSkill.prototype);
// HowTo.prototype.constructor = HowTo;
//
// HowTo.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
//     var speechText = "Welcome to the Menu Reader. Ask me what the menu is.";
//     // If the user either does not reply to the welcome message or says something that is not
//     // understood, they will be prompted again with this text.
//     var repromptText = "For instructions on what you can say, please say help me.";
//     response.ask(speechText, repromptText);
// };
//
// HowTo.prototype.eventHandlers.onIntent = function (launchRequest, session, response) {
//
// }
//
// HowTo.prototype.intentHandlers = {
//     "MenuIntent": function (intent, session, response) {
//
//         speech = "The menu for today is eggs and bacon";
//
//         // speechOutput = {
//         //         speech: speech,
//         //         type: AlexaSkill.speechOutputType.PLAIN_TEXT
//         //     };
//         //     repromptOutput = {
//         //         speech: "What else can I help with?",
//         //         type: AlexaSkill.speechOutputType.PLAIN_TEXT
//         //     };
//             //response.ask(speechOutput, repromptOutput);
//             response.tell(speech);
//         //}
//
//
//         /*var itemSlot = intent.slots.Item,
//             itemName;
//         if (itemSlot && itemSlot.value){
//             itemName = itemSlot.value.toLowerCase();
//         }
//
//         var cardTitle = "Recipe for " + itemName,
//             recipe = recipes[itemName],
//             speechOutput,
//             repromptOutput;
//         if (recipe) {
//             speechOutput = {
//                 speech: recipe,
//                 type: AlexaSkill.speechOutputType.PLAIN_TEXT
//             };
//             response.tellWithCard(speechOutput, cardTitle, recipe);
//         } else {
//             var speech;
//             if (itemName) {
//                 speech = "I'm sorry, I currently do not know the recipe for " + itemName + ". What else can I help with?";
//             } else {
//                 speech = "I'm sorry, I currently do not know that recipe. What else can I help with?";
//             }
//             speechOutput = {
//                 speech: speech,
//                 type: AlexaSkill.speechOutputType.PLAIN_TEXT
//             };
//             repromptOutput = {
//                 speech: "What else can I help with?",
//                 type: AlexaSkill.speechOutputType.PLAIN_TEXT
//             };
//             response.ask(speechOutput, repromptOutput);
//         }*/
//     },
//
//     "AMAZON.StopIntent": function (intent, session, response) {
//         var speechOutput = "Goodbye";
//         response.tell(speechOutput);
//     },
//
//     "AMAZON.CancelIntent": function (intent, session, response) {
//         var speechOutput = "Goodbye";
//         response.tell(speechOutput);
//     },
//
//     "AMAZON.HelpIntent": function (intent, session, response) {
//         var speechText = "You can ask me what the menu is or exit by saying cancel or stop";
//         var repromptText = "You can ask me what the menu is or exit by saying cancel or stop";
//         var speechOutput = {
//             speech: speechText,
//             type: AlexaSkill.speechOutputType.PLAIN_TEXT
//         };
//         var repromptOutput = {
//             speech: repromptText,
//             type: AlexaSkill.speechOutputType.PLAIN_TEXT
//         };
//         response.ask(speechOutput, repromptOutput);
//     }
// };
//
// exports.handler = function (event, context) {
//     var howTo = new HowTo();
//     howTo.execute(event, context);
// };
