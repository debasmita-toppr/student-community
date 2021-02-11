var preComm;
// on click add comment button 
function addCommentsButtonClicked(e) {
	// display the answers box
	document.getElementById('comment-post-module').style.display = "block";
	//set user id to the hidden input field
	document.querySelector(".comment-postid").value = e.target.getAttribute("userid");
	//get the path which is users/ + the unique post id 
	const userRef = dbRef.child('users/' + e.target.getAttribute("userid"));
	// set data to the user field
	const commentPostInputsUI = document.querySelectorAll(".comment-post-input");
	// for all values in the userRef path
	userRef.on("value", snap => {
		for(var i = 0, len = commentPostInputsUI.length; i < len; i++) {
			// key is the data-key of the input field which will be post_answers
			var key = commentPostInputsUI[i].getAttribute("data-key");
					// empty the textfield
					commentPostInputsUI[i].value = "";
					// get all the previous comments from firebase for that post in preComm using the key
					preComm = snap.val()[key];
		}
	});
	// on Update button click
	const saveBtn = document.querySelector("#comment-post-btn");
	saveBtn.addEventListener("click", saveCommentBtnClicked)
}

function saveCommentBtnClicked(e) {
	// get the id of the post
	const userID = document.querySelector(".comment-postid").value;
	// get the path
	const userRef = dbRef.child('users/' + userID);
	var commentPostObject = {}
	// select the input
	const commentPostInputsUI = document.querySelectorAll(".comment-post-input");
	commentPostInputsUI.forEach(function(textField) {
		// get the data-key name
		let key = textField.getAttribute("data-key");
		// get the value of the answer entered in the textField
		let value = textField.value;
		// push the value in an array
		// if preComm is undefined that means there is no comment yet stored in firebase
		if(preComm === undefined){
			// so empty the array
			preComm = [];
		}
		// push the value entered into the text to the array
		preComm.push(value);
		// set key-value pair to the object
  		commentPostObject[textField.getAttribute("data-key")] = preComm;

	});
	// update firebase
	userRef.update(commentPostObject);
	// hide the answers box
	document.getElementById('comment-post-module').style.display = "none";
}
