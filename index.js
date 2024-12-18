const steamUser = require("steam-user");
const keep_alive = require("./keep_alive.js");

var username = process.env.username;
var password = process.env.password;

var games = [
	10, 20, 30, 40, 50, 60, 70, 130, 440, 730, 22330, 22380, 33230, 238960, 48190,
	109600, 1085660, 1857950,
]; // Enter here AppIDs of the needed games
var status = 1; // 1 - online, 7 - invisible

user = new steamUser();

user.on("steamGuard", (domain, callback) => {
	console.log("Steam Guard code sent to your email");
	// Here, you can implement a manual input prompt for the user to input the email code.
	// For simplicity, this example will just log the message and wait for the user input
	// You can replace this part with a more automated system if desired.

	// Prompt the user to enter the Steam Guard code received in their Gmail.
	// This can be a manual process or fully automated (though automating Gmail access is more complex).

	const prompt = require("prompt-sync")();
	const code = prompt("Enter the Steam Guard code sent to your email: ");

	// Call the callback to submit the code received via email
	callback(code);
});

user.on("loggedOn", () => {
	if (user.steamID != null) {
		console.log(user.steamID + " - Successfully logged on");
	}
	user.setPersona(status);
	user.gamesPlayed(games);
});

user.logOn({
	accountName: username,
	password: password,
});

keep_alive.js;

var http = require("http");

http
	.createServer(function (req, res) {
		res.write("I'm alive");
		res.end();
	})
	.listen(8081);
