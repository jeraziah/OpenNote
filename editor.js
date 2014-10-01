$(document).ready(function(){
    var editor = document.getElementById('editor-iFrame').contentWindow;
    editor.document.designMode='on';
    editor.focus();
    
    //Specify commandNames for the buttons
     $('#bold').data('commandName', 'bold');
     $('#italic').data('commandName', 'italic');
     $('#underline').data('commandName', 'underline');
     $('#strikethrough').data('commandName', 'strikeThrough');
     $('#subscript').data('commandName', 'subscript');
     $('#superscript').data('commandName', 'superscript');
     $('#ol').data('commandName', 'insertOrderedList');
     $('#ul').data('commandName', 'insertUnorderedList');
     $('#outdent').data('commandName', 'outdent');
     $('#indent').data('commandName', 'indent');
     $('#justifyLeft').data('commandName', 'justifyLeft');
     $('#justifyCenter').data('commandName', 'justifyCenter');
     $('#justifyRight').data('commandName', 'justifyRight');
     $('#justifyFull').data('commandName', 'justifyFull');
     $('#removeFormatting').data('commandName', 'removeFormat');
     $('#undo').data('commandName', 'undo');
     $('#redo').data('commandName', 'redo');
     $('#font').data('commandName', 'fontName');
     $('#fontSize').data('commandName', 'fontSize');
     $('#image').data('commandName', 'insertImage');
     $('#horizontalRule').data('commandName', 'insertHorizontalRule');
     $('#link').data('commandName', 'createLink');
     $('#unlink').data('commandName', 'unlink');
    
    $('.toggle').click(function(){  
        $(this).toggleClass('moused');
        $(this).toggleClass('selected');
    });
    
    $('.btn.editor-toolbar-item').mouseover(function(){
        if(!($(this).hasClass('selected'))){   
            $(this).toggleClass('moused');
        }
    });
    
    $('.btn.editor-toolbar-item').mouseout(function(){
       if(!($(this).hasClass('selected'))){
            $(this).toggleClass('moused');
        }
    });
    
    $('.editor-toolbar-item').on('click change',function(){
        editor.focus();
        editor.document.execCommand($(this).data("commandName"),false, $(this).val() || ""); 
        editor.focus();
    });
        
    $('#text').click(function(){
        $('#editor-iFrame').show();
        $('#editor-textarea').hide();
        $('.editor-toolbar').show();
        $('.btn-toolbar').show();
    });
       
    $('#html').click(function(){
        save();
        $('#editor-textarea').css('display','block');
        $('#editor-iFrame').hide();
        $('.btn-toolbar').hide();
    }); 
    
    $('#save').click(function(){
       save(); 
    });
    
});

function save(){
    $("#editor-textarea").val($("#editor-iFrame").contents().find("body").html());
}
