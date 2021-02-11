// when edit icon is clicked
function editButtonClicked(e) {
	// display the edit post block
	document.getElementById('edit-post-module').style.display = "block";
	//set user id to the hidden input field
	document.querySelector(".edit-postid").value = e.target.getAttribute("userid");
	const userRef = dbRef.child('users/' + e.target.getAttribute("userid"));
	// set data to the user field
	// this will prepoulate the edit textbox with the previous post content and post title 
	const editPostInputsUI = document.querySelectorAll(".edit-post-input");
	userRef.on("value", snap => {
		for(var i = 0, len = editPostInputsUI.length; i < len; i++) {
			// key is the value of attribute data-key which is post_title and post_content
			var key = editPostInputsUI[i].getAttribute("data-key");
					// value will be the post_title value and post_content value we retrieve from firebase
					editPostInputsUI[i].value = snap.val()[key];
		}
	});
	// to save the edits
	const saveBtn = document.querySelector("#edit-post-btn");
	// add an on click function
	saveBtn.addEventListener("click", savePostBtnClicked)
}

function savePostBtnClicked(e) {
	const userID = document.querySelector(".edit-postid").value;
	const userRef = dbRef.child('users/' + userID);
	var editedPostObject = {}
	// select all elements with class edit-post-input
	const editPostInputsUI = document.querySelectorAll(".edit-post-input");
	editPostInputsUI.forEach(function(textField) {
		// key is the data-key of the textField you type the content to be edited
		let key = textField.getAttribute("data-key");
		// and its value
		let value = textField.value;
		// set the key value pair to the object
  		editedPostObject[textField.getAttribute("data-key")] = textField.value
	});
	// update the firebase with the new object
	userRef.update(editedPostObject);
	// hide the edit block
	document.getElementById('edit-post-module').style.display = "none";
}

// when delete icon is clicked
function deleteButtonClicked(e) {
		// stop propagation that is stop/prevent any other activity like editing our post from happening
		e.stopPropagation();
		var userID = e.target.getAttribute("userid");
		const userRef = dbRef.child('users/' + userID);
		// remove the post
 		userRef.remove();
}