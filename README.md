# grades-watcher

A simple script that allows me to check my grades on the university website without having to log in every time.
It checks the grades every 15 minutes and sends an embed to a Discord channel if there are new grades.

Here is an example of the embed:

![Embed example](./assets/embed%20exemple.jpeg)

## Installation

1. Clone the repository
2. Install the dependencies with `npm install`
3. Create a `.env` file at the root of the project and fill it with the following variables:
   - `CAS_USERNAME`: Your university username
   - `CAS_PASSWORD`: Your university password
   - `DISCORD_WEBHOOK_URL_1`: The Discord webhook URL
4. Run the script with `npm start`

Please note that this script only works for Nantes' IUT students. If you want to use it for another university, you will have to modify the script to fit the website's structure.
It's just a simple script that I made for my personal use, so I didn't bother making it more generic.
