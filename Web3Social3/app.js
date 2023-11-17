// app.js

// Initialize MetaMask
function initMetaMask() {
  if (typeof window.ethereum === 'undefined') {
    alert('MetaMask is not installed. Please install it and try again.');
    return false;
  }
  return true;
}

// Function to handle MetaMask login
function loginWithMetaMask() {
  if (!initMetaMask()) {
    return;
  }

  // Request MetaMask login
  ethereum
    .request({ method: 'eth_requestAccounts' })
    .then((accounts) => {
      const address = accounts[0];
      const name = $('#name').val();

      if (!name) {
        alert('Please enter your name.');
        return;
      }

      // Check if the user is registered
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
      const isUserRegistered = registeredUsers.some((user) => user.name === name);

      if (!isUserRegistered) {
        alert('User with this name is not registered. Please register first.');
        return;
      }

      // Save user data in localStorage
      localStorage.setItem('loggedInUser', JSON.stringify({ name, address }));
      displayLoggedInUser(name);
      $('#login').hide();
      $('#tweet-form').show();
    })
    .catch((err) => {
      console.error(err);
      alert('MetaMask login failed.');
    });
}

// Function to check MetaMask installation
function checkMetaMaskInstallation() {
  if (typeof window.ethereum === 'undefined') {
    alert('MetaMask is not installed. Please install it and try again.');
    return false;
  }
  return true;
}

// Function to handle user registration
function registerUser() {
  const registerName = $('#registerName').val();

  if (!registerName) {
    alert('Please enter your name to register.');
    return;
  }

  // Check if the user is already registered
  const existingUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
  const isUserRegistered = existingUsers.some((user) => user.name === registerName);

  if (isUserRegistered) {
    alert('User with this name is already registered. Please choose a different name.');
    return;
  }

  // Store the registered user in local storage
  existingUsers.push({ name: registerName });
  localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

  // Redirect to login with MetaMask after registration
  loginWithMetaMask();
}

// Function to send a tweet
function sendTweet() {
  const tweetText = $('#tweet-input').val();
  const userData = JSON.parse(localStorage.getItem('loggedInUser'));

  if (!tweetText) {
    alert('Please enter a tweet.');
    return;
  }

  const tweet = {
    text: tweetText,
    author: userData.name,
    address: userData.address,
    timestamp: new Date().toLocaleString(),
  };

  const existingTweets = JSON.parse(localStorage.getItem('tweets')) || [];
  existingTweets.push(tweet);

  // Save updated tweets in localStorage
  localStorage.setItem('tweets', JSON.stringify(existingTweets));

  displayTweets();
}

// Function to display tweets
function displayTweets() {
  const tweetsElement = $('#tweets');
  tweetsElement.empty();

  const existingTweets = JSON.parse(localStorage.getItem('tweets')) || [];

  existingTweets.forEach((tweet) => {
    const tweetElement = document.createElement('div');
    tweetElement.className = 'tweet';
    tweetElement.innerHTML = `<strong>${tweet.author}</strong> (${tweet.address}): ${tweet.text} - ${tweet.timestamp}`;
    tweetsElement.append(tweetElement);
  });
}

// Function to display logged-in user and friends
function displayLoggedInUser(name, displayFriendsList = false) {
  const userElement = $('#logged-in-user');
  const friendsListElement = $('#friends-list');
  const userData = JSON.parse(localStorage.getItem('loggedInUser'));

  userElement.html(`Logged in as: ${userData.name} (${userData.address})`);

  if (displayFriendsList) {
    // Retrieve friends list from local storage
    const friends = JSON.parse(localStorage.getItem('friendsList')) || [];
    
    // Update friends list in user data to ensure it's always in sync
    userData.friends = friends;

    // Display friends list
    friendsListElement.empty();
    friends.forEach((friend) => {
      const friendItem = document.createElement('li');
      friendItem.textContent = friend;
      friendsListElement.append(friendItem);
    });
  }
}
// Function to add friends
function addFriend() {
  const friendName = prompt('Enter the name of the friend you want to add:');

  if (!friendName) {
    return;
  }

  const userData = JSON.parse(localStorage.getItem('loggedInUser'));
  const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

  // Check if the friend is a registered user
  const isFriendRegistered = registeredUsers.some((user) => user.name === friendName);

  if (!isFriendRegistered) {
    alert('Friend with this name is not registered. Please enter a valid friend name.');
    return;
  }

  userData.friends = userData.friends || [];

  // Check if the friend is already added
  if (userData.friends.includes(friendName)) {
    alert('Friend is already added.');
    return;
  }

  // Update and save the friends list in local storage
  const updatedFriendsList = [...userData.friends, friendName];
  localStorage.setItem('loggedInUser', JSON.stringify(userData));
  localStorage.setItem('friendsList', JSON.stringify(updatedFriendsList));

  // Display updated friends list
  displayLoggedInUser(userData.name, true);
}

// Function to initialize the app
function initApp() {
  // Check MetaMask installation
  if (!checkMetaMaskInstallation()) {
    return;
  }

  // Display initial UI with login and register forms
  $('#login').show();
  $('#register').show();
  $('#tweet-form').hide();

  // Add event listener for the login button
  $('#login-button').on('click', function() {
    // Request MetaMask login
    ethereum
      .request({ method: 'eth_requestAccounts' })
      .then(() => {
        // For demonstration purposes, hide the login and register forms
        $('#login').hide();
        $('#register').hide();

        // Show the tweet form
        $('#tweet-form').show();
      })
      .catch((err) => {
        console.error(err);
        alert('MetaMask login failed.');
      });
  });
}

// Run the app initialization when the document is ready
$(document).ready(() => {
  // Initialize the app
  initApp();
});
