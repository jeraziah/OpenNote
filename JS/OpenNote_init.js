var rootFBRef = new Firebase("https://opennote.firebaseio.com/");

var currentUser = undefined;

var currentUserRef= undefined;

var currentClass = undefined;

var currentNote = undefined;

var currNoteStartTime= undefined;

var classMembers= undefined;

// this is for the messagewrapper height to change dynamically based on page height
var h = window.innerHeight;
$('#messagesWrapper').css('height',h-320);

$( window ).resize(function() {
    var h = window.innerHeight;
    $('#messagesWrapper').css('height',h-320);
});

// enable the "press enter to submit thought" checkbox
$("#checkboxForEnterPress").click();

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
	    
        currentUserRef=rootFBRef.child('users').child(user.uid);
        
        currentUserRef.on('value', function (snapshot) {
            //GET DATA and store as currentUser
		    currentUser = snapshot.val();	         
            $("#navAccountHeader").html(currentUser.firstName);
            
            
            $('#accountDetailsFirstName').val(currentUser.firstName);
            $('#accountDetailsLastName').val(currentUser.lastName);
            $('#accountDetailsEmail').val(currentUser.email);
            if(currentUser.image==="")
            {
                $('#profile-pic').attr('src','http://fbcofchesapeake.com/wp-content/uploads/2013/05/question-mark-face.jpg');
            }
            else
            {
                $('#profile-pic').attr('src',currentUser.image);
            }
                 
            $('#navOptionLogin').hide();
            $('#navOptionForgotPass').hide();
            $('#navOptionChangePass').show();
            $('#navOptionAccountDetails').show();
            $('#navOptionLogout').show();

            $('#welcomescreen').hide();
            $('#mainscreen').show();    

            $('#returnToWriting').hide();

            // load class lists based off of what user is enrolled in
            rootFBRef.child('users').child(user.uid).child('classes').on('child_added', function( snapshot) {
                var childAdded = snapshot.val();
                var innerHTML = '';

                // make sure it is a valid class
                if (childAdded.classId != undefined)
                {
                    var classList = childAdded;
                    // make sure an html element hasn't already been created for it
                    if (currentClass == undefined && $('#' + classList.classId).length == 0) 
                    {
                        // set current class
                        currentClass = {userClassId: snapshot.key(), classId: classList.classId, className: classList.classShortName};
                        
                        // create class div
                        innerHTML += '<div class="colTab classTab tabSelected" id="' + classList.classId + '" name="' + snapshot.key() + '">';
                        innerHTML += classList.classShortName;
                        innerHTML += '<div class="viewClassDetails" id="' + snapshot.key() + '"><span class="glyphicon glyphicon-edit"></span></div>';
                        innerHTML += '<div class="removeClass" id="' + snapshot.key() + '"><span class="glyphicon glyphicon-trash"></span></div>';
                        innerHTML += '</div>';

                        // load notes for that particular class
                        loadNotes(user.uid);
                    }  
                    else if ($('#' + classList.classId).length == 0) // make sure an html element hasn't already been created for it
                    {
                        innerHTML += '<div class="colTab classTab" id="' + classList.classId + '" name="' + snapshot.key() + '">';
                        innerHTML += classList.classShortName;    
                        innerHTML += '<div class="viewClassDetails" id="' + snapshot.key() + '"><span class="glyphicon glyphicon-edit"></span></div>';
                        innerHTML += '<div class="removeClass" id="' + snapshot.key() + '"><span class="glyphicon glyphicon-trash"></span></div>';
                        innerHTML += '</div>';
                    } 

                    $('#dynamicClassWrapper').append(innerHTML);	

                    // update click handler for class selection
                    $('.classTab').click(function() {
                        $('.classTab').attr("class","colTab classTab");
                        $(this).attr("class","colTab classTab tabSelected");
                        currentClass = {userClassId: $(this).attr('name'), classId: this.id, className: this.innerHTML};
                        loadNotes(user.uid);
                        $('#editor').empty();
                    });		
                }
            });
            
            // also add event listener for when a class is removed
            rootFBRef.child('users').child(user.uid).child('classes').on('child_removed', function( snapshot) {
                $("#" + snapshot.val().classId).hide();
            });
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
        
        currentUser = undefined;

        currentUserRef= undefined;

        currentClass = undefined;

        currentNote = undefined;

        currNoteStartTime= undefined;

        classMembers= undefined;
	}
});