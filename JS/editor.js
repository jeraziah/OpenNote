    var editor=document.getElementById("editor");

    //Specify commandNames for the buttons
     $('#bold').data('commandName', 'bold');
     $('#italic').data('commandName', 'italic');
     $('#underline').data('commandName', 'underline');
     $('#strikeThrough').data('commandName', 'strikeThrough');
     $('#subscript').data('commandName', 'subscript');
     $('#superscript').data('commandName', 'superscript');
     $('#insertOrderedList').data('commandName', 'insertOrderedList');
     $('#insertUnorderedList').data('commandName', 'insertUnorderedList');
     $('#outdent').data('commandName', 'outdent');
     $('#indent').data('commandName', 'indent');
     $('#justifyLeft').data('commandName', 'justifyLeft');
     $('#justifyCenter').data('commandName', 'justifyCenter');
     $('#justifyRight').data('commandName', 'justifyRight');
     $('#justifyFull').data('commandName', 'justifyFull');
     $('#removeFormatting').data('commandName', 'removeFormat');
     $('#undo').data('commandName', 'undo');
     $('#redo').data('commandName', 'redo');
     $('#fontName').data('commandName', 'fontName');
     $('#fontSize').data('commandName', 'fontSize');
     $('#image').data('commandName', 'insertImage');
     $('#horizontalRule').data('commandName', 'insertHorizontalRule');
     $('#link').data('commandName', 'createLink');
     $('#unlink').data('commandName', 'unlink');
     $('#image').data('prompt','Please enter the image url.');
     $('#link').data('prompt','Please enter the url');


//     var fontNameRef = rootFBRef.child("fontName");
//
//    //Fill the font name dropdown
//    fontNameRef.on("value",function(fontsObject){
//         var list=$('#fontName');
//         var fonts=fontsObject.val();
//         $.each(fonts, function() {
//             list.append($('<option />').val(this).text(this));
//         });           
//                     
//     });

    if (document.addEventListener) {
        editor.addEventListener("keyup", handleIframeKeyPress, false);
         editor.addEventListener("click", handleIframeCursorMove, false);
    } else if (document.attachEvent) {
        editor.attachEvent("onkeyup", handleIframeKeyPress);
        editor.attachEvent("onclick", handleIframeCursorMove);
    } else {
        editor.onkeyup = handleIframeKeyPress;
        editor.onclick=handleIframeCursorMove;
    }
    
    $('.editor-toolbar-item').on('click change',function(){
        
        var value=this.value || '';
        if($(this).data('prompt'))
        {
            value=prompt($(this).data('prompt'),'http://');
        }
        document.execCommand($(this).data('commandName'),false, value); 
    
        if($(this).hasClass('radio'))
        {
            if($(this).hasClass('active'))
            {
                if($(this).hasClass('toggle'))
                {
                    $(this).removeClass('active')
                }
            }
            else{
                $(this).addClass('active');   
                $(this).siblings().removeClass('active');
            }
        }
        else if($(this).hasClass('toggle'))
        {
            $(this).toggleClass('active');  
        }
          
    });



function handleIframeKeyPress(e) {
    e = e || iframe.contentWindow.event;
    var code = e.keyCode || e.which;
    if(code==33 || code==34 || code==37 || code==38 || code==39 || code==40){
           handleIframeCursorMove();
        }
}

function handleIframeCursorMove(){
     queryCommand('bold');
     queryCommand('italic');
     queryCommand('underline');
     queryCommand('strikeThrough');
     queryCommand('subscript');
     queryCommand('superscript');
     queryCommand('insertOrderedList');
     queryCommand('insertUnorderedList');
     queryCommand('justifyLeft');
     queryCommand('justifyRight');
     queryCommand('justifyCenter');
     queryCommand('justifyFull');
     queryCommandValue('fontName');
     queryCommandValue('fontSize');
}

function queryCommand(commandName){
    var state=document.queryCommandState(commandName);
    btn='#'+commandName;
    if(state)
    {
        $(btn).addClass('active');
    }
    else
    {
        $(btn).removeClass('active');
    }
    
    return state;
}

function queryCommandValue(commandName)
{
    var value=document.queryCommandValue(commandName);
    strippedValue=value;
    if(value.search(/['"]*['"]/)>-1){
        strippedValue=value.substring(1,value.length-1);
    }
    btn='#'+commandName;
    $(btn).val(strippedValue);
    
    return strippedValue;
}

 //Set default font and size
$( document ).ready(function() {
//    document.execCommand('fontName',false,'Arial');
//    document.execCommand('fontSize',false,'3');
//    queryCommandValue('fontName');
//    queryCommandValue('fontSize');
      editor.focus();
});


