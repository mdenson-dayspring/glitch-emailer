// server.js
// where your node app starts

// init project
var openpgp = require('openpgp');
var moment = require('moment');

var express = require('express');
var app = express();
var helper = require('sendgrid').mail;
var fromEmail = new helper.Email('matthew@densons.org');
var toEmail = new helper.Email('matthew+web@densons.org');
var subject = 'Message from matthew.densons.org';

var pubkeyasc = '';

var pubkeys = openpgp.key.readArmored(pubkeyasc).keys;

app.use(express.static('public'));
app.get("/", function (request, response) {
  
  if(process.env.SENDGRID_API_KEY){ 
    var options, encrypted; 

    var now = moment();
    options = {
      data: 'Simple email sent at ' + now.format(),
      publicKeys: pubkeys
    }; 

    openpgp.encrypt(options).then(function(ciphertext) {
      encrypted = ciphertext.data; 

      var content = new helper.Content('text/html', '<html><pre>' + encrypted + '</pre></html>');
      var mail = new helper.Mail(fromEmail, subject, toEmail, content);

      var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
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
    });
  } 
  
  response.sendFile(__dirname + '/views/index.html');
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
