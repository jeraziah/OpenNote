//Save Profile Button
$('#saveProfile').click(function() {
    
        currentUserRef.update({
            "firstName": $("#accountDetailsFirstName").val(),
            "lastName": $("#accountDetailsLastName").val(),
            "email": $("#accountDetailsEmail").val()   
        })
    
    $("#personalProfileModal").modal("hide");
});

//Post to the wall button
$('#wallPost').click(function() {

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