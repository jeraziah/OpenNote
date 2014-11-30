//show the contact modal
$('#navOptionContact').click(function() {
	$('#contactModal').modal('show');
});


/*
$('#contact_Send').click(function() {
    $.ajax({
  type: “POST”,
  url: “https://mandrillapp.com/api/1.0/messages/send.json”,
  data: {
    ‘key’: ‘EfdUGHMS1GOKXSl96riG3g’,
    ‘message’: {
      ‘from_email’: $('#contact_inputEmail').val(),
      ‘to’: [
          {
            ‘email’: 'mszpak@iastate.edu',
            ‘name’: $('#contact_firstName’).val() + $('#contact_lastName').val(),
            ‘type’: ‘to’
          },

        ],
      ‘autotext’: ‘true’,
      ‘subject’: $('#contact_reason').val(),
      ‘html’: $('#contact_explanation').val()
    }
  }
 })
});
*/