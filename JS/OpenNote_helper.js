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
    
    rootFBRef.child("users").child(userId).child("classes").child(currentClass.userClassId).child("notes").on("value", function(snapshot) {
        
        var htmlNotes = '<div class="colHeader" style="border-left-style: solid;">Notes</div><div class="colTab notesTab" id="createNewNoteTab">Create New Note</div>';
        var notes = snapshot.val();
        for (var a_note in notes){
            var tNote = notes[a_note];
            if (firstNote)
            {
                htmlNotes += '<div class="colTab notesTab tabSelected" id="' + a_note + '">' + tNote.noteName + '</div>';
                currentNote = {noteId: a_note, noteName: tNote.noteName};
                
                // create firebase ref to listen to child_added note thoughts
                attachMessageWrapperListener(userId);
                
                firstNote=false;
            }
            else
            {
                htmlNotes += '<div class="colTab notesTab" id="' + a_note + '">' + tNote.noteName + '</div>';
            }
        }
        
        $('#noteWrapper').empty().html(htmlNotes);
        $('#' + currentNote.noteId).attr("class","colTab notesTab tabSelected");
    });
    
    
}

// for retrieving thoughts for the messages wrapper
function attachMessageWrapperListener(userId){
    // create firebase ref to listen to child_added note thoughts
    var noteRef = rootFBRef.child("users").child(userId).child("classes").child(currentClass.userClassId).child("notes").child(currentNote.noteId).child("thoughts").on("child_added", function(snapshot) {
               
        var notePortion = snapshot.val();
        
        // double check note isn't already being displayed
        if (($('#' + snapshot.name()).length == 0))
        {       
            var htmlToAppend = '<div class="notePortionWrapper" id="' + snapshot.name() + '">';
            htmlToAppend += '<div class="noteContent" contenteditable="true" spellcheck="false">';
            htmlToAppend += notePortion.noteHTML;
            htmlToAppend += '</div>';
            htmlToAppend += '<div class="noteDate">';
            var d = new Date(notePortion.timeAdded);
            var dateStr = d.getHours() + ":" + d.getMinutes() + " - " + (d.getMonth()+1) + "/" + d.getDate() + "/" + d.getFullYear().toString().substring(2,4);
            htmlToAppend += dateStr;
            htmlToAppend += '</div>';
            htmlToAppend += '<div class="noteAuthor">';
            htmlToAppend += notePortion.authorName;
            htmlToAppend += '</div>';
            htmlToAppend += '<div class="noteStar">'
            htmlToAppend += &#9733;
            htmlToAppend += '</div>';
        }
        
        // actually add the html for the note portions
        $('#messagesWrapper').append(htmlToAppend);
        
        // scroll to bottom of messages
        $('#messagesWrapper').scrollTop($('#messagesWrapper').prop("scrollHeight"));
        
    });
    
   
}


