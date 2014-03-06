window.fbAsyncInit = function() {
	FB.init({
		appId      : '825013770847053',
		status     : true, // check login status
		cookie     : true, // enable cookies to allow the server to access the session
		xfbml      : true  // parse XFBML
	});

	FB.getLoginStatus(function(response) {
		if(response.status === 'connected') {
			//connected
		}
		else if(response.status == 'not_authorized' || response.status == 'unknown') {
			renderLogin();
		}
	});

	FB.Event.subscribe('auth.authResponseChange', function(response) {
		if (response.status === 'connected') {
			console.log('Login status: app connected to Facebook');
			renderApp();
		} else if (response.status === 'not_authorized') {
			console.log('Login status: user logged in but app not authorized; proceeding to ask for permission');
			renderLogin();
		} else {
			console.log('Login status: user logged out. Login button is visible.');
			renderLogin();
		}
	});
};

// Load the SDK asynchronously
(function(d){
	console.log('Loading Facebook SDK asynchronously');
	var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
	if (d.getElementById(id)) {return;}
	js = d.createElement('script'); js.id = id; js.async = true;
	js.src = "//connect.facebook.net/en_US/all.js";
	ref.parentNode.insertBefore(js, ref);
}(document));

function renderLogin() {
	console.log('renderLogin was called');
	$('body').removeClass('app_page');
	$('body').addClass('login_page');

	var loginButton = document.createElement('button');
	loginButton.setAttribute('id', 'loggerButton');
	loginButton.setAttribute('onclick', 'loginToApp()');
	loginButton.innerHTML = 'Login to Facebook';

	$('#container').append(loginButton);
}

function renderApp() {
	console.log('renderApp was called');

	//Replacing Login Page Artefacts
	$('body').removeClass('login_page');
	$('body').addClass('app_page');

	$('#loggerButton').remove();

	//Initializing App Page
	var profilePicture = document.createElement('img');
	$('#container').append(profilePicture);

	FB.api('/me/picture?type=large', function(response) {
		var pictureURL = response.data.url;
		profilePicture.setAttribute('src', pictureURL);
	});

	var nameDiv = document.createElement('div');
	nameDiv.setAttribute('id', 'name');
	$('#container').append(nameDiv);

	FB.api('/me', function(response) {
		nameDiv.innerHTML = 'Hello, ' + response.name;
	})

	var statusBox = document.createElement('input');
	statusBox.setAttribute('type', 'text');
	statusBox.setAttribute('name', 'statusUpdate');
	statusBox.setAttribute('id', 'statusUpdate');
	$('#container').append(statusBox);

	var postButton = document.createElement('button');
	postButton.setAttribute('id', 'postButton');
	postButton.setAttribute('onclick', 'postStatusUpdate()');
	postButton.innerHTML = 'Post';
	$('#container').append(postButton);

	var logoutButton = document.createElement('button');
	logoutButton.setAttribute('id', 'loggerButton');
	logoutButton.setAttribute('onclick', 'logoutOfApp()');
	logoutButton.innerHTML = 'Logout';
	$('#container').append(logoutButton);
}

function postStatusUpdate() {
	var body = document.getElementById('statusUpdate').value;
	FB.api('/me/feed', 'post', { message: body }, function(response) {
	  	if (!response || response.error) {
	    	console.log('Error occured');
	  	} else {
	  		console.log('Posted status update: ' + body);
	    	console.log('Post ID: ' + response.id);
	  	}
	});
}

function loginToApp() {
	FB.login(function(response) {
		if (response.authResponse) {
			// The person logged into your app
		} else {
			// The person cancelled the login dialog
			console.log('User cancelled connection.');
		}
	}, {scope: 'publish_actions'});
}

function logoutOfApp() {
	console.log('logoutOfApp was called');
	document.location.href = document.URL + 'logout.html';
}