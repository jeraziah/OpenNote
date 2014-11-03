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
$('#wallPost').click(function() {

});