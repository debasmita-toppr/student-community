// Firebase Database Reference and the child
const dbRef = firebase.database().ref();
const usersRef = dbRef.child('users');
readPostData(); 
function readPostData() {
	// get the database reference
	const dbRef = firebase.database().ref();
	// get the users and order all the posts inside it by the number of post_likes
	const usersRef = dbRef.child('users').orderByChild("post_likes");
	const postListUI = document.getElementById("post-list");
	// for each post value
	usersRef.on("value", snap => {
		postListUI.innerHTML = ""
		// childsnap is the data of the child
		// that is for each posts there are childs of posts like post_answers, post_likes
		snap.forEach(childSnap => {
			// get the key and value
			let key = childSnap.key,
				value = childSnap.val()
				// if user is not authenticated i.e user has not logged-in
				// then user is null
				// if user is null
				if (firebase.auth().currentUser === null) {
            		// redirect back to the login page
                	window.location.href = "index.html";
            	} else {
            		// if user is not null then display the home-page by changing the visibility of homepage to visible
            		// as we have set the homepage visibility to hidden in our styles.css
            		// we do this so that even if we have a lag in the internet and someone is able to view the homepage 
            		// then they will not be able to see it as the visibility is initially set to hidden
            		document.getElementById("homepage-container").style.visibility = "visible";
            	}
            
			let $li = document.createElement("li");
			$li.setAttribute("class", "card home-card border-secondary pt-2 pl-4 pr-4");
			// edit icon
			let editIconUI = document.createElement("span");
			editIconUI.class = "edit-post";
			editIconUI.innerHTML = " ✎";
			editIconUI.setAttribute("userid", key);
			editIconUI.addEventListener("click", editButtonClicked)
			// delete icon
			let deleteIconUI = document.createElement("span");
			deleteIconUI.class = "delete-post";
			deleteIconUI.innerHTML = " ☓";
			deleteIconUI.setAttribute("userid", key);
			deleteIconUI.addEventListener("click", deleteButtonClicked)
			// comment icon
			let commentIconUI = document.createElement("span");
			commentIconUI.class = "edit-post";
			commentIconUI.innerHTML = " +";
			commentIconUI.setAttribute("userid", key);
			commentIconUI.addEventListener("click", addCommentsButtonClicked)
			// like icon
			let likeIconUI = document.createElement("span");
			likeIconUI.class = "like-post";
			likeIconUI.innerHTML = `&#10084;`;
			likeIconUI.setAttribute("userid", key);
			likeIconUI.setAttribute("id", "like-btn");
			likeIconUI.addEventListener("click", like);

			getPostAnswersArray = value.post_answers;
			// if post_likes are undefined, then we will assign them to 0
			if(value.post_likes === undefined){
				value.post_likes = 0;
			}
			// if there are comments present in the firebase database for that post
			if(getPostAnswersArray != undefined){
				$li.innerHTML = `
			<p id="post_title">${value.post_title}
			<span id="post_date"><small>on ${value.post_date}</small></span>
			<span id="post_author">
			<small class="post_author">${value.post_author}</small>
			</span>
			</p>
			<hr>
			<p id="post_content">${value.post_content}</p>
			<hr>
			<p id="comments">Comments<span id="num_likes"><small>${value.post_likes} likes</small></span></p>
			`;
			// then create an <li> to display all the answers
			let $li2 = document.createElement("li");
			// run the loop in reverse so that new comments/answers append at the beginning
			for(i=getPostAnswersArray.length-1; i>=0; i--){
				$li.innerHTML += `<small>${getPostAnswersArray[i]}</small><br />`
				// if comment/answer is the last then put a hr
				if (i == 0) {
					$li.innerHTML += `<hr>`;
				}
			}
			}
			// else if the getPostAnswersArray is undefined
			// that is no comments exist for that post in firebase, then dont add the answers array at the ending 
			else {
				$li.innerHTML = `
			<p id="post_title">${value.post_title}
			<span id="post_date"><small>on ${value.post_date}</small></span>
			<span id="post_author">
			<small class="post_author">${value.post_author}</small>
			</span>
			</p>
			<hr>
			<p id="post_content">${value.post_content}</p>
			<hr>
			<p id="comments">Comments<span id="num_likes"><small>${value.post_likes} likes</small></span></p>
			`;
			}
			// get the post author
			var author = value.post_author;
			// get the current author that is the current signed in User
			var current_author = firebase.auth().currentUser.email;
			// append likeIcon and commentIcon to our list
			$li.append(likeIconUI);
			$li.append(commentIconUI);
			// for posts created by the logged in user, display edit post and delete post icons
			if (author === current_author){
				$li.append(editIconUI);
				$li.append(deleteIconUI);
			}
			// set attribute user-key equal to the key of the post for the li element
			$li.setAttribute("user-key", key);
			// we use prepend instead of append so that if the post likes are same then the newer post appears on top
			postListUI.prepend($li);
			document.getElementById("welcome").innerText = `Welcome ${firebase.auth().currentUser.email}!`;
 		});
	})
}

// when add-post-btn is clicked
const addPostBtnUI = document.getElementById("add-post-btn");
addPostBtnUI.addEventListener("click", addPostBtnClicked);

function addPostBtnClicked() {
	const usersRef = dbRef.child('users');
	// get all elements having class post-input
	const addPostInputsUI = document.getElementsByClassName("post-input");
	// date object for getting the date on which the post was created
	var d = new Date();
	// toDateString() converts the date (not the time) of a Date object into a readable string
	currentDate = d.toDateString();
 	// push values to firebase
	usersRef.push({
		// addPostInputsUI[0] is the first element which has class post-input and value is the post_title entered
		// addPostInputsUI[1] is the second element which has class post-input and value is the post_content entered
		post_title: addPostInputsUI[0].value,
		post_content: addPostInputsUI[1].value,
		// the author of the post will be the current user
		post_author: firebase.auth().currentUser.email,
		post_date: currentDate
	});
	document.getElementById("post_status").innerText = "Post Created!";
	// make the post title and post content fields empty after Post is Created
	addPostInputsUI[0].value = "";
	addPostInputsUI[1].value = "";
}
