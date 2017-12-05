$(document).ready(function(){
  // Setup the form to watch for the submit event
  $('#myForm').submit(function(e){
    e.preventDefault();

    // Grab the elements from the form to make up
    // an object containing name, email and message
    var data = { 
      name: document.getElementById('name').value, 
      email: document.getElementById('email').value,
      message: document.getElementById('message').value
    }
    
    console.log(data);

    $.post("send", document.getElementById('message').value, function(object) {
        $('#response').html('Email sent!').addClass('success').fadeIn('fast');
      })
      .fail(function(object, error) {
        console.log(error);
        $('#response').html('Error! Email not sent!').addClass('error').fadeIn('fast');
      });
  });

});