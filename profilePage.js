// to view all the posts created by the user
// when view my posts is clicked
function viewYourPosts(){
	// Firebase Database Reference and the child
	const dbRef = firebase.database().ref();
	const usersRef = dbRef.child('users');
	// get the profile-list div to display all posts created by the current User
	const postListUI = document.getElementById("profile-list");
	usersRef.on("value", snap => {
		postListUI.innerHTML = ""
		// childsnap is the data of the child
		// that is for each posts there are childs of posts like post_answers, post_likes
		snap.forEach(childSnap => {
			// get the key and value
			let key = childSnap.key,
				value = childSnap.val()
			// create a new list item for each post
			let $li = document.createElement("li");
			$li.setAttribute("class", "card main-card border-secondary pt-2 pl-4 pr-4");
			var author = value.post_author;
			// get the current User
			var current_author = firebase.auth().currentUser.email;
			// if author of the post is equal to the current user then display the post
			if (author === current_author){
				$li.innerHTML = `
			<p id="post_title">${value.post_title}
			<span id="post_date"><small>on ${value.post_date}</small></span>
			<span id="post_author">
			<small class="post_author">${value.post_author}</small>
			</span>
			</p>
			<hr>
			<p id="post_content">${value.post_content}</p>`;
			// set attribute user-key to the key from firebase which will be the post id
			$li.setAttribute("user-key", key);
			// prepend so new posts are on top
			postListUI.prepend($li);
			}
 		});
	})
}
