//welcome screen register button
$('#registerButton').click(function () {
	$('#registrationErrorMsg').hide();
	// $('#registrationForm').reset();
	$('#registrationModal').modal('show');
});

//welcome screen login button
$('#loginButton').click(function () {

	// login user using the email/password method
	authClient.login('password', {
		email: $('#InputEmail1').val(),
		password: $('#InputPassword1').val()
	});
});

//welcome screen header login button
$('#navOptionLogin').click(function () {
	$('#navOptionLoginModal').modal('show');

});

//Welcome Screen forgot password button
$('#navOptionForgotPass').click(function () {
	$('#navOptionForgotPassModal').modal('show');
});

//Welcome Screen 'HEADER' change password
$('#navOptionChangePass').click(function () {
	//navOptionChangePassModal
	$('#navOptionChangePassModal').modal('show');
});

//Main Screen 'HEADER' show profile
$('#navOptionAccountDetails').click(function() {
	$('#personalProfileModal').modal('show');

});

//Main Screen 'HEADER' show profile
$('#navOptionClassAdmin').click(function() {
	$('#navOptionClassAdminModal').modal('show');

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
	tableHTML = "<thead><tr><th>Class</th><th>Full Name</th><th>Instructor</th><th>Term</th>";
	tableHTML += "<th>Year</th>";
    //<th>Description</th>
    tableHTML += "<th>Join?</th></tr></thead>";
	tableHTML += '<tbody>';
	var universityClassRef = rootFBRef.child("universities").child(currentUser.university).child("classes").on('value', function( snapshot) {
		var classSnapshot = snapshot.val();
		for (aClass in classSnapshot)
		{
			var tempClass = classSnapshot[aClass];
			tableHTML += '<tr><td>' + tempClass.shortClassName + '</td><td>' + tempClass.longClassName + '</td>';
			tableHTML += '<td>' + tempClass.instructor + '</td><td>' + tempClass.term + '</td>';
			tableHTML += '<td>' + tempClass.year + '</td>';
            //<td>' + tempClass.description + '</td>';
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

/*Written by Kim*/

$('#postThoughtBtn').click(function() {    
    // establish ref to thought, class notes, and user notes
    var thoughtRef = rootFBRef.child("thoughts");
    var classThoughtRef = rootFBRef.child("universities").child(currentUser.university).child("classes").child(currentClass.classId).child("thoughts");
    var userNoteThoughtRef = rootFBRef.child("users").child(currentUser.userId).child("classes").child(currentClass.userClassId).child("notes").child(currentNote.noteId).child("thoughts");
    var userThoughtRef = rootFBRef.child("users").child(currentUser.userId).child("classes").child(currentClass.userClassId).child("thoughts");
        
    // get HTML to save
    var HTMLToSave = $('#editor').html();
    
    // clear editor
    $('#editor').empty();
    
    // wrap it in an object
    var d=new Date();
    var endTime= d.getTime();
    var thoughtToUpload = {
        noteHTML: HTMLToSave,
        authorId: currentUser.userId,
        authorName: currentUser.firstName + " " + currentUser.lastName,
        parentNote: currentNote.noteId,
        startTime: currNoteStartTime,
        endTime: endTime
    }
    var thoughtIndexToUpload = {
        startTime: currNoteStartTime,
        endTime: endTime
    }
    
    //push it up to the thoughts section
    var id= thoughtRef.push(thoughtToUpload);
     
    // push index to user and class notes section
//    id.set(thoughtToUpload, function(err){
//        if(!err){
            var name=id.key();
            classThoughtRef.child(name).set(thoughtIndexToUpload);
            userNoteThoughtRef.child(name).set(thoughtIndexToUpload); 
            userThoughtRef.child(name).set(thoughtIndexToUpload);
//        }
//    });
    
});

$(document).on('mouseover mouseout','.compareNavigation',function(){
    $(this).toggleClass('hover');
});

$(document).on('click', '.compareNavigation.left', function(){
    grabNextNote($(this).parent(),'left');
})

$(document).on('click', '.compareNavigation.right', function(){
    grabNextNote($(this).parent(),'right');
})

$('#compareNotes').click(function(){
    
    //hide the editor box
    $('#writeNoteWrapper').hide();
    
    //hide the compareNotes button
    $('#compareNotes').hide();
    
    //show the navigation buttons
    $('.compareNavigation').show();

    //show the returnToWriting button
    $('#returnToWriting').show();
});

$('#returnToWriting').click(function(){
    
    //hide the navigation buttons
    $('.compareNavigation').hide();
    
    //hide the returnToWriting button
    $('#returnToWriting').hide();
    
     //show the editor box
    $('#writeNoteWrapper').show();
    
    //show the compareNotes button
    $('#compareNotes').show();
    
    //replace all the note portions with the user notes (except the ones that were pinned)
    restoreUserThoughts();
});


<<<<<<< HEAD


=======
$('#createGuideBtn').click(function() {
	var guideRef = rootFBRef.child("users").child(currentUser.userId).child("classes").child(currentClass.userClassId).child("notes").child(currentNote.noteId).child("studyGuide");
	//for(rootFBRef.child("users").child(currentUser.userId).child("classes").child(currentClass.userClassId).child("notes").child(currentNote.noteId).child("studyGuide"))
	//initialize the string for the studyguide
	var printThis = "<h1>Studyguide</h1>";
	
	//still need to get the notes from the studyguide child.

    printIt(printThis);
});

//Matt
$(document).on('click', '.flip', function(){
    
    $(this).parent().children('.noteContent').hide();
    var htmlToAppend = '<input type="flashCard" class="form-control" id="flashCard" placeholder=""/>';
    $(this).parent().prepend(htmlToAppend);

});


//link to a cool flip animation
//http://codepen.io/rhernando/pen/vjGxH


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
>>>>>>> 960f5903ea42de7818f549db0842da53b307f4e5

