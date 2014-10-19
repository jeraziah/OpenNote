var myRef = new Firebase("https://opennote.firebaseio.com/");

var currentUser = undefined;

var authClient = new FirebaseSimpleLogin(myRef, function(error, user) {
	if (error) 
	{
    	// an error occurred while attempting login
    	console.log(error);
    	$('#navOptionLoginErrorMsg').html(error);
		$('#navOptionLoginErrorMsg').show();
	} 
	else if (user) 
	{
	    // user authenticated with Firebase
	    console.log("User ID: " + user.uid + ", Provider: " + user.provider);
	    //myRef.child('users').child(user.uid);

	    // close possible login modal that was up
	    $('#navOptionLoginModal').modal('hide');

	    myRef.child('users').child(user.uid).on('value', function (snapshot) {
		    //GET DATA and store as currentUser
		    currentUser = snapshot.val();

		    $("#navAccountHeader").html(currentUser.firstName);

		    $('#navOptionLogin').hide();
		    $('#navOptionForgotPass').hide();
		    $('#navOptionChangePass').show();
		    $('#navOptionAccountDetails').show();
		    $('#navOptionLogout').show();

		    $('#welcomescreen').hide();
		    $('#mainscreen').show();    

		  });

	} 

	else 
	{
		// user is logged out
		currentUser = undefined;

		$("#navAccountHeader").html("Login");

		$('#navOptionLogin').show();
	    $('#navOptionForgotPass').show();
	    $('#navOptionChangePass').hide();
	    $('#navOptionAccountDetails').hide();
	    $('#navOptionLogout').hide();

	    $('#mainscreen').hide();
	    $('#welcomescreen').show();
	}
});