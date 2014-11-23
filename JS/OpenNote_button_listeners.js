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

$('#settings_gear').click(function() {
    $('#settings_box').toggle(600);
});

$('#settings_minimize').click(function() {
    $('#settings_box').hide(600);
});

$('#confirmation_exit').click(function() {
    $('#confirmation_bar').hide(500);
});

$('#confirmation_cancel').click(function() {
    $('#confirmation_bar').hide(500);
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

/*Written by Kim and Shaun*/

$('#postThoughtBtn').click(function() {    
    // establish ref to class thoughts
    var classThoughtRef = rootFBRef.child("universities").child(currentUser.university).child("classes").child(currentClass.classId).child("thoughts");
    
    // establish ref to user thoughts for that particular class and note
    var userNoteThoughtRef = rootFBRef.child("users").child(currentUser.userId).child("classes").child(currentClass.userClassId).child("notes").child(currentNote.noteId).child("thoughts");
    
        
    // get HTML to save
    var HTMLToSave = $('#editor').html();
    
    // clear editor
    $('#editor').empty();
    
    // wrap thought details in an object
    var d=new Date();
    var endTime= d.getTime();
    var thoughtToUpload = {
        noteHTML: HTMLToSave,
        authorId: currentUser.userId,
        authorName: currentUser.firstName + " " + currentUser.lastName,
        parentNote: currentNote.noteId,
        startTime: currNoteStartTime,
        isStarred: "false",
        endTime: endTime
    }
    
    //push it up to the user notes thoughts section
    var noteIdInClass = classThoughtRef.push(thoughtToUpload);
    
    // save ref to where the thought is within all of the class thoughts
    thoughtToUpload.noteIdInClass = noteIdInClass.key();
    
    // upload updated thought to the user thoughts section
    userNoteThoughtRef.push(thoughtToUpload);
    
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

// when a user clicks on a thought to type into it
$('#messagesWrapper').delegate(".noteContent","focusin",function(){
    //console.log("focused on " + this.id.toString().substring(6));
});

// when the user had clicked on a thought, but now clicks or tabs away from it
/* Written by Shaun */
$('#messagesWrapper').delegate(".noteContent","focusout",function(){
    // get refernces to the user copy of the note and the class copy of the note
    var userThoughtId = this.id.toString().substring(6);
    var classThoughtId = $(this).data().thought.noteIdInClass;
    
    // get HTML from content box
    var newHTML = $(this).html();
    
    // update class copy of thought
    rootFBRef.child("universities").child(currentUser.university).child("classes").child(currentClass.classId).child("thoughts").child(classThoughtId).update({noteHTML: newHTML});;
    
    // update user copy of thought
    rootFBRef.child("users").child(currentUser.userId).child("classes").child(currentClass.userClassId).child("notes").child(currentNote.noteId).child("thoughts").child(userThoughtId).update({noteHTML: newHTML});;;
    
    
});


/* Written by Shaun */
// remove note from both class and user 
$('#messagesWrapper').delegate(".delete_thought","click",function(){
    var callback_fcn = function(thoughtId) {
        // get refernces to the user copy of the note and the class copy of the note
        var userThoughtId = thoughtId;
        var classThoughtId = $("#child_" + userThoughtId).data().thought.noteIdInClass;

        // remove class copy of thought
        rootFBRef.child("universities").child(currentUser.university).child("classes").child(currentClass.classId).child("thoughts").child(classThoughtId).remove();

        // remove user copy of thought
        rootFBRef.child("users").child(currentUser.userId).child("classes").child(currentClass.userClassId).child("notes").child(currentNote.noteId).child("thoughts").child(userThoughtId).remove();
        
        $('#par_' + userThoughtId).hide();
        $('#confirmation_bar').hide(300);
        
        // unbind click accept handler to reset it
        $('#confirmation_accept').unbind("click");
        
    }   
    
    custom_confirm_bar("Are you sure you want to delete this thought?",callback_fcn,this.id.toString().substring(7),null);
    
});

/*Written by Alec*/
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


$(document).on('click', '.noteStar',function() {
	
    // get a reference to that particular thought that was clicked
    var thoughtId = $(this).attr("name");
    var thoughtRef = rootFBRef.child("users").child(currentUser.userId).child("classes").child(currentClass.userClassId).child("notes").child(currentNote.noteId).child("thoughts").child(thoughtId);
    
    // figure out if already starred or not, make new attribute to keep track
    var currentStarColor = $(this).css("color");   
    
    // if not starred
    if ($(this).attr("isStarred")==="true")
    {
        // change font color, update "isStarred" field at ref to "true"
        $(this).css("color","#333"); 
        $(this).attr("isStarred","false");
        thoughtRef.update({"isStarred":"false"});
    }
    else
    {
        // change back font color, update "isStared" field ref to "false"    
        $(this).css("color","#4581E2"); 
        $(this).attr("isStarred","true");
        thoughtRef.update({"isStarred":"true"});
    }  

    // do all file generation by looking through all thoughts and seeing which are starred in your print it method
});

$(document).on('click', '.merge_thought',function() {
	if ($(this).attr("toMerge")==="true")
    {
        // change font color, update "toMerge" field at ref to "true"
        $(this).css("color","#333"); 
        $(this).attr("toMerge","false");
    }
    else
    {
        // change back font color, update "toMerge" field ref to "false"    
        $(this).css("color","#4581E2"); 
        $(this).attr("toMerge","true");
    }  
    
    // update confirmation bar things
    var numItemsToMerge = $('.merge_thought[toMerge="true"]').length;
    
    var accept_callbackfcn = function(param){
        var selectedMergeDivs = $('.merge_thought[toMerge="true"]');
        
        if (selectedMergeDivs.length > 0)
        {
            var firstStartTime = Date.now();
            var lastEndTime = 0;
            var content = "";
            var firstTime = true;
            var firstThoughtIdHolder;

            console.log("Accepted fcn called");

            for (var i=0; i<selectedMergeDivs.length;i++)
            {
                // reset color and unmark to be merged
                $(selectedMergeDivs[i]).css("color","#333"); 
                $(selectedMergeDivs[i]).attr("toMerge","false");

                var thoughtId = selectedMergeDivs[i].id.toString().substring(6);
                var data = $("#child_" + thoughtId).data().thought;
                if (firstTime){
                    firstThoughtIdHolder = thoughtId;

                    firstStartTime = data.startTime;
                    lastEndTime = data.endTime;
                    content = data.noteHTML;

                    firstTime=false;
                }
                else{
                    if (data.startTime < firstStartTime){
                        firstStartTime = data.startTime;
                    }
                    if (data.endTime > lastEndTime){
                        lastEndTime = data.endTime;
                    }
                    content += ("<br>" + data.noteHTML);

                    // remove note 
                    rootFBRef.child("users").child(currentUser.userId).child("classes").child(currentClass.userClassId).child("notes").child(currentNote.noteId).child("thoughts").child(thoughtId).remove();

                }
            }

            // fix oddity with content spacing
            content.replace("<div></div>","");
            
            // update first note
                    rootFBRef.child("users").child(currentUser.userId).child("classes").child(currentClass.userClassId).child("notes").child(currentNote.noteId).child("thoughts").child(firstThoughtIdHolder).update({"startTime":firstStartTime,"endTime":lastEndTime,"noteHTML":content});
            
            $("#confirmation_exit").click();
        }    
    }
    
    cancel_fcn = function(){
        var selectedMergeDivs = $('.merge_thought[toMerge="true"]');
        
        for (var i=0; i<selectedMergeDivs.length; i++)
        {
            // reset color and unmark to be merged
            $(selectedMergeDivs[i]).css("color","#333"); 
            $(selectedMergeDivs[i]).attr("toMerge","false");
        }
    }
    
    custom_confirm_bar("Click Merge Icon on each thought to merge, will merge " + numItemsToMerge + " together now",accept_callbackfcn,null,cancel_fcn);
    
});





