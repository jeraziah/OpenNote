//Update list of classes you are an admin
$('#updateClassList').click(function() {
    
    //scan through all classes and see if you are an admin, if yes add to list
    var universityRef = rootFBRef.child("universities").child(currentUser.university).child("classes");
    
    
});