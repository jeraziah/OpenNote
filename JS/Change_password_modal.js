//change password button
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