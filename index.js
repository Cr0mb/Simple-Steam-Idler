const steamUser = require('steam-user');
const steamTotp = require('steam-totp');
const readline = require('readline');  // Import readline for user input
const keep_alive = require('./keep_alive.js');

// Set up environment variables
var username = process.env.username;
var password = process.env.password;

var games = [10, 20, 30, 40, 50, 60, 70, 130, 440, 730, 22330, 22380, 33230, 238960, 48190, 109600, 1085660, 1857950];  // AppIDs of games
var status = 1;  // 1 - online, 7 - invisible

// Set up Steam client
user = new steamUser();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Log in to Steam
user.logOn({
  "accountName": username,
  "password": password
});

// Listen for the "steamGuard" event to ask for the Steam Guard code
user.on('steamGuard', (domain, callback) => {
  rl.question(`Please enter your Steam Guard code sent to ${domain}: `, (steamGuardCode) => {
    callback(steamGuardCode); // Provide the Steam Guard code to the callback
  });
});

// Listen for when the user is logged in
user.on('loggedOn', () => {
  if (user.steamID != null) {
    console.log(user.steamID + ' - Successfully logged on');
  }
  user.setPersona(status);               
  user.gamesPlayed(games);
});

// Handle errors (e.g., invalid credentials or wrong Steam Guard code)
user.on('error', (error) => {
  console.error('Error during login:', error);
  rl.close();
});

keep_alive.js

var http = require('http');

http.createServer(function (req, res) {
  res.write("I'm alive");
  res.end();
}).listen(8080);
