//Save Profile Button
$('#saveProfile').click(function() {
    
        currentUserRef.update({
            "firstName": $("#accountDetailsFirstName").val(),
            "lastName": $("#accountDetailsFirstName").val(),
            "email": $("#accountDetailsEmail").val()   
        })
    
    $("#personalProfileModal").modal("hide");
});

//Post to the wall button
$('#wallPostBtn').click(function() {

    // establish ref to note posts
    var postRef = rootFBRef.child("users").child(currentUser.userId).child("classes").child(currentClass.userClassId).child("wall");
    
    // get text to save
    var ToSave = document.getElementById('wallPost').value;
    

    // wrap it in an object
    var d = new Date();
    var postToUpload = {
        noteHTML: ToSave,
        authorId: currentUser.userId,
        authorName: currentUser.firstName + " " + currentUser.lastName,
        parentNote: currentNote.noteId,
        timeAdded: d.getTime()
    }
    // push it up to user notes section
    postRef.push(postToUpload);
    
    //TODO: still need to update wall.
});

$(document).ready(function() {

    
    var readURL = function(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('.profile-pic').attr('src', e.target.result);
            }
    
            reader.readAsDataURL(input.files[0]);
        }
    }
    

    $(".file-upload").on('change', function(){
        readURL(this);
    });
    
    $(".upload-button").on('click', function() {
       $(".file-upload").click();
    });
});