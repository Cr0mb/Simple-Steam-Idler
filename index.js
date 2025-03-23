const steamUser = require('steam-user');
const readline = require('readline');
const http = require('http');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Hardcode your username and password here
const username = 'yourSteamUsername';  // Replace with your Steam username
const password = 'yourSteamPassword';  // Replace with your Steam password

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const askPort = (callback) => {
    rl.question('Enter the port number for the HTTP server: ', (portInput) => {
        const port = parseInt(portInput, 10) || 80;
        try {
            const ufwStatus = execSync(`sudo ufw status`, { encoding: 'utf8' });
            if (!ufwStatus.includes(port.toString())) {
                console.log(`Adding UFW rule for port ${port}...`);
                execSync(`sudo ufw allow ${port}`);
            }
        } catch (err) {
            console.error('Error checking or setting UFW rule:', err.message);
        }
        callback(port);
    });
};

askPort((port) => {
    const status = process.env.status ? parseInt(process.env.status, 10) : 1;
    const user = new steamUser();
    let idleTime = 0;
    const idleFilePath = path.join(__dirname, 'idle_time.json');

    if (fs.existsSync(idleFilePath)) {
        try {
            const data = JSON.parse(fs.readFileSync(idleFilePath, 'utf8'));
            if (data.idleTime) idleTime = data.idleTime;
        } catch (err) {
            console.error('Error reading idle time file:', err.message);
        }
    }

    const saveIdleTime = () => {
        try {
            fs.writeFileSync(idleFilePath, JSON.stringify({ idleTime }, null, 2), 'utf8');
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

    console.log("Steam Idler\nMade by Cr0mb");

    // Define gameList globally to avoid scope issues
    const gameList = [10, 20, 30, 40, 50, 60, 70, 130, 440, 730, 22330, 22380, 33230, 238960, 48190, 109600, 1085660, 1857950, 105600];

    user.on('loggedOn', () => {
        console.log(`Successfully logged in as: ${user.steamID}`);
        user.setPersona(status);
        user.gamesPlayed(gameList);
        console.log(`Status set to ${status === 1 ? "online" : "invisible"}`);
        console.log(`Currently playing the following games: ${gameList.join(", ")}`);

        setInterval(() => {
            idleTime++;
            saveIdleTime();

            const hours = Math.floor(idleTime / 3600);
            const minutes = Math.floor((idleTime % 3600) / 60);
            const seconds = idleTime % 60;

            process.stdout.write(`Idle Time: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}\r`);
        }, 1000);
    });

    user.on('error', (err) => {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    });

    user.on('steamGuard', handleSteamGuard);
    user.logOn({ accountName: username, password: password });

    const getLocalIpAddress = () => {
        const interfaces = os.networkInterfaces();
        for (const interfaceName in interfaces) {
            for (const address of interfaces[interfaceName]) {
                if (address.family === 'IPv4' && !address.internal) return address.address;
            }
        }
        return '127.0.0.1';
    };

    const localIp = getLocalIpAddress();

    http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: status === 1 ? "online" : "invisible",
            idleTime: idleTime,
            steamID: user.steamID ? user.steamID.toString() : "Not logged in",
            currentGames: gameList,
            loginTime: new Date().toISOString()
        }, null, 2));
    }).listen(port, () => {
        console.log(`Server running at http://${localIp}:${port}`);
    });

    const gracefulShutdown = () => {
        console.log('\nGracefully shutting down...');
        user.logOff();
        saveIdleTime();
        process.exit(0);
    };

    process.on('SIGINT', gracefulShutdown);
});
