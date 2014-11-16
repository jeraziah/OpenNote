//create a new class
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