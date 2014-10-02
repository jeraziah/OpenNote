var myRef = new Firebase("https://shaun314.firebaseio.com/");

var authClient = new FirebaseSimpleLogin(myRef, function(error, user) { 
	// check if user is already logged in maybe?
	if (user)
	{
		// user is logged on already
	}
	else
	{
		// user is not logged in
	}
});

