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
        
        var htmlNotes = '<div class="colHeader" style="border-left-style: solid;">Notes</div><div class="colTab notesTab" id="createNewNoteTab">Create New Note</div>';
        var notes = snapshot.val();
        for (var a_note in notes){
            var tNote = notes[a_note];
            if (firstNote || a_note==currentNote.noteId)
            {
                htmlNotes += '<div class="colTab notesTab tabSelected" id="' + a_note + '">' + tNote.noteName + '</div>';
                currentNote = {noteId: a_note, noteName: tNote.noteName};
                $('#' + currentNote.noteId).attr("class","colTab notesTab tabSelected");
                
                // create firebase ref to listen to child_added note thoughts
                attachMessageWrapperListener(userId);
                
                firstNote=false;
            }
            else
            {
                htmlNotes += '<div class="colTab notesTab" id="' + a_note + '">' + tNote.noteName + '</div>';
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
    var noteKeyRef = rootFBRef.child("users").child(userId).child("classes").child(currentClass.userClassId).child("notes").child(currentNote.noteId).child("thoughts").on("child_added", function(snapshot) {
            
            var id = snapshot.key();

            var notePortion = snapshot.val();

            // double check thought isn't already being displayed
            if (($('#par_' + snapshot.key()).length == 0))
            {       
                var htmlToAppend = '<div class="notePortionWrapper" id="par_' + snapshot.key() + '">';

                //add button arrows for navigation when comparing notes
                htmlToAppend += '<div class="compareNavigation left thought"><i class="fa fa-chevron-left fa-lg compareNavigationImage"></i></div>';

                htmlToAppend += '<div class="thoughts">'
                htmlToAppend += '<div class="thoughtContainer thought">'
                htmlToAppend += '<div class="noteContent" id="child_' + snapshot.key() + '" contenteditable="true" spellcheck="false">';
                htmlToAppend += notePortion.noteHTML;
                htmlToAppend += '</div>';
                htmlToAppend += '<div class="noteStar" name="' + snapshot.key() + '" isStarred="';
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
                htmlToAppend += '<div class="flip" id="flip_' + snapshot.key() + '"><span class="glyphicon glyphicon-flash" aria-hidden="true"></span></div>'; 
                
                // delete thought
                htmlToAppend += '<div class="delete_thought" id="delete_' + snapshot.key() + '"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></div>'; 
                
                
                htmlToAppend += '</div>';
                htmlToAppend += '</div>';

                //add button arrows for navigation when comparing notes
                htmlToAppend += '<div class="compareNavigation right thought"><i class="fa fa-chevron-right fa-lg compareNavigationImage"></i></div>';

                htmlToAppend += '</div>';
            }

            // actually add the html for the note portions
            $('#messagesWrapper').append(htmlToAppend);

            // attach the firebase thought object to the jquery object for the element
            $('#child_' + snapshot.key()).data('thought',notePortion);

            // hide the compare navigation buttons
            $('.compareNavigation').hide();

            // scroll to bottom of messages
            $('#messagesWrapper').scrollTop($('#messagesWrapper').prop("scrollHeight"));
    });
    
   
}


/*Written by Kim*/
function grabNextNote(element, direction)
{
      var thought=element.data('thought');
      var otherUserThought= undefined;
      var displayedUserId= undefined;
      var numNotes=0;
      var foundPortions=false;
    
      //reduce number of thoughts showing to 1
      element.children(".thoughts").children().slice(1).remove();
    
      if(!element.data('displayedUser'))
      {
          element.data('displayedUser',0);
      }
       var displayedUser= element.data('displayedUser')
    
        while(!foundPortions)
        {
            if(direction === 'right')
            {
                displayedUser++;
                if(displayedUser >= classMembers.length)
                    displayedUser=0;
            }
            else
            {
                displayedUser--;
                if(displayedUser < 0)
                    displayedUser= classMembers.length-1;
            }
            //Get the id for the next user
            displayedUserId=classMembers[displayedUser];
            
            //Get the note portions written by this user in the timeframe
            var userThoughtRef = rootFBRef.child("users").child(displayedUserId).child("classes").child(currentClass.classId).child("thoughts");
            
                    userThoughtRef.on('child_added', function(snapshot){
                    rootFBRef.child("thoughts").child(snapshot.key()).on('value',function(snapshot){
                        
                            if(snapshot.val() != null)
                            {
                                 otherUserThought=snapshot.val();
                                foundPortions=true;

                                //if this is the first note for this user then replace the text in the first
                                if(++numNotes == 1)
                                {
                                    var divToAlter= element.children('.thoughts').children('.thoughtContainer');
                                    replaceThoughtContent(divToAlter,otherUserThought);              
                                }

                                //otherwise add a thoughtContainer to the thoughts div
                                else{
                                    var htmlToAppend = '<div class="thoughtContainer thought">';
                                    htmlToAppend = '<div class="noteContent" contenteditable="true" spellcheck="false">';
                                    htmlToAppend += otherUserThought.noteHTML;
                                    htmlToAppend += '</div>';
                                    htmlToAppend += '<div class="noteDate">';
                                    var ds = new Date(otherUserThought.startTime);
                                    var de = new Date(otherUserThought.endTime);
                                    var dateStr = (ds.getMonth()+1) + "/" + ds.getDate() + "/" + ds.getFullYear().toString().substring(2,4) + " :    " + ds.getHours() + ":" + ds.getMinutes() + ' - ' + de.getHours() + ":" + de.getMinutes();
                                    htmlToAppend += dateStr;
                                    htmlToAppend += '</div>';
                                    htmlToAppend += '<div class="noteAuthor">';
                                    htmlToAppend += otherUserThought.authorName;
                                    htmlToAppend += '</div>';
                                    htmlToAppend += '</div>';

                                    // actually add the html to the note potionWrapper
                                    element.children('.thoughts').append(htmlToAppend);
                                }
                            }
                        });
//                    });
//                }
            });
            
        }
        
        //set the displayedUser data in the currNote equal to the new value
        element.data('displayedUser',displayedUser);   
    
        //if we are not displaying the current user's notes then make the wrapper a different color
        if(displayedUser == 0)
            element.removeClass('otherNotes');
        else
            element.removeClass('otherNotes');
}

function replaceThoughtContent(divToAlter,thought)
{
    var ds = new Date(thought.startTime);
    var de = new Date(thought.endTime);
    var dateStr = (ds.getMonth()+1) + "/" + ds.getDate() + "/" + ds.getFullYear().toString().substring(2,4) + " :    " + ds.getHours() + ":" + ds.getMinutes() + ' - ' + de.getHours() + ":" + de.getMinutes();

    divToAlter.children('.noteContent').html(thought.noteHTML);
    divToAlter.children('.noteDate').html(dateStr);
    divToAlter.children('.noteAuthor').html(thought.authorName);                 
}

function restoreUserThoughts(){
    
}


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
