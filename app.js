/*-----------------------------------------------------------------------------
A simple echo bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    stateEndpoint: process.env.BotStateEndpoint,
    openIdMetadata: process.env.BotOpenIdMetadata 
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot. 
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */

// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector, [
    function(session){
        session.send('안녕하세요 반갑습니다 !');
        session.beginDialog('askForPersonalInfo');
    },
    function(session, results){
        session.dialogData.tonightPlan = results.response;
        session.endDialog(`${session.dialogData.tonightPlan}라니! 재밌는 계획이네요 ! 즐거운 저녁시간 되세요 !`)
    }
]);

bot.dialog('askForPersonalInfo',[
    function(session){
        builder.Prompts.text(session, '이름이 뭐에요?');
    },
    function (session, results) {
        session.send(`${results.response}님, 만나서 반갑습니다!`);
        builder.Prompts.text(session, '좋아하는 음식은 무엇인가요?');
    },
    function (session, results) {
        session.send(`${results.response}을/를 즐겨 드시는 군요!`);
        builder.Prompts.text(session, '최근에 어떤영화 보셨나요?');
    },
    function (session, results) {
        session.send(`저도 ${results.response} 재밌게 봤습니다 :)`);
        builder.Prompts.text(session,'오늘 저녁에는 뭐하실 건가요?');        
    },
    function(session,results){
        session.endDialogWithResult(results);
        //test
    }
]);
