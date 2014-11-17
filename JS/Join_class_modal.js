//join a class
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

		currentUserClassRef.child(classDetails[0]).set({
			classId: classDetails[0],
			classShortName: classDetails[1]
		});
        
        //add user to the member list for the class
        rootFBRef.child("universities").child(currentUser.university).child("classes").child(classDetails[0]).child("users").child(currentUser.userId).set(true);
	}

	$('#joinClassModal').modal('hide');
});