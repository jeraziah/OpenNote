        var iFrame= document.getElementById('editor-iFrame');
    var editor = iFrame.contentWindow;
    var doc = editor.document;
    editor.document.designMode='on';
    editor.focus();
    
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

     var fontNameRef = rootFBRef.child("fontName");

    //Fill the font name dropdown
    fontNameRef.on("value",function(fontsObject){
         var list=$('#fontName');
         var fonts=fontsObject.val();
         $.each(fonts, function() {
             list.append($('<option />').val(this).text(this));
         });           
                     
     });

 //Set default font and size
     editor.document.execCommand('fontName',false,'Arial');
     editor.document.execCommand('fontSize',false,'3');
     queryCommandValue('fontName');
     queryCommandValue('fontSize');


    if (doc.addEventListener) {
        doc.addEventListener("keyup", handleIframeKeyPress, false);
          doc.addEventListener("click", handleIframeCursorMove, false);
    } else if (doc.attachEvent) {
        doc.attachEvent("onkeyup", handleIframeKeyPress);
        doc.addEvent("onclick", handleIframeCursorMove);
    } else {
        doc.onkeyup = handleIframeKeyPress;
        doc.onclick=handleIframeCursorMove;
    }
    
    $('.btn.editor-toolbar-item').mouseover(function(){
        if(!($(this).hasClass('active'))){   
            $(this).addClass('moused');
        }
    });
    
    $('.btn.editor-toolbar-item').mouseout(function(){
        $(this).removeClass('moused');
    });
    
    $('.editor-toolbar-item').on('click change',function(){
         editor.focus();
        $(this).removeClass('moused');
        
        var value=this.value || '';
        if($(this).data('prompt'))
        {
            value=prompt($(this).data('prompt'));
        }
        editor.document.execCommand($(this).data('commandName'),false, value); 
        var testing=$(this).data('commandName');
    
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
        else if(editor.getSelection().toString() == "" && $(this).hasClass('toggle'))
        {
            $(this).toggleClass('active');  
        }
        
        editor.focus();   
    });

function handleIframeKeyPress(e) {
    e = e || iframe.contentWindow.event;
    var code = e.keyCode || e.which;
   if(code==13 || code==33 || code==34 || code==37 || code==38 || code==39 || code==40){
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
    var state=doc.queryCommandState(commandName);
    btn='#'+commandName;
    if(state)
    {
        $(btn).addClass('active');
    }
    else
    {
        $(btn).removeClass('active');
    }
}

function queryCommandValue(commandName)
{
    var value=doc.queryCommandValue(commandName);
    strippedValue=value;
    if(value.search(/['"]*['"]/)>-1){
        strippedValue=value.substring(1,value.length-1);
    }
    btn='#'+commandName;
    $(btn).val(strippedValue);
}