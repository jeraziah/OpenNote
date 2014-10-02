var myRef = new Firebase("https://shaun314.firebaseio.com/");

var currentUser = undefined;

var authClient = new FirebaseSimpleLogin(myRef, function(error, user) {
  if (error) {
    // an error occurred while attempting login
    console.log(error);
  } else if (user) {
    // user authenticated with Firebase
    console.log("User ID: " + user.uid + ", Provider: " + user.provider);
    currentUser = user;
  } else {
    // user is logged out
  }
});