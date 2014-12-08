function loadScript(url, callback) {
 
    var script = document.createElement("script")
    script.type = "text/javascript";

    if (script.readyState) { //IE
        script.onreadystatechange = function () {
            if (script.readyState == "loaded" || script.readyState == "complete") {
                script.onreadystatechange = null;
                callback();
            }
        };
    } else { //Others
        script.onload = function () {
            callback();
        };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

function loadNotes(userId) {
    // create child_added ref for class notes to be read once
    //console.log("Load Notes Being Called");
    
    firstNote=true; // global on purpse
    
    $('#messagesWrapper').empty();
    
    
    // create list of class members
    classMembers= [];
    var classMemberRef= rootFBRef.child("universities").child(currentUser.university).child("classes").child(currentClass.classId).child("users");
    classMemberRef.on("child_added", function(snapshot)
    {
        classMembers.push(snapshot.key());
        //make the currentUser be in the front of the list
        if(currentUser.userId === snapshot.key())
        {
            var tmp=classMembers[0];
            classMembers[0]=classMembers[classMembers.length-1];
            classMembers[classMembers.length-1]=tmp;
        }
    });
    
    
    rootFBRef.child("users").child(userId).child("classes").child(currentClass.userClassId).child("notes").on("value", function(snapshot) {
        
        var htmlNotes = '<div class="colHeader" style="border-left-style: solid;">Notes</div><div class="colTab" id="createNewNoteTab">Create New Note</div>';
        var notes = snapshot.val();
        if(snapshot.numChildren() > 0){
            $('#editorClassTutorial').hide();
            $('#editorWrapper').show(); 
            $('#createFirstNote').hide();
        }
        else{
            $('#editorClassTutorial').show();
            $('#editorWrapper').hide(); 
            $('#createFirstNote').show();
        }
        
        for (var a_note in notes){
            var tNote = notes[a_note];
            if (firstNote || a_note==currentNote.noteId)
            {
                htmlNotes += '<div class="colTab notesTab tabSelected" id="' + a_note + '" isPrivate="' + tNote.noteIsPrivate + '">' + tNote.noteName + '</div>';
                currentNote = {noteId: a_note, noteName: tNote.noteName, isPrivate: tNote.noteIsPrivate};
                $('#' + currentNote.noteId).attr("class","colTab notesTab tabSelected");
                
                // create firebase ref to listen to child_added note thoughts
                attachMessageWrapperListener(userId);
                
                firstNote=false;
            }
            else
            {
                htmlNotes += '<div class="colTab notesTab" id="' + a_note + '" isPrivate="' + tNote.noteIsPrivate + '">' + tNote.noteName + '</div>';
            }
        }
        
        //set the start time for new thought to be right now
            var tmp=new Date();
            currNoteStartTime= tmp.getTime();
        
        
        $('#noteWrapper').empty().html(htmlNotes);
    });
    
    
}

// for retrieving thoughts for the messages wrapper
function attachMessageWrapperListener(userId){
    // create firebase ref to listen to child_added note thoughts
    var noteKeyRef = rootFBRef.child("users").child(userId).child("classes").child(currentClass.userClassId).child("notes").child(currentNote.noteId).child("thoughts").orderByChild("startTime").on("value", function(snapshot) {
            
        // clear messages currently there (in case some were removed, etc.)
        $('#messagesWrapper').empty();
        
        // get hashmap of all thoughts in the note
        var allThoughts = snapshot.val();
        
        // turn that hashmap into an array
        var thoughtArray = new Array();
        for (var tempThoughtId in allThoughts){
            var tempThought = allThoughts[tempThoughtId];
            tempThought.thoughtId = tempThoughtId;
            thoughtArray.push(tempThought);
        }
        
        // sort that array by startTime
        //thoughtArray.sort(function(val1,val2){val1.startTime-val2.startTime});
        for (var i = 0; i<thoughtArray.length;i++){
            for (var j=0; j<thoughtArray.length-1; j++){
                if (thoughtArray[j].startTime>thoughtArray[j+1].startTime){
                    var temp = thoughtArray[j];
                    thoughtArray[j]=thoughtArray[j+1];
                    thoughtArray[j+1]=temp;
                }
            }
        }
        
        
        for (var i=0;i<thoughtArray.length;i++)
        {
            notePortion = thoughtArray[i];
            id = notePortion.thoughtId;

            // double check thought isn't already being displayed
            if (($('#par_' + id).length == 0))
            {       
                var htmlToAppend = "";
                htmlToAppend += '<div class="thoughtWrapper">';
                
                // view previous notes bulk
//                htmlToAppend += '<div class="compare_wrapper_bulk left_compare_wrapper_bulk" id="left_compare_bulk_' + id + '"><span class="glyphicon glyphicon-fast-backward"></span></div>';
                
                // view previous notes
                htmlToAppend += '<div class="compare_wrapper left_compare_wrapper" id="left_compare_' + id + '">&laquo</div>';
                  
                // view more recent notes bulk
//                htmlToAppend += '<div class="compare_wrapper_bulk right_compare_wrapper_bulk" id="right_compare_bulk_' + id + '"><span class="glyphicon glyphicon-fast-forward"></div>';
                
                // view more recent notes
                htmlToAppend += '<div class="compare_wrapper right_compare_wrapper" id="right_compare_' + id + '">&raquo</div>';
                
                // create wrapper for note contents
                htmlToAppend += '<div class="notePortionWrapper" id="par_' + id + '">';
                
                htmlToAppend += '<div class="noteContent dont_lose_focus" id="child_' + id + '" contenteditable="true" spellcheck="false">';
                htmlToAppend += notePortion.noteHTML;
                htmlToAppend += '</div>';
                htmlToAppend += '<div class="noteStar" name="' + id + '" isStarred="';
                htmlToAppend += notePortion.isStarred + '" style="color: ';
                htmlToAppend += ((notePortion.isStarred === "true") ? "#4581E2" : "#333") + ';">&#9733</div>';
                htmlToAppend += '<div class="noteDate">';
                var ds = new Date(notePortion.startTime);
                var de = new Date(notePortion.endTime);
                var dateStr = (ds.getMonth()+1) + "/" + ds.getDate() + "/" + ds.getFullYear().toString().substring(2,4) + " :    " + ds.getHours() + ":" + ((ds.getMinutes()<10) ? ("0" + ds.getMinutes()) : ds.getMinutes()) + ' - ' + de.getHours() + ":" + ((de.getMinutes()<10) ? ("0" + de.getMinutes()) : de.getMinutes()); // use ternary operator to add 0 to minutes if less than 10
                htmlToAppend += dateStr;
                htmlToAppend += '</div>';
                htmlToAppend += '<div class="noteAuthor">';
                htmlToAppend += notePortion.authorName;
                htmlToAppend += '</div>';
                
                // flashcard
                htmlToAppend += '<div isFlipped = "false" class="flip" id="flip_' + id + '"><span class="glyphicon glyphicon-flash" aria-hidden="true"></span></div>'; 
                
                // delete thought
                htmlToAppend += '<div class="delete_thought" id="delete_' + id + '"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></div>'; 
                
                // merge thought
                htmlToAppend += '<div class="merge_thought" id="merge_' + id + '" toMerge="false"><span class="glyphicon glyphicon-resize-small" aria-hidden="true"></span></div>'; 
                
                // split thought
                htmlToAppend += '<div class="split_thought" id="split_' + id + '" toMerge="false"><span class="glyphicon glyphicon-resize-full" aria-hidden="true"></span></div>'; 

                htmlToAppend += '</div>'; // end for notePortionWrapper
                
                htmlToAppend += '<div class="othersThoughtsWrapper" id="others_thoughts_' + id + '"></div>';
                
                htmlToAppend += '</div>'; // end for thoughtWrapper
                
                // actually add the html for the note portions
                $('#messagesWrapper').append(htmlToAppend);

                // attach the firebase thought object to the jquery object for the element
                $('#child_' + id).data('thought',notePortion);
                
                var portionEditor=document.getElementById('child_' + id);
                
                // attach the listeners to highlight the editor buttons when the cursor moves
                if (document.addEventListener) {
                    portionEditor.addEventListener("keyup", handleEditorKeyPress, false);
                    portionEditor.addEventListener("click", handleEditorCursorMove, false);
                    portionEditor.addEventListener("focus", function(){
                        focusedElem=$(this);},false);
                    portionEditor.addEventListener("mousedown", function(e){
                        e.stopPropagation();});
                } else if (document.attachEvent) {
                    portionEditor.attachEvent("onkeyup", handleEditorKeyPress);
                    portionEditor.attachEvent("onclick", handleEditorCursorMove);
                    portionEditor.attachEvent("focus",function(){
                        focusedElem=$(this);});
                    portionEditor.attachEvent("mousedown",function(e){
                        e.stopPropagation();});
                } else {
                    portionEditor.onkeyup = handleEditorKeyPress;
                    portionEditor.onclick = handleEditorCursorMove;
                    portionEditor.onfocus = function(){
                        focusedElem=$(this);};
                    portionEditor.onmousedown = function(e){
                        e.stopPropagation();};
                }

                // hide the compare navigation buttons
                $('.compareNavigation').hide();

                // scroll to bottom of messages
                $('#messagesWrapper').scrollTop($('#messagesWrapper').prop("scrollHeight"));
            }
        }
    });
}

/*Written by Kim*/
//function grabNextNote(element, direction)
//{
//      var thought=element.data('thought');
//      var otherUserThought= undefined;
//      var displayedUserId= undefined;
//      var numNotes=0;
//      var foundPortions=false;
//    
//      //reduce number of thoughts showing to 1
//      element.children(".thoughts").children().slice(1).remove();
//    
//      if(!element.data('displayedUser'))
//      {
//          element.data('displayedUser',0);
//      }
//       var displayedUser= element.data('displayedUser')
//    
//        while(!foundPortions)
//        {
//            if(direction === 'right')
//            {
//                displayedUser++;
//                if(displayedUser >= classMembers.length)
//                    displayedUser=0;
//            }
//            else
//            {
//                displayedUser--;
//                if(displayedUser < 0)
//                    displayedUser= classMembers.length-1;
//            }
//            //Get the id for the next user
//            displayedUserId=classMembers[displayedUser];
//            
//            //Get the note portions written by this user in the timeframe
//            var userThoughtRef = rootFBRef.child("users").child(displayedUserId).child("classes").child(currentClass.classId).child("thoughts");
//            
//                    userThoughtRef.on('child_added', function(snapshot){
//                    rootFBRef.child("thoughts").child(snapshot.key()).on('value',function(snapshot){
//                        
//                            if(snapshot.val() != null)
//                            {
//                                 otherUserThought=snapshot.val();
//                                foundPortions=true;
//
//                                //if this is the first note for this user then replace the text in the first
//                                if(++numNotes == 1)
//                                {
//                                    var divToAlter= element.children('.thoughts').children('.thoughtContainer');
//                                    replaceThoughtContent(divToAlter,otherUserThought);              
//                                }
//
//                                //otherwise add a thoughtContainer to the thoughts div
//                                else{
//                                    var htmlToAppend = '<div class="thoughtContainer thought">';
//                                    htmlToAppend = '<div class="noteContent" contenteditable="true" spellcheck="false">';
//                                    htmlToAppend += otherUserThought.noteHTML;
//                                    htmlToAppend += '</div>';
//                                    htmlToAppend += '<div class="noteDate">';
//                                    var ds = new Date(otherUserThought.startTime);
//                                    var de = new Date(otherUserThought.endTime);
//                                    var dateStr = (ds.getMonth()+1) + "/" + ds.getDate() + "/" + ds.getFullYear().toString().substring(2,4) + " :    " + ds.getHours() + ":" + ds.getMinutes() + ' - ' + de.getHours() + ":" + de.getMinutes();
//                                    htmlToAppend += dateStr;
//                                    htmlToAppend += '</div>';
//                                    htmlToAppend += '<div class="noteAuthor">';
//                                    htmlToAppend += otherUserThought.authorName;
//                                    htmlToAppend += '</div>';
//                                    htmlToAppend += '</div>';
//
//                                    // actually add the html to the note potionWrapper
//                                    element.children('.thoughts').append(htmlToAppend);
//                                }
//                            }
//                        });
////                    });
////                }
//            });
//            
//        }
//        
//        //set the displayedUser data in the currNote equal to the new value
//        element.data('displayedUser',displayedUser);   
//    
//        //if we are not displaying the current user's notes then make the wrapper a different color
//        if(displayedUser == 0)
//            element.removeClass('otherNotes');
//        else
//            element.removeClass('otherNotes');
//}
//
//function replaceThoughtContent(divToAlter,thought)
//{
//    var ds = new Date(thought.startTime);
//    var de = new Date(thought.endTime);
//    var dateStr = (ds.getMonth()+1) + "/" + ds.getDate() + "/" + ds.getFullYear().toString().substring(2,4) + " :    " + ds.getHours() + ":" + ds.getMinutes() + ' - ' + de.getHours() + ":" + de.getMinutes();
//
//    divToAlter.children('.noteContent').html(thought.noteHTML);
//    divToAlter.children('.noteDate').html(dateStr);
//    divToAlter.children('.noteAuthor').html(thought.authorName);                 
//}
//
//function restoreUserThoughts(){
//    
//}


/*Written by Alec*/

function printIt(printThis)
{
    var win=null;
    
    win = window.open();
    self.focus();
    win.document.open();
    win.document.write('<'+'html'+'><'+'head'+'><'+'style'+'>');
    win.document.write('body, td { font-family: Verdana; font-size: 10pt;}');
    win.document.write('<'+'/'+'style'+'><'+'/'+'head'+'><'+'body'+'>');
    win.document.write(printThis);
    win.document.write('<'+'/'+'body'+'><'+'/'+'html'+'>');
    win.document.close();
    win.print();
    win.close();
}

function custom_confirm_bar(msg, accept_callback,thoughtId,cancel_callback){
    custom_confirm_all(msg, accept_callback,thoughtId,cancel_callback,true);
}

function custom_confirm_all(msg, accept_callback,thoughtId,cancel_callback,focusOnAccept){
    $('.confirmation_msg').html(msg);
    
    $(".confirmation_accept").click(function(){accept_callback(thoughtId)});
    
    if (cancel_callback != null)
    {
        $(".confirmation_cancel").click(function(){
            // call cancel callback
            cancel_callback(thoughtId);
            
            // hide confirmation bar
            $('.confirmation_bar').hide(500);
            
            // reset default confirmation cancel/exit behavior
            $('.confirmation_cancel').click(function() {
                $('.confirmation_bar').hide(500);
            });
            
            // unbind click accept handler to reset it
            $('.confirmation_accept').unbind("click");
        });
        
        $(".confirmation_exit").click(function(){
            // call cancel callback
            cancel_callback(thoughtId);
            
            // hide confirmation bar
            $('.confirmation_bar').hide(500);
            
            // reset default confirmation cancel/exit behavior
            $('.confirmation_cancel').click(function() {
                $('.confirmation_bar').hide(500);
            });
            
            // unbind click accept handler to reset it
            $('.confirmation_accept').unbind("click");
        });
    }
    
    
    
    $(".confirmation_bar").show();
    
    if (focusOnAccept){
        $(".confirmation_accept").focus();
    }    
}

function getSelectionHtml() {
    var html = "";
    if (typeof window.getSelection != "undefined") {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var container = document.createElement("div");
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                container.appendChild(sel.getRangeAt(i).cloneContents());
            }
            html = container.innerHTML;
        }
    } else if (typeof document.selection != "undefined") {
        if (document.selection.type == "Text") {
            html = document.selection.createRange().htmlText;
        }
    }
    return html;
}

function getNotes(thoughtId,direction,numNotesToGrab){
    
    var currentThoughtData = $("#child_" + thoughtId).data().thought;
    var classThoughtsRef = rootFBRef.child("universities").child(currentUser.university).child("classes").child(currentClass.classId).child("thoughts");
    
    if (direction == 'next'){
        // construct the query
        classThoughtsRef.orderByChild("startTime").startAt(currentThoughtData.startTime+1).limitToFirst(numNotesToGrab).once('value',function(snapshot){
            loadOthersThoughts(thoughtId,direction,snapshot.val());
        });
    }
    else{
        classThoughtsRef.orderByChild("endTime").endAt(currentThoughtData.endTime-1).limitToLast(numNotesToGrab).once('value',function(snapshot){
            loadOthersThoughts(thoughtId,direction,snapshot.val());
        });
    }
}

function loadOthersThoughts(thoughtId,direction,thoughtsReturned){
    
    if (thoughtsReturned == null){
        // no notes were found
    }
    else{
        // get everything queued up and in an array
        var messageQueue = new Array();
        
        // TODO -> DOUBLE CHECK THAT AUTHOR DOES NOT EQUAL CURRENT USER
        for (var classThoughtId in thoughtsReturned){
            var tempNote = thoughtsReturned[classThoughtId];
            tempNote.thoughtId = classThoughtId;
            messageQueue.push(tempNote);
        }
        
        // reverse array list if looking at prev notes to show most recent first
        if (direction == 'prev'){
            messageQueue.reverse();
        }
        
        // save array to "others_thoughts_ + id" HTML element 
        $("#others_thoughts_" + thoughtId).data("messageQueue",messageQueue);
        
        // save direction
        $("#others_thoughts_" + thoughtId).data("messageDirection",direction);
        
        // check if they were already looking at a particular index number
        if ($("#others_thoughts_" + thoughtId).data("messageIndex") == undefined)
        {
            // its the first time getNotes was called, start at the beginning
            $("#others_thoughts_" + thoughtId).data("messageIndex",0);
        }
        
        displayOthersThought(thoughtId,direction);
    }
}

function displayOthersThought(thoughtId,direction){

    // leave highlighted what arrow they had clicked initially
    if (direction == 'prev'){
        $('#left_compare_' + thoughtId).css("color","#4581E2");
    }
    else{
        $('#right_compare_' + thoughtId).css("color","#4581E2");
    }
    
    // clear existing sub thought HTML
    $('#others_thoughts_' + thoughtId).empty();
    
    var messageIndex = $("#others_thoughts_" + thoughtId).data("messageIndex");
    var messageQueue = $("#others_thoughts_" + thoughtId).data("messageQueue");
    var subThought = messageQueue[messageIndex];
    
    subThoughtHTML = "";
    subThoughtHTML += "<div class='subThoughtWrapper' id='sub_thought_" + thoughtId + "' name='" + subThought.thoughtId + "'>";
        
        // figure out if we need a left arrow, if the statement is true, create the div but don't put an arrow in it
        if ((direction == 'prev' && messageIndex+1 == messageQueue.length) || (direction == 'next' && messageIndex == 0)){
            subThoughtHTML += "<div class='subThoughtCompareBulk subThoughtCompareLeftBulk' id='sub_comp_left_bulk_" + thoughtId + "' name='" + subThought.thoughtId + "'></div>";
            subThoughtHTML += "<div class='subThoughtCompare subThoughtCompareLeft' id='sub_comp_left_" + thoughtId + "' name='" + subThought.thoughtId + "'></div>";          
        }
        else{
            subThoughtHTML += "<div class='subThoughtCompareBulk subThoughtCompareLeftBulk' id='sub_comp_left_bulk_" + thoughtId + "' name='" + subThought.thoughtId + "'><span class='glyphicon glyphicon-fast-backward'></span></div>";
            subThoughtHTML += "<div class='subThoughtCompare subThoughtCompareLeft' id='sub_comp_left_" + thoughtId + "' name='" + subThought.thoughtId + "'>&laquo</div>"; 
        }
    
        subThoughtHTML += "<div class='subThoughtContent' id='sub_content_" + thoughtId + "' name='" + subThought.thoughtId + "'>";
            subThoughtHTML += "<div class='subThoughtHTML' id='sub_html_" + thoughtId + "' name='" + subThought.thoughtId + "'>";
            subThoughtHTML += subThought.noteHTML;
            subThoughtHTML += "</div>";
    
            var ds = new Date(subThought.startTime);
            var de = new Date(subThought.endTime);
            var dateStr = (ds.getMonth()+1) + "/" + ds.getDate() + "/" + ds.getFullYear().toString().substring(2,4) + " :    " + ds.getHours() + ":" + ((ds.getMinutes()<10) ? ("0" + ds.getMinutes()) : ds.getMinutes()) + ' - ' + de.getHours() + ":" + ((de.getMinutes()<10) ? ("0" + de.getMinutes()) : de.getMinutes()); // use ternary operator to add 0 to minutes if less than 10
    
            subThoughtHTML += "<div class='subThoughtDate' id='sub_date_" + thoughtId + "' name='" + subThought.thoughtId + "'>";
            subThoughtHTML += dateStr;
            subThoughtHTML += "</div>";
    
            subThoughtHTML += "<div class='subThoughtAuthor' id='sub_author_" + thoughtId + "' name='" + subThought.thoughtId + "'>";
            subThoughtHTML += subThought.authorName;
            subThoughtHTML += "</div>";
    
            subThoughtHTML += "<div class='subThoughtReport' id='sub_report_" + thoughtId + "' name='" + subThought.thoughtId + "'>";
            subThoughtHTML += "Report";
            subThoughtHTML += "</div>";  
    
            subThoughtHTML += "<div class='subThoughtCancel' id='sub_cancel_" + thoughtId + "' name='" + subThought.thoughtId + "'>";
            subThoughtHTML += "Cancel";
            subThoughtHTML += "</div>";
    
            subThoughtHTML += "<div class='subThoughtAdd' id='sub_add_" + thoughtId + "' name='" + subThought.thoughtId + "'>";
            subThoughtHTML += "Add";
            subThoughtHTML += "</div>";
    
        subThoughtHTML += "</div>";
        
        // figure out if we need a right arrow, if the statement is true, create the div but don't put an arrow in it
        if ((direction == 'next' && messageIndex+1 == messageQueue.length) || (direction == 'prev' && messageIndex == 0)){
            subThoughtHTML += "<div class='subThoughtCompare subThoughtCompareRight' id='sub_comp_right_" + thoughtId + "' name='" + subThought.thoughtId + "'></div>";
            subThoughtHTML += "<div class='subThoughtCompareBulk subThoughtCompareRightBulk' id='sub_comp_right_bulk_" + thoughtId + "' name='" + subThought.thoughtId + "'></div>";
        }
        else{
            subThoughtHTML += "<div class='subThoughtCompare subThoughtCompareRight' id='sub_comp_right_" + thoughtId + "' name='" + subThought.thoughtId + "'>&raquo</div>";
            subThoughtHTML += "<div class='subThoughtCompareBulk subThoughtCompareRightBulk' id='sub_comp_right_bulk_" + thoughtId + "' name='" + subThought.thoughtId + "'><span class='glyphicon glyphicon-fast-forward'></span></div>";
        }
    
        subThoughtHTML += "<div class='subThoughtMessageNum' id='sub_message_num_" + thoughtId + "' name='" + subThought.thoughtId + "'>";
        subThoughtHTML += "Showing Thought " + (messageIndex+1) + " of " + messageQueue.length;
        subThoughtHTML += "<span class='subThoughtLoadMore' id='sub_load_more_" + thoughtId + "' name='" + subThought.thoughtId + "'>Load More Thoughts</span>";
        subThoughtHTML += "</div>";
    
    subThoughtHTML += "</div>";
    
    $("#others_thoughts_" + thoughtId).append(subThoughtHTML);
    // create subthought w/ arrows, add noteHTML to a sub thought, figure out what arrows should be shown
    // append to others_thoughts_ + id with customized buttons "Add to Notes, Report, say thanks, cancel" etc. 
}

