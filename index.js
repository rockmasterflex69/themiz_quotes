var express = require("express");
var alexa = require("alexa-app");

var PORT = process.env.PORT || 8081;
var app = express();

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
  response.say(getRandomMizQuote()).shouldEndSession(true);

});

alexaApp.intent("AMAZON.HelpIntent", {
    "slots": {},
    "utterances": []
  },
  function(request, response) {
    var helpOutput = "You can say 'some statement' or ask 'some question'. You can also say stop or exit to quit.";
    var reprompt = "What would you like to do?";
    // AMAZON.HelpIntent must leave session open -> .shouldEndSession(false)
    response.say(helpOutput).reprompt(reprompt).shouldEndSession(false).send();
  }
);
 
alexaApp.intent("AMAZON.StopIntent", {
    "slots": {},
    "utterances": []
  }, function(request, response) {
    var stopOutput = "Don't You Worry. I'll be back.";
    response.say(stopOutput);
  }
);
 
alexaApp.intent("AMAZON.CancelIntent", {
    "slots": {},
    "utterances": []
  }, function(request, response) {
    var cancelOutput = "No problem. Request cancelled.";
    response.say(cancelOutput);
  }
);

alexaApp.intent("QuoteIntent", {
    "slots": { "NAME": "LITERAL" },
    "utterances": [
      "my {name is|name's} {names|NAME}", "set my name to {names|NAME}"
    ]
  },
  function(request, response) {
    response.say("Success!");
  }
);

function getRandomMizQuote(){
	var notMizQuote = true;
	while(notMizQuote){
		var rand = myArray[Math.floor(Math.random() * data.length)];
		var quote = data[rand].quoteText;
		var quoteAuthor = data[rand].quoteAuthor;
		
		if(quote.indexOf('MIZ') > -1){
			return 'A quote by ' + quoteAuthor + ': ' + quote + ' ';
		}
		
	}
}

app.listen(PORT, () => console.log("Listening on port " + PORT + "."));
