const steamUser = require('steam-user');
const readline = require('readline');
const http = require('http');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

// Your Steam credentials
const username = 'username'; // username here
const password = 'password';  // password here

const idleFilePath = path.join(__dirname, 'idle_time.json');
let idleTime = 0;

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

const gracefulShutdown = (user) => {
    return () => {
        console.log('\nGracefully shutting down...');
        user.logOff();
        saveIdleTime();
        process.exit(0);
    };
};

const launchServer = (user, port, status, gameList) => {
    const localIp = (() => {
        const interfaces = os.networkInterfaces();
        for (const name in interfaces) {
            for (const iface of interfaces[name]) {
                if (iface.family === 'IPv4' && !iface.internal) {
                    return iface.address;
                }
            }
        }
        return '127.0.0.1';
    })();

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
};

// Main logic
const startIdler = (port) => {
    const status = process.env.status ? parseInt(process.env.status, 10) : 1;
    const user = new steamUser();

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

        // Auto-restart every hour
        setTimeout(() => {
            console.log('\nRestarting process...');
            user.logOff();
            saveIdleTime();
            spawn(process.argv[0], process.argv.slice(1), {
                detached: true,
                stdio: 'inherit'
            });
            process.exit();
        }, 3600000);
    });

    user.on('error', (err) => {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    });

    user.on('steamGuard', (domain, callback) => {
        console.log(`Steam Guard code sent to your email${domain ? ` (${domain})` : ''}`);
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        rl.question('Enter the Steam Guard code: ', (code) => {
            callback(code);
            rl.close();
        });
    });

    user.logOn({ accountName: username, password: password });

    launchServer(user, port, status, gameList);

    process.on('SIGINT', gracefulShutdown(user));
};

// Prompt for port if not restarting
if (!process.env.RESTARTED) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

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

        rl.close();
        startIdler(port);
    });
} else {
    // Use default or saved port on restart
    const defaultPort = 80;
    startIdler(defaultPort);
}
