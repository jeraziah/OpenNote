var classThoughtRef=new Firebase("https://opennote.firebaseio.com/universities/Iowa%20State%20University/classes/-JZd5iT98JbrKBXui9zJ/thoughts");
var userThoughtRef= new Firebase("https://opennote.firebaseio.com/users/simplelogin%3A9/classes/-JZdzVFioxyIvF_jZASx/notes/-JZe22nPubSDUWLN5B65/thoughts");
var body=$("#editor-iFrame").contents().find('body');

userThoughtRef.on('value',function( snapshot) {
        snapshot.forEach(function(portion) {
            body.append('<div class="portion" id="' + portion.name() + '">' + portion.val()+ '</div')
        });
    
        moveCursorToEnd();
});
    
//updates the firebase when button is clicked
btUpdateNotes.on('click', function() {
    
    // get text from editor box
    var textToUpload=$("#editor-iFrame").contents().find("body").html();
    
    //   var userThoughtRef = rootFBRef.child("users").child(currentUser.userId).child("classes").child(currentClass.userClassId).child("notes").child(currentNote).child("thoughts");
    
    
    var d = new Date();
    var thoughtToUpload = {
        noteHTML: textToUpload,
        user: currentUser.userId,
        timeAdded: d.getTime()
    }

    //rootFBRef.child("universities").child(currentUser.university).child("classes").child(currentClass.classId).child("thoughts");
    
    var newRef=classThoughtRef.push(thoughtToUpload);
    var newId=newRef.name();
    
    var newThought=$("#editor-iFrame").contents().find('body').contents(':not(.portion)');
    
    //preserve current styling for the new div

    var currentStyling=[
        {command: 'bold', value: queryCommand('bold')},
        {command: 'italic', value: queryCommand('italic')},
        {command: 'underline', value: queryCommand('underline')},
        {command: 'strikeThrough', value: queryCommand('strikeThrough')},
        {command: 'subscript', value: queryCommand('subscript')},
        {command: 'superscript', value: queryCommand('superscript')},
        {command: 'insertOrderList', value: queryCommand('insertOrderedList')},
        {command: 'insertUnorderedList', value:  queryCommand('insertUnorderedList')},
        {command: 'justifyLeft', value: queryCommand('justifyLeft')},
        {command: 'justifyRight', value: queryCommand('justifyRight')},
        {command: 'justifyCenter', value: queryCommand('justifyCenter')},
        {command: 'justifyFull', value: queryCommand('justifyFull')},
        {command: 'fontName', value: queryCommandValue('fontName')},
        {command: 'fontSize', value: queryCommandValue('fontSize')}
    ];
    
    newThought.wrap('<div class="portion" id="' + newId + '"></div');
    
    //redo the previous styling
    var i;
    for(i=0; i<currentStyling.length; i++)
    {
        var curr=currentStyling[i];
        var command=curr.command;
        var state=curr.value;
        if(command=='fontName' || command=='fontSize')
        {
            doc.execCommand(command,false, state);    
        }
        else if(state)
        {
            doc.execCommand(command,false, null);
        }
        
    }
    
    editor.focus();
                            
    moveCursorToEnd();
    
}); 

function moveCursorToEnd() {
    var doc = editor.document;
    if (editor.getSelection && doc.createRange) {
        var sel = editor.getSelection();
        var range = doc.createRange();
        range.selectNodeContents(doc.body);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (doc.selection && doc.body.createTextRange) {
        var textRange = doc.body.createTextRange();
        textRange.collapse(false);
        textRange.select();
    }
}
