var classAdminId;
var classDetailsName;
var classDetailsShortName;
var classDetailsDescription;
var classDetailsInstructor;
var classDetailsTerm;
var classDetailsUpdated=false;
var numUsersToShow;
var numUsersShowing;
var numNotesToShow;
var numNotesShowing;

$('#navOptionClassAdminModal').on("hidden.bs.modal",function(){
    if(classDetailsUpdated)
    {
      //  $('#classDetailsName').val(classDetailsName);
        $('#classDetailsShortName').val(classDetailsShortName);
        $('#classDetailsDescription').val(classDetailsDescription);
        $('#classDetailsInstructor').val(classDetailsInstructor);
        $('#classDetailsTerm').val(classDetailsTerm);
    }
     $('#manageClassTabs').hide();
     $('#classAdminList').show();
});

function manageClass(classId,name)
{
  //  $('#manageClassModalTitle').html(name);
    $('#classAdminList').hide();
    $('#manageClassTabs').show();
    classAdminId=classId.split("||||")[1];
    displayClassDetails();
    displayUsersInClass();
    displayReportedThoughts();
}

function displayClassDetails()
{
         rootFBRef.child("universities").child(currentUser.university).child("classes").child(classAdminId).on('value', function( snapshot) {
        var classAdmin=snapshot.val();
        classDetailsName=classAdmin.longClassName;
        classDetailsShortName=classAdmin.shortClassName;
        classDetailsDescription=classAdmin.description;
        classDetailsInstructor=classAdmin.instructor;
        classDetailsTerm=classAdmin.term;
        
        $('#classDetailsName').val(classDetailsName);
        $('#classDetailsShortName').val(classDetailsShortName);
            $('#classDetailsDescription').val(classDetailsDescription);
        $('#classDetailsInstructor').val(classDetailsInstructor);
        $('#classDetailsTerm').val(classDetailsTerm);
});
}
                                                                                                          
$("#updateClassDetails").click(function(){
            classDetailsUpdated=true; rootFBRef.child("universities").child(currentUser.university).child("classes").child(classAdminId).update({
            "longClassName": $("#classDetailsName").val(),
            "shortClassName": $("#classDetailsShortName").val(),
            "description": $("#classDetailsDescription").val(),
            "instructor": $("#classDetailsInstructor").val(),
            "term": $("#classDetailsTerm").val(),
        });
             
});

//Create list of user in the class
function displayUsersInClass(){
    
	// create table of users
	
        var tableHTML;
	var classRef = rootFBRef.child("universities").child(currentUser.university).child("classes").child(classAdminId).child("users").on('value', function( snapshot) {
		tableHTML = "<thead><tr><th>Full Name</th><th>Email</th>";
        tableHTML += "<th>Remove?</th></tr></thead>";
	    tableHTML += '<tbody>';
        var classUserSnapshot = snapshot.val();
        numUsersToShow=snapshot.numChildren()-1;
        numUsersShowing=0;
		for (aUser in classUserSnapshot)
		{
            if(aUser!==currentUser.userId){
                rootFBRef.child("users").child(aUser).on('value',function(snapshot){
                    var tempUser = snapshot.val();
                    tableHTML += '<tr><td>' + tempUser.firstName +' ' +tempUser.lastName + '</td>';
                    tableHTML += '<td>' + tempUser.email + '</td>';
                    tableHTML += '<td style="text-align: center;"><input type="checkbox" class="removeUserCheckbox" value="'; 
                    tableHTML += tempUser.userId +'"></input></td></tr>';
                    numUsersShowing++;
                     if(numUsersShowing==numUsersToShow)
                    {
                       	tableHTML += '</tbody>';
		
		$('#classUserListTable').html(tableHTML);

		// add styling async
        loadScript("https://cdn.datatables.net/1.10.3/js/jquery.dataTables.min.js", function () {
		 	$('#classUserListTable').DataTable();
		 	$('#classUserListTable').show();
	    });
                    }
                }); 
                }
        }
            });
	
}

$('#removeUsersButton').click(function(){
   // get list of users to remove
	var usersToRemove = $('input[class="removeUserCheckbox"]:checked');
    
	// remove user from that class
	for (var i=0; i<usersToRemove.length;i++)
	{
		var userId = $(usersToRemove[i]).val();

        //remove user from class user list
        rootFBRef.child("universities").child(currentUser.university).child("classes").child(classAdminId).child("users").child(userId).remove();
        
        //remove class from user's class list
		rootFBRef.child("users").child(userId).child("classes").child(classAdminId).remove();
    }
});


function displayReportedThoughts(){
    
    var tableHTML;
	var classRef = rootFBRef.child("universities").child(currentUser.university).child("classes").child(classAdminId).child("thoughts").orderByChild("reported").equalTo("true").on('value', function( snapshot) {
        
        //get the name of the users
       
            tableHTML = "<thead><tr><th>User</th>";
            tableHTML += "<th>Content</th>"
            tableHTML += "<th>Remove?</th></tr></thead>";
            tableHTML += '<tbody>';
            var moderateNotesSnapshot = snapshot.val();
            numNotesToShow=snapshot.numChildren();
            numNotesShowing=0;
            for (aNote in moderateNotesSnapshot)
            {
                    rootFBRef.child("universities").child(currentUser.university).child("classes").child(classAdminId).child("thoughts").child(aNote).on('value',function(snapshot){
                        var tempNote = snapshot.val();
                        var noteId= snapshot.key();
                        
                         rootFBRef.child("users").child(tempNote.authorId).on('value',function(snapshot){
                                var noteAuthor=snapshot.val();
                                tableHTML += '<tr><td>' +noteAuthor.firstName +' ' +noteAuthor.lastName+ '</td>';
                                tableHTML += '<td>' + tempNote.noteHTML + '</td>';
                                tableHTML += '<td style="text-align: center;"><input type="checkbox" class="moderateNoteCheckbox" value="'; 
                                tableHTML += noteId +'"></input></td></tr>';
                                numNotesShowing++;
                                if(numNotesShowing>=numNotesToShow)
                                {
                                    tableHTML += '</tbody>';

                    $('#moderateNotesListTable').html(tableHTML);

                    // add styling async
                    loadScript("https://cdn.datatables.net/1.10.3/js/jquery.dataTables.min.js", function () {
                        $('#moderateNotesListTable').DataTable();
                        $('#moderateNotesListTable').show();
                    });
                                }

                }); 
                    });
                    }
            });
}

$('#moderateNotesButton').click(function(){
   // get list of notes to remove
	var notesToRemove = $('input[class="moderateNoteCheckbox"]:checked');
    
	// remove note from that class
	for (var i=0; i<notesToRemove.length;i++)
	{
		var noteId = $(notesToRemove[i]).val();

        //remove user from class notes list
        rootFBRef.child("universities").child(currentUser.university).child("classes").child(classAdminId).child("thoughts").child(noteId).remove();
    }
});