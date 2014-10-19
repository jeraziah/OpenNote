$('#registerButton').click(function() {
	$('#registrationErrorMsg').hide();
	// $('#registrationForm').reset();
	$('#registrationModal').modal('show');
});

$('#finalizeRegistration').click(function() {
	// double check both passwords entered match
	
	if ($('#registration_inputPassword').val() != $('#registration_inputPasswordCheck').val())
	{
		$('#registrationErrorMsg').html("Error: Passwords must match")
		$('#registrationErrorMsg').show();
	}
	else 
	{
		console.log("First: " + $('#registration_firstName').val());
		console.log("Second: " + $('#registration_lastName').val());
		console.log("Email: " + $('#registration_inputEmail').val());
		console.log("Pass: " + $('#registration_inputPassword').val());
		console.log("University: " + $('#registration_university').val());

		authClient.createUser($('#registration_inputEmail').val(), $('#registration_inputPassword').val(), function(error, user) {
		  if (error === null) 
		  {
		    //console.log("User created successfully:", user);

		    // add fields to user data
			myRef.child('users').child(user.uid).set({
				firstName: $('#registration_firstName').val(),
				lastName: $('#registration_lastName').val(),
				email: $('#registration_inputEmail').val(),
				password: $('#registration_inputPassword').val(),
				university: $('#registration_university').val(),
				provider: user.provider,
				userId: user.uid  
		    });

		    // log user in
		    authClient.login('password', {
				email: $('#registration_inputEmail').val(),
				password: $('#registration_inputPassword').val()
			});

		    // set first name in nav bar account tab
			$("#navAccountHeader").html($('#registration_firstName').val());

			// close modal
			$('#registrationModal').modal('hide');
		  } 
		  else 
		  {
		    console.log("Error creating user:", error);
		    $('#registrationErrorMsg').html(error);
			$('#registrationErrorMsg').show();
		  }
		});
	}
});


$('#loginButton').click(function() {

	// login user using the email/password method
	authClient.login('password', {
		email: $('#InputEmail1').val(),
		password: $('#InputPassword1').val()
	});

});

$('#navOptionLogin').click(function() {
	$('#navOptionLoginModal').modal('show');

});

$('#navOptionLoginAction').click(function() {
	authClient.login('password', {
		email: $('#navOptionLogin_inputEmail').val(),
		password: $('#navOptionLogin_inputPassword').val()
	});	
});

$('#navOptionForgotPass').click(function() {

});

$('#navOptionChangePass').click(function() {
	//navOptionChangePassModal
	$('#navOptionChangePassModal').modal('show');
});

$('#navOptionChangePassAction').click(function() {
	//navOptionChangePassModal

	authClient.changePassword($('#navOptionChangePassEmail').val(), $('#navOptionChangePassOldPassword').val(), 
		$('#navOptionChangePassNewPassword').val(), 
		function(error) {
	  if (error === null) {
	    console.log("Password changed successfully");
	    $('#navOptionChangePassModal').modal('hide');
	  } else {
	    console.log("Error changing password:", error);
	    $('#navOptionChangePassErrorMsg').html(error);
		$('#navOptionChangePassErrorMsg').show();
	  }
	});
});

$('#navOptionAccountDetails').click(function() {

});

$('#navOptionLogout').click(function() {
	authClient.logout();
});









