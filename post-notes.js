//variables to grab the thoughts and display them
	var currentThought = document.getElementById('currentThought'),
		txtNewThought = document.getElementById('txtNewThought'),
		btUpdateNotes = document.getElementById('btUpdateNotes'),
		
		//creates a conection to firebase
		rootRef = new Firebase('https://opennote.firebaseio.com'),
		
		//sets the current message to the child of the root
		currentThoughtRef = rootRef.child('currentThought'),
		
		//lastLocation = currentThoughtRef.push(),
		
		//used to store the last input text
		outputString = '';

		//information regarding the program. just gets saved to the back end
		rootRef.push({
			title: "OpenNote",
			author: "Group: R17",
			location: {
				city: "Ames",
				State: "Iowa",
				Organization: "Iowa State University"
			}
		});

		//updates the firebase when button is clicked
		btUpdateNotes.addEventListener('click', function() {
			currentThoughtRef.push(txtNewThought.value);
			currentThoughtRef.set(txtNewThought.value);
			txtNewThought.value = '';
		});		

		currentThoughtRef.on('value', function(snapshot) {
        	currentThought.innerText = snapshot.val();
        	var newThought = shapshot.val();
		});		
