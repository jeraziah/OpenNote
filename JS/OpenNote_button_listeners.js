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

//Main Screen 'HEADER' show classes that you are an Admin
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
        endTime: endTime,
        reported: "false"
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

// UPDATE THOUGHT - triggered when the user had clicked on a thought, but now clicks or tabs away from it 
/* Written by Shaun */
$('#messagesWrapper').delegate(".noteContent","focusout",function(){
    
    // make sure note still exists and didn't lose focus because it was deleted
    if ($(this).data() != undefined){
        // get refernces to the user copy of the note and the class copy of the note
        var userThoughtId = this.id.toString().substring(6);
        var classThoughtId = $(this).data().thought.noteIdInClass;
        
        // check to see that its not updating the flashcard, if it is, then we don't want to update the original note html
        if ($('#flip_' + userThoughtId).attr("isFlipped") === "false"){
            // get HTML from content box
            var newHTML = $(this).html();

            // update class copy of thought if synced up with class (won't be if its someone elses note)
           if (classThoughtId != undefined){ rootFBRef.child("universities").child(currentUser.university).child("classes").child(currentClass.classId).child("thoughts").child(classThoughtId).update({noteHTML: newHTML});
                                           }

            // update user copy of thought
            rootFBRef.child("users").child(currentUser.userId).child("classes").child(currentClass.userClassId).child("notes").child(currentNote.noteId).child("thoughts").child(userThoughtId).update({noteHTML: newHTML});
        }
    }   
});


/* Written by Shaun */
// remove note from both class and user 
$('#messagesWrapper').delegate(".delete_thought","click",function(){
    var callback_fcn = function(thoughtId) {
        // get refernces to the user copy of the note and the class copy of the note
        var userThoughtId = thoughtId;
        var classThoughtId = $("#child_" + userThoughtId).data().thought.noteIdInClass;

        // remove class copy of thought if synced up with class (won't be if its someone elses note)
       if (classThoughtId != undefined){ rootFBRef.child("universities").child(currentUser.university).child("classes").child(currentClass.classId).child("thoughts").child(classThoughtId).remove();
       }
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
	//var guideRef = rootFBRef.child("users").child(currentUser.userId).child("classes").child(currentClass.userClassId).child("notes").child(currentNote.noteId).child("studyGuide");

 // NOOO ^^ See comments below    //for(rootFBRef.child("users").child(currentUser.userId).child("classes").child(currentClass.userClassId).child("notes").child(currentNote.noteId).child("studyGuide"))
	//initialize the string for the studyguide
	var printThis = "<h1>Studyguide</h1>";
	
	//still need to get the notes from the starred thoughts, get all thoughts, there is a "isStarred" property for each thought

    printIt(printThis);
});

//Matt
$(document).on('click', '.flip', function(){
    
    // check if the flashcard side is currenlty showing 
    var isFlipped = $(this).attr("isFlipped");
    
    // get the thoughtId
    var userThoughtId = this.id.toString().substring(5);
    
    // get the reference to the actual thought
    var thoughtRef = rootFBRef.child("users").child(currentUser.userId).child("classes").child(currentClass.userClassId).child("notes").child(currentNote.noteId).child("thoughts").child(userThoughtId);
    
    // get the data associated with that thought
    var data = $("#child_" + userThoughtId).data().thought;
    
    // if the card hasn't been flipped yet
    if(isFlipped === "false"){  
        // clear html inside the noteContent div
        $(this).parent().children('.noteContent').empty();
        
        // if no flashcard data has been saved before, provide a prompt, otherwise display the flashcard data
        if(data.flashHTML == undefined){
            $(this).parent().children('.noteContent').html("[Enter flashcard here]");
        }
        else{
            $(this).parent().children('.noteContent').html(data.flashHTML);  
        }
        
        // set css to differentiate flashcard
        $(this).parent().children('.noteContent').css("background-color","#333");
        $(this).parent().children('.noteContent').css("color","#eee");
        
        // since the flash card text is showing, set isFlipped to true
        $(this).attr("isFlipped", "true");    
    }
    
    else{
        // get flashcard html
        var newHTML = $(this).parent().children('.noteContent').html();
        
        // update the flashHTML property of the thought
        thoughtRef.update({flashHTML: newHTML});
        
        // put back the original html for the note 
        $(this).parent().children('.noteContent').html(data.noteHTML);
        
        // set css back
        $(this).parent().children('.noteContent').css("background-color","#ddd");
        $(this).parent().children('.noteContent').css("color","#333");
        
        // since the original note is showing, set the isFlipped attr to false
        $(this).attr("isFlipped", "false"); 
    }
        
});



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
    
    var cancel_fcn = function(){
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


$(document).on('click', '.split_thought',function() {
  
    var thoughtId = this.id.toString().substring(6);
    
    $(document).on("click","#child_" + thoughtId,function(){ 
        // magic to highlight everything left of cursor
        var range = document.createRange();
        range.setStart(this, 0);
        range.setEnd(document.getSelection().baseNode, document.getSelection().anchorOffset); 
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    });
    
    var accept_callbackfcn = function(thoughtId){
        
        // get first half
        var firstHalf = getSelectionHtml();
        
        // delete the first half of the note, whats left is valid html for the second half
        document.getSelection().deleteFromDocument();
        
        // get second half
        var secondHalf = $("#child_" + thoughtId).html();
        
        // get original note data
        var data = $("#child_" + thoughtId).data().thought;
        
        // establish ref to class thoughts
        var classThoughtRef = rootFBRef.child("universities").child(currentUser.university).child("classes").child(currentClass.classId).child("thoughts");
    
        // establish ref to user thoughts for that particular class and note
        var userNoteThoughtRef = rootFBRef.child("users").child(currentUser.userId).child("classes").child(currentClass.userClassId).child("notes").child(currentNote.noteId).child("thoughts");
    
        
        // make note with first half of HTML
        var halfToUpload = {
        noteHTML: firstHalf,
        authorId: data.authorId,
        authorName: data.authorName,
        parentNote: data.parentNote,
        startTime: data.startTime,
        isStarred: data.isStarred,
        endTime: Math.round((data.startTime+data.endTime)/2)
        }

        //push it up to the user notes thoughts section
        var noteIdInClass = classThoughtRef.push(halfToUpload);

        // save ref to where the thought is within all of the class thoughts
        halfToUpload.noteIdInClass = noteIdInClass.key();

        // upload updated first thought to the user thoughts section
        userNoteThoughtRef.push(halfToUpload);
        
        // make note with second half of HTML
        halfToUpload.endTime = data.endTime;
        halfToUpload.startTime = Math.round((data.startTime+data.endTime)/2)+1;
        halfToUpload.noteHTML = secondHalf;
        delete halfToUpload.noteIdInClass;
        
        // push second half to class thoughts
        noteIdInClass = classThoughtRef.push(halfToUpload);

        // save ref to where the thought is within all of the class thoughts
        halfToUpload.noteIdInClass = noteIdInClass.key();
        
        // upload updated second thought to the user thoughts section
        userNoteThoughtRef.push(halfToUpload);
        
        // delete the original note for user
        rootFBRef.child("users").child(currentUser.userId).child("classes").child(currentClass.userClassId).child("notes").child(currentNote.noteId).child("thoughts").child(thoughtId).remove();
        
        // delete original note for class
        var classThoughtId = data.noteIdInClass;
        rootFBRef.child("universities").child(currentUser.university).child("classes").child(currentClass.classId).child("thoughts").child(classThoughtId).remove();
        
        // remove click listener that highlights 
        $(document).off("click","#child_"+thoughtId);
        
        $("#confirmation_exit").click();
    }    
    
    
    var cancel_fcn = function(thoughtId){
        $("#child_" + thoughtId).unbind("click");
    }
    
    custom_confirm_all("Will split your thought into two thoughts, dividing where the cursor is",accept_callbackfcn,thoughtId,cancel_fcn,false);
    
});


$(document).on('click', '.removeClass',function() {
    
    // get class id from div tag
    var classId = this.id.toString();
    
    // get class details
    rootFBRef.child("users").child(currentUser.userId).child("classes").child(classId).once('value',function(snapshot){
        // get the reference to all the class details (from the university class list)
        var classData = snapshot.val();
        
        // look at who created the class initially
        rootFBRef.child("universities").child(currentUser.university).child("classes").child(classData.classId).once('value',function(snapshot){
            var classDataFromUni = snapshot.val();
            
            if (classDataFromUni.classCreator == currentUser.userId){
                // if so, ask are they sure they want to delete the class from the entire university
                var callbackfcn = function(classIds){
                    // remove from university list
                    rootFBRef.child("universities").child(currentUser.university).child("classes").child(classIds.universityId).remove();
                    
                    // remove from class list
                    rootFBRef.child("users").child(currentUser.userId).child("classes").child(classIds.userId).remove();
                    
                    $("#confirmation_exit").click();
                }
                
                custom_confirm_bar("This will remove the entire class from the university. Are you sure?",callbackfcn,{"userId": classId,"universityId": classData.classId},null);
            }   
            else{
                // if not, ask if they sure they want to un-enroll themselves 
                var callbackfcn = function(classIds){
                    // remove from class list
                    rootFBRef.child("users").child(currentUser.userId).child("classes").child(classIds.userId).remove();
                    
                    $("#confirmation_exit").click();
                }
                
                custom_confirm_bar("This will unenroll you from this class and delete all your notes. Are you sure?",callbackfcn,{"userId": classId,"universityId": classData.classId},null);
            }
        });
        
    });
    
});




$(document).on('click', '.left_compare_wrapper',function() {
    var thoughtId = this.id.toString().substring(13);
    getNotes(thoughtId,'prev',3);
    // clear saved data in the "others_thoughts_ + id" element
});

$(document).on('click', '.right_compare_wrapper',function() {
    var thoughtId = this.id.toString().substring(14);
    getNotes(thoughtId,'next',3);
    // clear saved data in the "others_thoughts_ + id" element
});

$(document).on('click', '.subThoughtCompareLeft',function() {
    var thoughtId = this.id.toString().substring(14);
    var direction = $("#others_thoughts_" + thoughtId).data("messageDirection");
    
    if (direction == 'prev'){
        $("#others_thoughts_" + thoughtId).data("messageIndex",$("#others_thoughts_" + thoughtId).data("messageIndex")+1);
    }
    else{
        $("#others_thoughts_" + thoughtId).data("messageIndex",$("#others_thoughts_" + thoughtId).data("messageIndex")-1);
    }
    
    displayOthersThought(thoughtId,direction)
});

$(document).on('click', '.subThoughtCompareRight',function() {
    var thoughtId = this.id.toString().substring(15);
    var direction = $("#others_thoughts_" + thoughtId).data("messageDirection");
    
    if (direction == 'prev'){
        $("#others_thoughts_" + thoughtId).data("messageIndex",$("#others_thoughts_" + thoughtId).data("messageIndex")-1);
    }
    else{
        $("#others_thoughts_" + thoughtId).data("messageIndex",$("#others_thoughts_" + thoughtId).data("messageIndex")+1);
    }
    
    displayOthersThought(thoughtId,direction)

});

$(document).on('click', '.subThoughtCancel',function() {
    var thoughtId = this.id.toString().substring(11);
    
    // clear all data and html associated with subthoughts
    $(".othersThoughtsWrapper").removeData();
    $(".othersThoughtsWrapper").empty();
    
    $('.compare_wrapper').css("color","#eee");
});


$(document).on('click', '.subThoughtReport',function() {
    var thoughtId = this.getAttribute("name");
    
    rootFBRef.child("universities").child(currentUser.university).child("classes").child(currentClass.classId).child("thoughts").child(thoughtId).update(
        {
            "reported": "true"
        }
    );
});

$(document).on('click', '.subThoughtAdd',function() {
    var thoughtId = this.id.toString().substring(8);
    
    // get message to add
    var messageIndex = $("#others_thoughts_" + thoughtId).data("messageIndex");
    var messageQueue = $("#others_thoughts_" + thoughtId).data("messageQueue");   
    var thought = messageQueue[messageIndex];
    
    // get reference to note
    var userNoteThoughtRef = rootFBRef.child("users").child(currentUser.userId).child("classes").child(currentClass.userClassId).child("notes").child(currentNote.noteId).child("thoughts");
    
    // create thought object
    var userThoughtToUpload = {
        noteHTML: thought.noteHTML,
        authorId: thought.authorId,
        authorName: thought.authorName,
        parentNote: currentNote.noteId,
        startTime: thought.startTime,
        isStarred: "false",
        endTime: thought.endTime
        }

    // close adding subthought menu to cleanup (actual html would be erased automatically, this is for other cleanup things)
    $("#sub_cancel_" + thoughtId).click();
    
    //push it up to the user notes thoughts section
    userNoteThoughtRef.push(userThoughtToUpload);
});

$(document).on('click', '.subThoughtLoadMore',function() {
    var thoughtId = this.id.toString().substring(14);
    var direction = $("#others_thoughts_" + thoughtId).data("messageDirection");
    var messageQueue = $("#others_thoughts_" + thoughtId).data("messageQueue"); 
    var numAdditionalNotes = 3;
    
    getNotes(thoughtId,direction,messageQueue.length + numAdditionalNotes);
    
    displayOthersThought(thoughtId,direction)

});

$(document).on('click', '#checkboxForEnterPress',function() {
    
    // get checkbox status
    if ($(this).is(":checked")){
        // it is checked, add keydown listener to editor
        $("#editor").keydown(function(evt){
           if(evt.keyCode == 13){
               // remove the extra line that was added by pressing enter
               var editorHTML = $("#editor").html();
               editorHTML.substring(0,editorHTML.length-15);
               $("#editor").html(editorHTML);
               
               $("#postThoughtBtn").click();
           } 
        });
    }
    else{
        // remove keydown listener from editor
        $("#editor").unbind("keydown");
    }
});
