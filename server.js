// server.js
// where your node app starts

// init project
var express = require('express');
var bodyParser = require('body-parser')
var app = express();

var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
var helper = require('sendgrid').mail;
var fromEmail = new helper.Email('matthew@densons.org');
var toEmail = new helper.Email('matthew+web@densons.org');
var subject = 'Message from matthew.densons.org';

app.use(bodyParser.text({type: '*/*'}))
   .use(express.static('public'));

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
app.post("/send", function (request, response) {
  
  if(process.env.SENDGRID_API_KEY){
      var content = new helper.Content('text/html', '<html><pre>' + request.body + '</pre></html>');
      var mail = new helper.Mail(fromEmail, subject, toEmail, content);

      var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON()
      });
      sg.API(request, function (error, response) {
        if (error) {
          console.log('Error response received');
        }
        console.log(response.statusCode);
      });
  } 
  response.setHeader('Content-Type', 'application/json');
  response.send(JSON.stringify({ a: 1 }));
});
