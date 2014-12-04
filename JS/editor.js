    var editor=document.getElementById("editor");
    var focusedElem= null;

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

    $('#editor').focus(function(){
        focusedElem=$(this);
    });

    $('#editor').keyup(function(e){
        handleEditorKeyPress(e);
    });

    $('#editor').click(function(){
        handleEditorCursorMove();
    });

    //reset the focusedElem when we stop editing notes
    $('* :not(.dont_lose_focus):not(.dont_lose_focus *)').mousedown(function(){
       focusedElem=null;
        //reset the toolbar buttons
         $('#bold').removeClass('active');
         $('#italic').removeClass('active');
         $('#underline').removeClass('active');
         $('#strikeThrough').removeClass('active');
         $('#subscript').removeClass('active');
         $('#superscript').removeClass('active');
         $('#insertOrderedList').removeClass('active');
         $('#insertUnorderedList').removeClass('active');
         $('#justifyLeft').addClass('active');
         $('#justifyCenter').removeClass('active');
         $('#justifyRight').removeClass('active');
         $('#justifyFull').removeClass('active');
         $('#selected_fontSize').html('2<span class="caret"></span>');
         $('#selected_fontName').html('Arial<span class="caret"></span>');
    });

    $('button.editor-toolbar-item').on('mousedown',function(e)
    {
       e.preventDefault();
       e.stopPropagation();
    });

    $('div.editor-toolbar-item, #editor').on('mousedown',function(e)
    {
       e.stopPropagation();
    });

    $('button.editor-toolbar-item').on('click', function(){
        handleToolbarClick(this,'');
    });

    $('.editor-toolbar-item li').on('click', function(){
        handleToolbarClick($(this).parent(),$(this).text());   
        
        focusedElem.focus();
    });

function handleToolbarClick(elem,value){ 
        if(focusedElem==null)
        {
            focusedElem=editor;
            $('#editor').focus();
            handleEditorCursorMove();
        }
        var commandName=$(elem).data('commandName');
    
        document.execCommand(commandName,false, value); 
        
//necessary to fix stupid superscript subscript toggling bug
//        if(commandName==='superscript' || commandName==='subscript')
//        {
//            if($(elem).hasClass('active'))
//                {
//                    if(document.queryCommandState(commandName))
//                    {
//                        document.execCommand(commandName,false, value); 
//                    }
//                }
//        }
        
        if($(elem).hasClass('radio'))
        {
            if($(elem).hasClass('active'))
            {
                if($(elem).hasClass('toggle'))
                {
                    $(elem).removeClass('active')
                }
            }
            else{
                $(elem).addClass('active');   
                $(elem).siblings().removeClass('active');
            }
        }
        else if($(elem).hasClass('toggle'))
        {
            $(elem).toggleClass('active');  
        }
        
        if(value!=='')
        {
             var btn='#selected_'+commandName;
             $(btn).html(value+'<span class="caret"></span>');
        }
}

function handleEditorKeyPress(e) {
    var code = e.keyCode || e.which;
    if(code==33 || code==34 || code==37 || code==38 || code==39 || code==40){
           handleEditorCursorMove();
        }
}

function handleEditorCursorMove(){
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
    btn='#selected_'+commandName;
    $(btn).html(strippedValue+'<span class="caret"></span>');
    
    return strippedValue;
}

//Set default font and size
//Add this to the function that shows the editor box?
$(window).load(function() {
    $('#editor').focus();
    document.execCommand('fontName',false,'Arial');
    document.execCommand('fontSize',false,'3');     
});


