// Initialize firebase
var firebaseConfig = {
    apiKey: "AIzaSyBcBoxNSCdX-KcNu74DoytgQjLz4F5mu-Y",
    authDomain: "student-community-fbd93.firebaseapp.com",
    projectId: "student-community-fbd93",
    storageBucket: "student-community-fbd93.appspot.com",
    messagingSenderId: "835723727776",
    appId: "1:835723727776:web:6aa7c3bb28c8bb685ecac5"
};
firebase.initializeApp(firebaseConfig);

// onAuthStateChanged will be called when the authentication state changes
// that is when the user is logged in
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    document.getElementById("user_div").style.display = "block";
    // get the currentUser who is logged in
    var user = firebase.auth().currentUser;
    // if user is present
    if(user != null){
      // set email
      var email_id = user.email;
      // redirect to the homepage
      window.location.href = "home.html";
    }
  }
});

function signup(){
  // get the email
  userEmail = document.getElementById("email_field").value;
  // get the password
  userPass = document.getElementById("password_field").value;
  // get the confirm password value
  userConfirmPass = document.getElementById("confirm_password_field").value;
  // if first and second passwords match
  if (userPass === userConfirmPass) {
    // create a user with the given email and password
  	firebase.auth().createUserWithEmailAndPassword(userEmail, userPass).then(cred => {
      // then signout so that we can redirect back to login page
      firebase.auth().signOut();
      alert('User signed up!');
      window.location.href = "index.html";
  });
  } else {
    // if password and confirm password values don't match then empty those fields
  	document.getElementById("password_field").value = "";
  	document.getElementById("confirm_password_field").value = "";
  	alert('Passwords do not match!');
  }
}

function login(){
  // get the email
  userEmail = document.getElementById("email_field").value;
  // get the password
  userPass = document.getElementById("password_field").value;
  // pass them to firebase so that we can login
  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
    // Handle Errors here.
    // if there is any error like user does not exist then we will catch and display it here
    var errorCode = error.code;
    var errorMessage = error.message;
    window.alert("Error : " + errorMessage);
  });
}

function logout(){
  // signout of the session from firebase
  firebase.auth().signOut();
  // redirect back to the login page
  window.location.href = "index.html";
}