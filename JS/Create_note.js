//create a new note
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