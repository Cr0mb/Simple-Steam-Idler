# Simple Steam Idler

This is a simple Steam idler designed for idling hours on your Steam account. This fork utilizes [Render](https://render.com) and [UptimeRobot](https://uptimerobot.com) to keep the idler running 24/7.

## Features
- Automates Steam hour idling
- Easy to deploy on Render
- Environment variables for secure credential storage

---

## Requirements
1. **Steam Credentials**
   - Your Steam **username**, **password**, and **shared secret** (used for Steam Guard 2FA).
2. **Accounts on the following platforms:**
   - [Render](https://render.com) - for hosting the idler.
   - [UptimeRobot](https://uptimerobot.com) - to keep the service awake.

---

## Setup Instructions

### 1. Clone the Repository
Fork and clone the repository to your preferred platform:
```bash
git clone https://github.com/your-username/simple-steam-idler
cd simple-steam-idler
```

##E# 2. Deploy to Render
Sign up or log in to Render.

Create a new Web Service and connect it to your forked repository.

Under "Environment Variables," add the following:

```
USERNAME = Your Steam username
PASSWORD = Your Steam password
SHARED_SECRET = Your Steam Guard shared secret
```

Deploy the service.

3. Keep the Service Online with UptimeRobot
Sign up or log in to UptimeRobot.
Create a new HTTP(s) Monitor:
Monitor Type: HTTP(s)
Friendly Name: Steam Idler
URL (or IP): Your Render service's public URL.
Monitoring Interval: 5 minutes.
Save the monitor to keep the Render service alive.

