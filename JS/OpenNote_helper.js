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
        
        //set the start time for new thought to be right now
            var tmp=new Date();
            currNoteStartTime= tmp.getDate();
        
        $('#noteWrapper').empty().html(htmlNotes);
        $('#' + currentNote.noteId).attr("class","colTab notesTab tabSelected");
    });
    
    
}

// for retrieving thoughts for the messages wrapper
function attachMessageWrapperListener(userId){
    // create firebase ref to listen to child_added note thoughts
    var noteKeyRef = rootFBRef.child("users").child(userId).child("classes").child(currentClass.userClassId).child("notes").child(currentNote.noteId).child("thoughts").on("child_added", function(snapshot) {
            
            var id = snapshot.key();
            
            var noteRef=rootFBRef.child("thoughts").child(id).on('value', function(snapshot){

                var notePortion = snapshot.val();

                // double check note isn't already being displayed
                if (($('#' + snapshot.name()).length == 0))
                {       
                    var htmlToAppend = '<div class="notePortionWrapper" id="' + snapshot.name() + '">';

                    //add button arrows for navigation when comparing notes
                    htmlToAppend += '<div class="compareNavigation left thought"><i class="fa fa-chevron-left fa-lg compareNavigationImage"></i></div>';

                    htmlToAppend += '<div class="thoughtContainer thought">'
                    htmlToAppend += '<div class="noteContent" contenteditable="true" spellcheck="false">';
                    htmlToAppend += notePortion.noteHTML;
                    htmlToAppend += '</div>';
                    htmlToAppend += '<div class="noteDate">';
                    var ds = new Date(notePortion.startTime);
                    var de = new Date(notePortion.endTime);
                    var dateStr = (ds.getMonth()+1) + "/" + ds.getDate() + "/" + ds.getFullYear().toString().substring(2,4) + " :    " + ds.getHours() + ":" + ds.getMinutes() + ' - ' + de.getHours() + ":" + de.getMinutes();
                    htmlToAppend += dateStr;
                    htmlToAppend += '</div>';
                    htmlToAppend += '<div class="noteAuthor">';
                    htmlToAppend += notePortion.authorName;
                    htmlToAppend += '</div>';
                    htmlToAppend += '</div>';

                    //add button arrows for navigation when comparing notes
                    htmlToAppend += '<div class="compareNavigation right thought"><i class="fa fa-chevron-right fa-lg compareNavigationImage"></i></div>';

                    htmlToAppend += '</div>';
                }

                // actually add the html for the note portions
                $('#messagesWrapper').append(htmlToAppend);

                //hide the compare navigation buttons
                $('.compareNavigation').hide();

                // scroll to bottom of messages
                $('#messagesWrapper').scrollTop($('#messagesWrapper').prop("scrollHeight"));
        });
    });
    
   
}


/*Written by Kim*/
function grabNextNote(curr, direction)
{
//    currId=
//    class=
//    timeframe=
}


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