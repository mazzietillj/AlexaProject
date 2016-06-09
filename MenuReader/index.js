var alexa = require('alexa-app');
var fs = require('fs');
var xml2js = require('xml2js');
var utterances = require('/Users/zacharc/Desktop/github/alexa-app-server/examples/apps/MenuReader/utterances.js');

module.change_code = 1;
var app = new alexa.app('MenuReader');
var parser = new xml2js.Parser();
var xmlFilePath = "/Users/zacharc/Desktop/github/alexa-app-server/examples/apps/MenuReader/menu.xml";
var xmlContent;   //content of above file

/**
 * MenuReader is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 */

var category = "";
var stage = 0;
function isInArray(element, list){
  return list.indexOf(element) > -1; //returns true or false
}

app.launch(function(req, res){
  xmlContent = fs.readFileSync(xmlFilePath, 'utf8');
  console.log("launch!");
  res.say("application launched").shouldEndSession(false);
});

app.intent('MenuIntent', {
  "slots":{},
  "utterances": utterances.menuIntentUtterances//so the user is able to go back to the top of the tree of questions
}, function(req, res){
      parser.parseString(xmlContent, function(err, result){
        var categories = "";
        var curCategory;
        var numCategories = result.menu.category.length;
        for(var i = 0; i < numCategories; i++){
          curCat = result.menu.category[i];
          categories += curCat.name[0].toLowerCase();
          if(i == numCategories - 2){
            if(numCategories == 2){
              categories += " or ";
            }
            else{
                categories += ", or ";
            }
          }
          else if(i != numCategories - 1){
            categories += ", ";
          }
        } //end category traversing for loop

        res.say('Would you like to hear the menu for ' + categories + '?');
      }); //end parsing

      stage = 1;
}); //end MenuIntent

app.intent('CategoryIncludedIntent', {
  "slots":{"Category": "string"},
  "utterances": utterances.categoryIntentUtterances
}, function(req, res){

    category = req.slot("Category");
    parser.parseString(xmlContent, function(err, result){
      var curCategory;
      var curSub;
      var subcategories = "";
      var found = false;


      for(var i = 0; i < result.menu.category.length; i++){
        curCategory = result.menu.category[i];
        if(curCategory.name[0].toLowerCase() == category){
          found = true;

          try{
            var numSubCat = curCategory.subcategory.length;
            for(var j = 0; j < numSubCat; j++){
              curSub = result.menu.category[i].subcategory[j];
              subcategories += curSub.name[0].toLowerCase();


              //handle commas
              if(j == numSubCat - 2){
                if(numSubCat == 2){
                  subcategories += " or ";
                }
                else{
                    subcategories += ", or ";
                }
              }
              else if(j != numSubCat - 1){
                subcategories += ", ";
              }

            } //end for traversing subcategories
          } //end try

          catch(err){
            res.say("There are no " + category + " subcategories on the menu. Please try again.");
            found = false;
          }

        } //end if category = current
      } //end for traversing categories


      if(found){
        res.say("For " + category + ", do you want to hear about " + subcategories + "?");
        stage = 2;
      }
      else{
        res.say("I didn't recognize that category please try again.");
      }

    }); //end parse

  }
);  //end CategoryIncludedIntent


app.intent('SubcategoryIntent', {
  "slots":{"Subcategory": "string"},
  "utterances": utterances.subcategoryIntentUtterances
}, function(req, res){
    if(stage == 2){
      parser.parseString(xmlContent, function(err, result){
        var subCat = req.slot("Subcategory");
        var curCategory;
        var curSub;
        var items = "";
        var found = false;

        for(var i = 0; i < result.menu.category.length; i++){
          curCategory = result.menu.category[i];
          if(curCategory.name[0].toLowerCase() == category){
            var numSubCat = curCategory.subcategory.length;
              for(var j = 0; j < numSubCat; j++){
                curSub = result.menu.category[i].subcategory[j];
                if(curSub.name[0].toLowerCase() == subCat){
                  found = true;
                  try{
                    var numItems = curSub.item.length;
                    for(var k = 0; k < numItems; k++){
                      items += curSub.item[k];

                      //handle commas
                      if(k == numItems - 2){
                        if(numItems == 2){
                          items += " or ";
                        }
                        else{
                            items += ", or ";
                        }
                      }
                      else if(k != numItems - 1){
                        items += ", ";
                      }
                    } //end for traversing items
                  } //end try
                  catch(err){
                    res.say("There are no " + subCat + " items on the menu. Please try again.");
                    found = false;
                  }
              } //if subcat name = current

            } //for loop traversing subcategories
          } //if category name = current

        } //for loop traversing categories

        if(found){
          res.say("The " + subCat + " offered are " + items + ". Would you like to hear the items in a different subcategory?");
        }
        else{
          res.say("I didn't recognize that category please try again.");
        }
      }); //end parse
    } //end if state = 2
    else{
      res.say("That wasn't one of the provided options, please try again.");
    }
  }
); //end subcategory intent

app.intent('BackIntent', {
  "slots":{},
  "utterances": utterances.backIntentUtterances
},function(req, res){
    if(stage > 0){
      stage = stage - 1;
      if(stage == 1){
        parser.parseString(xmlContent, function(err, result){
          var categories = "";
          var curCategory;
          var numCategories = result.menu.category.length;
          for(var i = 0; i < numCategories; i++){
            curCat = result.menu.category[i];
            categories += curCat.name[0].toLowerCase();
            if(i == numCategories - 2){
              if(numCategories == 2){
                categories += " or ";
              }
              else{
                  categories += ", or ";
              }
            }
            else if(i != numCategories - 1){
              categories += ", ";
            }
          } //end category traversing for loop

          res.say('Would you like to hear the menu for ' + categories + '?');
        }); //end parsing
      }
    }else{
      res.say("I can't go back any further.");
    }
    //app.close() or something somewhere?
  }
);

app.intent('CancelIntent', {
  "slots":{},
  "utterances": utterances.cancelIntentUtterances
},function(req, res){
    res.say('Closing menu reader');
    //app.close() or something somewhere?
  }
);

app.intent('HelpIntent', {
  "slots":{},
  "utterances": utterances.menuIntentUtterances
},function(req, res){
    res.say('You can say things like what is on the menu, then choose a category to hear. You can also ' +
            'say cancel, stop, or done to exit');
  }
);


module.exports = app;
