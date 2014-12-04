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
        modalHTML += "<div class="modal-dialog">";
        modalHTML += "<div class="modal-content">";
        modalHTML += "<div class="modal-header">";
        modalHTML += "<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span></button>";
        modalHTML += "<h4 class="modal-title" id="myModalLabel">Manage My Classes </h4>";
        modalHTML += "</div>";
        
        //modal body
        modalHTML += "<div class="modal-body">";
        modalHTML += "<form class="form-horizontal" role="form" id="manageClassesForm">";
        modalHTML += "<div class="form-group">";
        modalHTML += "<label for="myClasses" class="col-sm-4 control-label">My Classes</label>";
        modalHTML += "</div>";
        modalHTML += "</form>";
        modalHTML += "</div>";
        
        //modal footer
        modalHTML += "<div class="modal-footer">";
        modalHTML += "<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>";
        modalHTML += "</div>";
        
        modalHTML += "</div>";
        modalHTML += "</div>";
        modalHTML += "</div>";
        
        // add modal html to document
        $(document).append(modalHTML);

        // show modal
        
        
        debugger;
    });
    
});
