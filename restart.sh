#!/bin/bash

STEAM_BOT_PATH="$(dirname "$(realpath "$0")")/steamBot.js"

start_bot() {
    echo "Starting steamBot.js..."
    node "$STEAM_BOT_PATH" &
    BOT_PID=$!
    echo "steamBot.js started with PID $BOT_PID"
}

stop_bot() {
    echo "Stopping steamBot.js with PID $BOT_PID..."
    kill "$BOT_PID"
}

start_bot

while true; do
    sleep 3600
    stop_bot
    start_bot
done
