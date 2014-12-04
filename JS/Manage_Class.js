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
        modalHTML += "<div class="modal fade lightBG" id="navOptionForgotPassModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">";
        modalHTML +=
    
        // add modal html to document
        

        // show modal
        
        
        debugger;
    });
    
});