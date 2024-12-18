# Simple Steam Idler

This was forked from *Gunthersuper/simple-steam-idler-replit*.

This script automatically logs into Steam using provided credentials, tracks the idle time, and sets the user's status and games. Additionally, it includes a keep-alive HTTP server and supports graceful shutdowns.

# Features
- Automatic Login: Logs into Steam using provided ``username`` and ``password`` from environment variables.
- Steam Guard: Prompts the user for the Steam Guard code if necessary.
- Game Play Status: Automatically sets the Steam status (online/invisible) and plays a set of default or custom games.
- Idle Time Tracker: Tracks the idle time of the Steam client and stores it in a file, which is updated every second.
- Keep-Alive Server: Starts a simple HTTP server to keep the script alive, accessible on the local machine's IP address at port 80.
- Graceful Shutdown: Handles script termination gracefully by saving the final idle time and logging off Steam.

# Prerequisites
> Node.js (version 12 or higher)
> steam-user package (for Steam login and interaction)

- Install the required dependencies using npm:

```
npm install steam-user readline
```

-  Setting Environment Variables in a Terminal/Command Promp type these commands:

```
export username="yourSteamUsername"
export password="yourSteamPassword"
```

# run script

```
node index.js
```

