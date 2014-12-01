$(document).on('click', '.viewClassDetails',function() {
    
    // get classId
    var classId = this.id;
    
    // get info from class
    var classRef = rootFBRef.child("users").child(currentUser.userId).child("classes").child(classId);
    
    classRef.once("value",function (snapshot){
        
        // get class info 
        var classInfo = snapshot.val();
        
        // create html for modal
        modalHTML = "";
        modalHTML += "";
    
        // add modal html to document
        

        // show modal
        
        
        debugger;
    });
    
});