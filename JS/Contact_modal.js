//show the contact modal
$('#navOptionContact').click(function() {
	$('#contactModal').modal('show');
});


//show the contact modal
$('#navOptionContact').click(function() {
$('#contactModal').modal('show');
});


$('#contact_Send').click(function() {
    
    var key = 'EfdUGHMS1GOKXSl96riG3g';
    var from_email = $('#contact_inputEmail').val();
    var name = ($('#contact_firstName').val() + $('#contact_lastName').val());
    var subject = $('#contact_reason').val();
    var message = $('#contact_explanation').val();
    

    $.ajax({
  type: "POST",
  url: "https://mandrillapp.com/api/1.0/messages/send.json",
  data: {
    'key': key,
    'message': {
      'from_email': from_email,
      'to': [
          {
            'email': 'mszpak@iastate.edu',
            'name': name,
            'type': 'to'
          },

        ],
      'autotext': 'true',
      'subject': subject,
      'html': message
    }
  }
    
});