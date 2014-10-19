function getUserLoggedIn() {
	var authClient = new FirebaseSimpleLogin(myRef, function(error, user) { 
		// check if user is already logged in maybe?
		if (user)
		{
			// user is logged on already
			return "hey";
		}
		else
		{
			// user is not logged in
			return "damn";
		}
		return user;
	});
	return "oh";
}