const steamUser = require("steam-user");
const keep_alive = require("./keep_alive.js");

var username = process.env.username;
var password = process.env.password;

var games = [
    10, 20, 30, 40, 50, 60, 70, 130, 22380, 39500, 39510, 489830, 109600, 2100, 65540, 704450, 950670
]; // Enter here AppIDs of the needed games
var status = 1; // 1 - online, 7 - invisible

user = new steamUser();

user.on("steamGuard", (domain, callback) => {
	console.log("Steam Guard code sent to your email");

	const prompt = require("prompt-sync")();
	const code = prompt("Enter the Steam Guard code sent to your email: ");

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
