const steamUser = require('steam-user');
const readline = require('readline');
const http = require('http');
const os = require('os');
const fs = require('fs');
const path = require('path');

const username = process.env.username;
const password = process.env.password;

if (!username || !password) {
    console.error("Error: Please set the 'username' and 'password' environment variables.");
    process.exit(1);
}

// Default games and status, can be overridden with environment variables
const games = process.env.games ? process.env.games.split(',').map(Number) : [
    10, 20, 30, 40, 50, 60, 70, 130, 440, 730, 22330, 22380, 33230, 238960, 48190, 109600, 1085660, 1857950
];
const status = process.env.status ? parseInt(process.env.status, 10) : 1; // Default to "online"

const user = new steamUser();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let idleTime = 0;
const idleFilePath = path.join(__dirname, 'idle_time.json');

if (fs.existsSync(idleFilePath)) {
    try {
        const data = JSON.parse(fs.readFileSync(idleFilePath, 'utf8'));
        if (data.idleTime) {
            idleTime = data.idleTime;
        }
    } catch (err) {
        console.error('Error reading idle time file:', err.message);
    }
}

const saveIdleTime = () => {
    try {
        const data = { idleTime };
        fs.writeFileSync(idleFilePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error('Error saving idle time:', err.message);
    }
};

const handleSteamGuard = (domain, callback) => {
    console.log(`Steam Guard code sent to your email${domain ? ` (${domain})` : ''}`);
    rl.question('Enter the Steam Guard code: ', (code) => {
        callback(code);
        rl.close();
    });
};

console.log("Steam Idler");
console.log("Made by Cr0mb");

user.on('loggedOn', () => {
    console.log(`Successfully logged in as: ${user.steamID}`);
    user.setPersona(status);
    user.gamesPlayed(games);
    console.log(`Status set to ${status === 1 ? "online" : "invisible"} and playing games: ${games}`);

    const idleTimer = setInterval(() => {
        idleTime++;
        const hours = Math.floor(idleTime / 3600);
        const minutes = Math.floor((idleTime % 3600) / 60);
        const seconds = idleTime % 60;
        const idleOutput = `Idle time: ${hours} hours, ${minutes} minutes, ${seconds} seconds`;

        process.stdout.write(`\r${idleOutput}`);
        saveIdleTime();
    }, 1000);
});

user.on('error', (err) => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
});

user.on('steamGuard', handleSteamGuard);

user.logOn({
    accountName: username,
    password: password
});

const getLocalIpAddress = () => {
    const interfaces = os.networkInterfaces();
    for (const interfaceName in interfaces) {
        for (const address of interfaces[interfaceName]) {
            if (address.family === 'IPv4' && !address.internal) {
                return address.address;
            }
        }
    }
    return '127.0.0.1';
};

const localIp = getLocalIpAddress();

http.createServer((req, res) => {
    res.write("I'm alive");
    res.end();
}).listen(80, () => {
    console.log(`Keep-alive server running at http://${localIp}:80`);
});

const gracefulShutdown = () => {
    console.log('\nGracefully shutting down...');
    user.logOff();
    clearInterval(idleTimer);
    saveIdleTime();
    process.exit(0);
};

process.on('SIGINT', gracefulShutdown);

const ensureDirectoriesExist = (filePath) => {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

ensureDirectoriesExist(idleFilePath);
