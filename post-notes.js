	var currentThought = document.getElementById('currentThought'),
		txtNewThought = document.getElementById('txtNewThought'),
		btUpdateNotes = document.getElementById('btUpdateNotes'),
		//variables to grab the thoughts and display them
		rootRef = new Firebase('https://opennote.firebaseio.com'),
		//creates a conection to firebase
		currentThoughtRef = rootRef.child('currentThought');

		rootRef.push({
			title: "OpenNote",
			author: "Group: R17",
			location: {
				city: "Ames",
				State: "Iowa",
				Organization: "Iowa State University"
			}
		});

		btUpdateNotes.addEventListener('click', function() {

			currentThoughtRef.push(txtNewThought.value);
			txtNewThought.value = '';

		});		
		//updates the firebase when button is clicked

		currentThoughtRef.on('value', function(snapshot) {

			currentThought.innerText = snapshot.val();
		});		
		//whenever the value changes a new snapshot is displayed