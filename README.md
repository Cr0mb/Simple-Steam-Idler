![image](https://github.com/user-attachments/assets/d6d0033a-feb2-45ed-857b-68342af22124)


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


# What was updated:

1. The script now checks if username and password are set in environment variables. If they aren't, it throws an error and terminates the script.
2. The list of games to play can now be passed as a comma-separated string in the games environment variable. If not provided, a default set of games is used.
3. The bot now tracks the idle time in seconds and saves this information to a idle_time.json file. This allows the bot to resume tracking the idle time even after it has been restarted.
4. The bot now handles Steam Guard authentication with an interactive prompt that asks the user to enter the code sent to their email.
5. HTTP Keep-Alive Server Information is now printed to the screen.
6. The bot now handles SIGINT (Ctrl+C) gracefully by logging off, stopping the idle timer, saving the idle time, and exiting cleanly.


