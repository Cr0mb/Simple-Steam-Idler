![image](https://github.com/user-attachments/assets/10816210-e723-4952-bf99-7b4035e12369)


## Update

- Restarts itself every hour to avoid sticking.


# Simple Steam Idler

This was forked from *Gunthersuper/simple-steam-idler-replit*.

This script automatically logs into Steam using provided credentials, tracks the idle time, and sets the user's status and games. Additionally, it includes a keep-alive HTTP server and supports graceful shutdowns.

## Features
- Logs into steam using provided credentials
- Idles in predefined Steam games
- Tracks idle time and saves it persistently
- Hosts an HTTP server displaying current status, idle time, and games being idled
- Automatically configures UFW to allow the selected HTTP port

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

## API Endpoint
- The HTTP server provides a JSON response with the following fields:
```
{
  "status": "online",
  "idleTime": 3600,
  "steamID": "76561198000000000",
  "currentGames": [10, 20, 30, 40],
  "loginTime": "2025-02-25T12:00:00Z"
}
```
