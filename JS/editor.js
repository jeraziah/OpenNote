var editor = document.getElementById('editor-iFrame').contentWindow;

$(document).ready(function(){
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
     $('#image').data('prompst','Please enter the image url.');
     $('#link').data('prompt','Please enter the url');
    
    $('.btn.editor-toolbar-item').mouseover(function(){
        if(!($(this).hasClass('active'))){   
            $(this).addClass('moused');
        }
    });
    
    $('.btn.editor-toolbar-item').mouseout(function(){
        $(this).removeClass('moused');
    });
    
    $('.editor-toolbar-item.btn').on('click change',function(){
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
        
        if(editor.getSelection().toString() != "")
        {
            $(this).removeClass('active');  
        }
        
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
    $('#editor-textarea').val($('#editor-iFrame').contents().find('body').html());
}