$(document).ready(function(){
  // Setup the form to watch for the submit event
  $('#myForm').submit(function(e){
    e.preventDefault();

    // Grab the elements from the form to make up
    // an object containing name, email and message
    var data = { 
      name: document.getElementById('name').value + '<' + document.getElementById('email').value + '>', 
      message: document.getElementById('message').value
    }

    $.post("send", JSON.stringify(data), function(object) {
        $('#response').html('Email sent!').addClass('success').fadeIn('fast');
      })
      .fail(function(object, error) {
        console.log(error);
        $('#response').html('Error! Email not sent!').addClass('error').fadeIn('fast');
      });
  });

});