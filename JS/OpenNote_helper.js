function loadScript(url, callback) {
 
    var script = document.createElement("script")
    script.type = "text/javascript";

    if (script.readyState) { //IE
        script.onreadystatechange = function () {
            if (script.readyState == "loaded" || script.readyState == "complete") {
                script.onreadystatechange = null;
                callback();
            }
        };
    } else { //Others
        script.onload = function () {
            callback();
        };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

function loadNotes() {
    // create child_added ref for class notes to be read once
    console.log("Being Called");
    rootFBRef.child("users").child(currentUser.userId).child("classes").child(currentClass.userClassId).child("notes").on("child_added", function(snapshot) {
        console.log(snapshot.val()); 
    });
    
}