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

////Main Screen Create a new Note
//$('#createNewNoteTab').click(function() {
//	$('#createNoteModal').modal('show');
//});

$(document).on('click', '#createNewNoteTab', function() {
	$('#createNoteModal').modal('show');
});

$(document).on('click', '.notesTab', function() {
	// make class for clicked element "tab selected"
    $('.notesTab').attr("class","colTab notesTab");
    $(this).attr("class","colTab notesTab tabSelected");
    
    // update current note
    currentNote = {noteId: $(this).attr("id"), noteName: this.innerHTML};
    
    // clear current thoughts
    $('#messagesWrapper').empty();
    
    attachMessageWrapperListener(currentUser.userId);
    
    // clear editor
    $('#editor').empty();
    
});


$('#postThoughtBtn').click(function() {
    
    // establish ref to note thoughts
    var noteRef = rootFBRef.child("users").child(currentUser.userId).child("classes").child(currentClass.userClassId).child("notes").child(currentNote.noteId).child("thoughts")
    
    // get HTML to save
    var HTMLToSave = $('#editor').html();
    
    // clear editor
    $('#editor').empty();
    
    // wrap it in an object
    var d = new Date();
    var thoughtToUpload = {
        noteHTML: HTMLToSave,
        authorId: currentUser.userId,
        authorName: currentUser.firstName + " " + currentUser.lastName,
        parentNote: currentNote.noteId,
        timeAdded: d.getTime()
    }
    
    // push it up to user notes section
    noteRef.push(thoughtToUpload);
    
    // push it up to class notes section
    
});


$('#createGuideBtn').click(function() {
	var guideRef = rootFBRef.child("users").child(currentUser.userId).child("classes").child(currentClass.userClassId).child("notes").child(currentNote.noteId).child("studyGuide");
	//for(rootFBRef.child("users").child(currentUser.userId).child("classes").child(currentClass.userClassId).child("notes").child(currentNote.noteId).child("studyGuide"))
	//initialize the string for the studyguide
	var printThis = "<h1>Studyguide</h1>";
	
	//still need to get the notes from the studyguide child.


	printIt(printThis);
});

$('#starNoteBtn').click(function() {
	var noteRef = rootFBRef.child("users").child(currentUser.userId).child("classes").child(currentClass.userClassId).child("notes").child(currentNote.noteId).child("studyGuide");

/*

	var studyGuideText = {
		html = 
	}
*/


	/*
	 *  Things to do:
	 *  1. get current message html
	 *  2. add one line break with dashes
	 *  3. add the message html
	 *  4. update the message star to change color
	 */



});