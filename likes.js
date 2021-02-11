var user_key;
var user_keyArr = [];
var prelikes;

// on click like icon
function like(e){
	// set user id to the hidden input field
	document.querySelector(".like-postid").value = e.target.getAttribute("userid");
	// get the post id 
	user_key = e.target.getAttribute("userid");
	// push it into the array
	user_keyArr.push(user_key);
	// set it into localstorage as user_keyArr_loc
	localStorage.setItem("user_keyArr_loc", JSON.stringify(user_keyArr));
	// turn the like icon  which was clicked to red by passing the posts id
	document.querySelector(`[userid="${user_key}"]`).innerHTML = `<i class="fa fa-heart" id="heart" style="color: red"></i>`;
	// get all the childs of the posts
	const userRef = dbRef.child('users/' + e.target.getAttribute("userid"));

	userRef.on("value", snap => {
		
			var key = "post_likes";
			// get the value of the post_likes from the key
			prelikes = snap.val()[key];
	});		
	var likeListObject = {}
	usersRef.on("value", snap => {
		snap.forEach(childSnap => {
			// if likes in firebase is undefined that means likes are 0 so do 0+1
				let key = childSnap.key,
				value = childSnap.val()
				likeListObject.post_likes = value.post_likes
		});
	});
		// update firebase with the new likes
		// if likes is 0 then in firebase it is stored as NaN
		if (isNaN(likeListObject.post_likes)) {
					// so when the like button with 0 likes is clicked it will change to 1
					likeListObject.post_likes = 1
				} else {
					// else the previous likes + 1
					likeListObject.post_likes = prelikes+ 1;
				}

	userRef.update(likeListObject);
	// get the amount of likes
	var user_keyArr_likes = JSON.parse(localStorage.getItem("user_keyArr_loc"));
	// loop through the likes for displaying likes of each post
	for(i=0; i<=user_keyArr.length-1; i++){
		// again get the likes by passing the user id/ post id from localstorage to a variable userid
		// as we have set userid attribute to the like icon
		// so here to keep the post liked even after liking other posts we do this
		document.querySelector(`[userid="${user_keyArr_likes[i]}"]`).innerHTML = `<i class="fa fa-heart" id="heart" style="color: red"></i>`;
	}
}