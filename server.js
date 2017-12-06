// server.js
// where your node app starts

// initialize Express
var express = require('express');
var bodyParser = require('body-parser')
var app = express();

app.use(bodyParser.text({type: '*/*'}))
   .use(express.static('public'));

// Intialize SendGrid
var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
var helper = require('sendgrid').mail;
var fromEmail = new helper.Email('matthew@densons.org');
var toEmail = new helper.Email('matthew+web@densons.org');
var subject = 'Message from matthew.densons.org';

// Initialize openPGP
var openpgp = require('openpgp');
var moment = require('moment');

var pubkeys;
var fs = require('fs');
fs.readFile(__dirname + '/pgp/pubkey.asc', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  console.log(data);
  pubkeys = openpgp.key.readArmored(data).keys;
});

// Start listener
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

// Contact page
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// Send email function
app.post("/send", function (request, response) {
  if(process.env.SENDGRID_API_KEY){
    sendEncryptedEmail(JSON.parse(request.body));
  } 
  response.setHeader('Content-Type', 'application/json');
  response.send(JSON.stringify({ a: 1 }));
});

function sendEncryptedEmail(data) {
  var now = moment();
  var options = {
    data: 'Email sent: ' + now.format() + '\nFrom: ' + data.name + '\n\n' + data.message,
    publicKeys: pubkeys
  }; 

  openpgp.encrypt(options).then(function(ciphertext) {
    var encrypted = ciphertext.data; 

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