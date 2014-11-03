//welcome screen register button
$('#registerButton').click(function() {
	$('#registrationErrorMsg').hide();
	// $('#registrationForm').reset();
	$('#registrationModal').modal('show');
});

//welcome screen login button
$('#loginButton').click(function() {

	// login user using the email/password method
	authClient.login('password', {
		email: $('#InputEmail1').val(),
		password: $('#InputPassword1').val()
	});
});

//welcome screen header login button
$('#navOptionLogin').click(function() {
	$('#navOptionLoginModal').modal('show');

});

//Welcome Screen forgot password button
$('#navOptionForgotPass').click(function() {
	$('#navOptionForgotPassModal').modal('show');
});

//Welcome Screen 'HEADER' change password
$('#navOptionChangePass').click(function() {
	//navOptionChangePassModal
	$('#navOptionChangePassModal').modal('show');
});

//Main Screen 'HEADER' show profile
$('#navOptionAccountDetails').click(function() {
	$('#personalProfileModal').modal('show');

});

//Main SCreen 'HEADER' logout
$('#navOptionLogout').click(function() {
	authClient.logout();
});

//Main Screen create new class
$('#createNewClassTab').click(function() {
	$('#createClassModal').modal('show');
});

//Main Screen join a class
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

//Main Screen Create a new Note
$('#createNewNoteTab').click(function() {
	$('#createNoteModal').modal('show');
});



