//login modal login
$('#navOptionLoginAction').click(function() {
	authClient.login('password', {
		email: $('#navOptionLogin_inputEmail').val(),
		password: $('#navOptionLogin_inputPassword').val()
	});	
});