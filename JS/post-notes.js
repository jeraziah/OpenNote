//updates the firebase when button is clicked
btUpdateNotes.addEventListener('click', function() {
    // get text from editor box
    var textToUpload = $("#editor-iFrame").contents().find("body").html();
    
    var userThoughtRef = rootFBRef.child("users").child(currentUser.userId).child("classes").child(currentClass.userClassId).child("notes").child(currentNote).child("thoughts");
    
    
    var d = new Date();
    var thoughtToUpload = {
        noteHTML: textToUpload,
        user: currentUser.userId,
        timeAdded: d.getTime()
    }
    
    var classThoughtRef= rootFBRef.child("universities").child(currentUser.university).child("classes").child(currentClass.classId).child("thoughts");
    
    classThoughtRef.push(thoughtToUpload);
});   

