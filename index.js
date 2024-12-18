const steamUser = require('steam-user');
const readline = require('readline');
const http = require('http');

var username = process.env.username;
var password = process.env.password;

var games = [10, 20, 30, 40, 50, 60, 70, 130, 440, 730, 22330, 22380, 33230, 238960, 48190, 109600, 1085660, 1857950];  // Enter here AppIDs of the needed games
var status = 1;  // 1 - online, 7 - invisible

user = new steamUser();

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

user.on('steamGuard', (domain, callback) => {
		console.log('Steam Guard code sent to your email');
		rl.question('Enter the Steam Guard code sent to your email: ', (code) => {
				callback(code);
				rl.close();
		});
});

user.on('loggedOn', () => {
		if (user.steamID != null) {
				console.log(user.steamID + ' - Successfully logged on');
		}
		user.setPersona(status);               
		user.gamesPlayed(games);
});

user.logOn({
		accountName: username,
		password: password
});

http.createServer(function (req, res) {
	res.write("I'm alive");
	res.end();
}).listen(80, () => {
	console.log("Keep alive server running on port 80");
});
