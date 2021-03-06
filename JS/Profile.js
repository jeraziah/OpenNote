//Save Profile Button
$('#saveProfile').click(function() {
    
        currentUserRef.update({
            "firstName": $("#accountDetailsFirstName").val(),
            "lastName": $("#accountDetailsLastName").val(),
            "email": $("#accountDetailsEmail").val(),
            "image": $('#profile-pic').attr('src')
        });
    
    $("#personalProfileModal").modal("hide");
});

$('#personalProfileModal').on('hidden.bs.modal', function () {
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
});

/*
 * written by alec
 */
//Post to the wall button
$('#wallPostBtn').click(function() {

    // establish ref to note posts
    var postRef = rootFBRef.child("users").child(currentUser.userId).child("wall");
	
    // get text to save
    var ToSave = document.getElementById('wallPost').value;
    

    // wrap it in an object
    var d = new Date();
    var postToUpload = {
        postHTML: ToSave,
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