//variables to grab the thoughts and display them
  var currentThought = document.getElementById('currentThought'),
    txtNewThought = document.getElementById('editor-textarea'),
    btUpdateNotes = document.getElementById('btUpdateNotes'),
    
    //creates a conection to firebase
    rootRef = new Firebase('https://opennote.firebaseio.com'),
    
    //sets the current message to the child of the root
    currentThoughtRef = rootRef.child('currentThought'),
    

    
    //used to store the last input text
    outputString = '';

    //updates the firebase when button is clicked
    btUpdateNotes.addEventListener('click', function() {
      $("#editor-textarea").val($("#editor-iFrame").contents().find("body").html());
            currentThoughtRef.push(txtNewThought.value);
      currentThoughtRef.set(txtNewThought.value);
      txtNewThought.value = '';
    });   

    currentThoughtRef.on('value', function(snapshot) {
      currentThought.innerText = snapshot.val();
    });   

