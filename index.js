var express = require("express");
var alexa = require("alexa-app");

var PORT = process.env.PORT || 8081;
var app = express();
var http = require("http");
setInterval(function() {
    http.get("http://afternoon-ridge-11520.herokuapp.com/");
}, 60*60*1000); // every 1 hour

// ALWAYS setup the alexa app and attach it to express before anything else.
var alexaApp = new alexa.app("mizquote");


const data = require('./quotes.json');

alexaApp.express({
  expressApp: app,
  //router: express.Router(),

  // verifies requests come from amazon alexa. Must be enabled for production.
  // You can disable this if you're running a dev environment and want to POST
  // things to test behavior. enabled by default.
  checkCert: true,

  // sets up a GET route when set to true. This is handy for testing in
  // development, but not recommended for production. disabled by default
  debug: false
});

app.set("view engine", "ejs");

alexaApp.launch(function(request, response) {
  response.say('Welcome to MIZ Quotes! Say: give me a miz quote. ').shouldEndSession(false);
});

alexaApp.intent("AMAZON.HelpIntent", {
    "slots": {},
    "utterances": []
  },
  function(request, response) {
    var helpOutput = "You can say 'give me a miz quote'. You can also say stop or exit to quit.";
    var reprompt = "What would you like to do?";
    // AMAZON.HelpIntent must leave session open -> .shouldEndSession(false)
    response.say(helpOutput).reprompt(reprompt).shouldEndSession(false).send();
  }
);
 
alexaApp.intent("AMAZON.StopIntent", {
    "slots": {},
    "utterances": []
  }, function(request, response) {
    var stopOutput = "You are cordially dis-mizzed.";
    response.say(stopOutput);
  }
);
 
alexaApp.intent("AMAZON.CancelIntent", {
    "slots": {},
    "utterances": []
  }, function(request, response) {
    var cancelOutput = "No problem. The miz doesnt need you anyway. ";
    response.say(cancelOutput);
  }
);

alexaApp.intent("QuoteIntent", {
    "slots": { "NAME": "LITERAL" },
    "utterances": [
      "for a quote", "I need more miz", "I want a miz quote", "Miz quote", "Give me a random Miz Quote"
    ]
  },
  function(request, response) {
    response.say(getRandomMizQuote()).shouldEndSession(true);
  }
);

function getRandomMizQuote(){
	var notMizQuote = true;
	while(notMizQuote){
		var rand = Math.floor(Math.random() * data.length);
		var quote = data[rand].quoteText;
		var quoteAuthor = data[rand].quoteAuthor;
		
		if(quote.indexOf('Miz') > -1){
			return 'A quote by ' + quoteAuthor + ': ' + quote + ' ';
		}
		
	}
}
module.exports = app;
app.listen(PORT, () => console.log("Listening on port " + PORT + "."));
