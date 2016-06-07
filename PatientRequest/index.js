var alexa = require('alexa-app');
module.change_code = 1;
var app = new alexa.app('PatientRequest');
app.launch(function(req,res) {
	res.say("Hello World!!");
});

var mysql = require("mysql");
var con = mysql.createConnection({
	host: "db4free.net",
	user: "upmcsa",
	password: "drowssap",
	database: "alexadb"
});

con.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});
//var APP_ID = undefined; //because this broke last time

//var http = require('http');

//var AlexaSkill = require('./AlexaSkill');//built in helpers

// var PatientRequest = function(){
//   AlexaSkill.call(this, APP_ID);
// };

// PatientRequest.prototype = Object.create(AlexaSkill.prototype);
// PatientRequest.prototype.constructor = PatientRequest;


app.intent('RequestIntent', {
		"slots":{"Item":"LITERAL"}
		,"utterances":["RequestIntent I need a {Item}",
                    "RequestIntent I want a {Item}",
                    "RequestIntent I want an {Item}",
                    "RequestIntent I would like a {Item}",
                    "RequestIntent I would like an {Item}",
                    "RequestIntent get me a {Item}",
                    "RequestIntent get me an {Item}",
                    "RequestIntent bring me a {Item}",
                    "RequestIntent bring me an {Item}",
                    "RequestIntent please get me a {Item}",
                    "RequestIntent please get me an {Item}",
                    "RequestIntent please bring me a {Item}",
                    "RequestIntent please bring me an {Item}"]
	},function(req,res) {
		res.say('A nurse is coming with a '+req.slot('Item'));
		var os = require("os");
		var host = os.hostname();
		console.log(os.hostname());
		var item = req.slot('Item');
		var request = { patient: 'Winnie', room: '1200', msg: item + ' requested.' };
		con.query('INSERT INTO PatientRequestsTable SET ?', request, function(err,res){
  	if(err) throw err;

  console.log('Last insert ID:', res.insertId);
});
	}
);

// app.intent('HelpIntent', {
//   "slots":{},
//   "utterances":["RequestIntent help"]
// },function(req, res){
//     res.say('You can say things like bring me a towel or other items.');
//   }
// );

// PatientRequest.prototype.intentHandlers = {
//   "RequestIntent": function(intent, session, response){
//     var itemName = intent.slots.Item.value.toLowerCase();
//     var speech;
//     if(itemName){
//       speech = "We will send a nurse to bring you " + itemName;
//     }else{
//       speech = "I didn't recognize that item, please try again";
//     }
//     repsonse.tell(speech);
//   },
//
//   "HelpIntent": function(intent, session, response){
//     var repromptText = "What do you need?";
//     var speechOutput = "You can say things like bring me a towel or other items.";
//
//     response.ask(speechOutput, repromptText);
//   }
// }

module.exports = app;

// exports.handler = function(event, context){
//   var patientRequest = new PatientRequest();
//   patientRequest.execute(event, context);
// }
