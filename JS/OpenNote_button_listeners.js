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
			rootFBRef.child('users').child(user.uid).set({
				firstName: $('#registration_firstName').val(),
				lastName: $('#registration_lastName').val(),
				email: $('#registration_inputEmail').val(),
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
	$('#personalProfileModal').modal('show');
	$('#accountDetailsFirstName').val(currentUser.firstName);
	$('#accountDetailsLastName').val(currentUser.lastName);
});

$('#navOptionLogout').click(function() {
	authClient.logout();
});


$('#createNewClassTab').click(function() {
	$('#createClassModal').modal('show');
});

$('#joinClassTab').click(function() {
	$('#joinClassModal').modal('show');


	// create table of available classes
	tableHTML = "<thead><tr><th>Class</th><th>Full Name</th><th>Instructor</th><th>Term</th>"
	tableHTML += "<th>Year</th><th>Description</th><th>Join?</th></tr></thead>";
	tableHTML += '<tbody>';
	var universityClassRef = rootFBRef.child("universities").child(currentUser.university).child("classes").on('value', function( snapshot) {
		var classSnapshot = snapshot.val();
		for (aClass in classSnapshot)
		{
			var tempClass = classSnapshot[aClass];
			tableHTML += '<tr><td>' + tempClass.shortClassName + '</td><td>' + tempClass.longClassName + '</td>';
			tableHTML += '<td>' + tempClass.instructor + '</td><td>' + tempClass.term + '</td>';
			tableHTML += '<td>' + tempClass.year + '</td><td>' + tempClass.description + '</td>';
			tableHTML += '<td style="text-align: center;"><input type="checkbox" class="joinClassCheckbox" value="'; 
			tableHTML += aClass + '|||||' + tempClass.shortClassName + '"></input></td></tr>';
			//console.log(tempClass.instructor);
		}
		tableHTML += '</tbody>';
		
		$('#classListTable').html(tableHTML);

		// add styling async
		loadScript("https://cdn.datatables.net/1.10.3/js/jquery.dataTables.min.js", function () {
		 	//console.log("script loaded successfully");
		 	$('#classListTable').DataTable();

		 	$('#addClassLoadingMsg').hide();
		 	$('#classListTable').show();
	    });

	});
});

$('#createClassAction').click(function() {
	// add class to university classes list
	var universityRef = rootFBRef.child("universities").child(currentUser.university).child("classes");
	var d = new Date();
	var classUniqueId = universityRef.push({
		longClassName: $('#createClassFullName').val(),
		shortClassName: $('#createClassShortName').val(),
		term: $('input[name=createClassTerm]:checked', '#createClassForm').val(),
		year: $('#createClassYear').val(),
		description: $('#createClassDescription').val(),
		classCreator: currentUser.userId,
		createdOn: d.toString(),
		instructor: $('#createClassInstructor').val() 
	});

	// enroll user in that class
	var currentUserClassRef = rootFBRef.child("users").child(currentUser.userId).child("classes");
	currentUserClassRef.push({
		classId: classUniqueId.name(),
		classShortName: $('#createClassShortName').val()
	})

	$('#createClassModal').modal('hide');
});

$('#joinClassAction').click(function() {
	// turn off data refs to university class list
	rootFBRef.child("universities").child(currentUser.university).child("classes").off();

	// get ref to user class list
	var currentUserClassRef = rootFBRef.child("users").child(currentUser.userId).child("classes");

	// get list of classes user wants to enroll in
	var classesToAdd = $('input[class="joinClassCheckbox"]:checked');

	// enroll user in that class
	for (var i=0; i<classesToAdd.length;i++)
	{
		var classDetails = $(classesToAdd[i]).val().split("|||||");

		currentUserClassRef.push({
			classId: classDetails[0],
			classShortName: classDetails[1]
		});

	}

	$('#joinClassModal').modal('hide');
});


$('#createNewNoteTab').click(function() {
	$('#createNoteModal').modal('show');
});

$('#createNoteAction').click(function() {
	// turn off data refs to university class list
	rootFBRef.child("universities").child(currentUser.university).child("classes").off();

	// get ref to user notes list for currently selected class
	var currentUserNoteRef = rootFBRef.child("users").child(currentUser.userId).child("classes").child(currentClass.userClassId).child("notes");

	var d = new Date();

	var noteId = currentUserNoteRef.push({
		noteName: $('#createNoteName').val(),
		noteDescription: $('#createNoteDescription').val(),
		noteCreated: d.toString(),
		noteIsPrivate: $('#createNotePrivate:checked').length > 0,
		noteCreatedBy: currentUser.userId
	});

	currentNote = noteId.name();

	$('#createNoteModal').modal('hide');
});

