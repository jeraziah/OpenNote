var rootFBRef = new Firebase("https://opennote.firebaseio.com/");

var currentUser = undefined;

var currentClass = undefined;

var currentNote = undefined;

var authClient = new FirebaseSimpleLogin(rootFBRef, function (error, user) {
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
	    //rootFBRef.child('users').child(user.uid);

	    // close possible login modal that was up
	    $('#navOptionLoginModal').modal('hide');

	    // update currentUser and menu options ONE TIME
	    rootFBRef.child('users').child(user.uid).once('value', function (snapshot) {
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

	    // load class lists based off of what user is enrolled in
	    rootFBRef.child('users').child(user.uid).child('classes').on('child_added', function( snapshot) {
	    	var childAdded = snapshot.val();
            var innerHTML = '';

	    	// make sure it is a valid class
	    	if (childAdded.classId != undefined)
	    	{
	    		var classList = childAdded;
	    		if (currentClass == undefined)
				{
					currentClass = {userClassId: snapshot.name(), classId: classList.classId, className: classList.classShortName};
					innerHTML += '<div class="colTab classTab tabSelected" id="' + classList.classId + '" name="' + snapshot.name() + '">';
					innerHTML += classList.classShortName + '</div>';
				}  
				else 
				{
					innerHTML += '<div class="colTab classTab" id=' + classList.classId + '" name="' + snapshot.name() + '">';
					innerHTML += classList.classShortName + '</div>';
				} 

			    $('#dynamicClassWrapper').append(innerHTML);	

			    // update click handler for class selection
			    $('.classTab').click(function() {
					$('.classTab').attr("class","colTab classTab");
					$(this).attr("class","colTab classTab tabSelected");
					currentClass = {userClassId: $(this).attr('name'), classId: this.id, className: this.innerHTML};
				});		
	    	}
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