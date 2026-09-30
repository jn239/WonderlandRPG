# Wonderland RPG

A dark shared-world Alice in Wonderland Twitch RPG built for Twitch chat.

Wonderland RPG turns your Twitch chat into a persistent multiplayer RPG where viewers can create characters, explore Wonderland, fight enemies, collect equipment, craft items, and progress through a shared world.

## Features

- Persistent Twitch chat RPG
- Player levels and experience
- Multiple character classes
- Exploration system
- Combat system
- Abilities with cooldowns
- Equipment and inventory
- Items and consumables
- Shops and gold
- Crafting and recipes
- Shared world progression
- Persistent player data
- Twitch OAuth device authorization
- Windows desktop launcher
- Windows installer
- No Node.js required for the installed Windows version

## Twitch Commands

The game includes commands such as:

!help
!status
!inventory
!equipment
!world
!classes
!enemies
!recipes
!enter
!explore
!fight
!ability
!use
!equip
!shop
!buy
!craft

Additional commands and gameplay systems may be added as the project develops.

## How It Works

The Twitch bot connects to your Twitch channel and listens for commands from chat.

Players can:

1. Enter Wonderland.
2. Create and develop their character.
3. Explore different areas.
4. Encounter enemies.
5. Fight enemies using attacks and abilities.
6. Earn experience and gold.
7. Collect and equip items.
8. Purchase items from shops.
9. Craft items using discovered recipes.
10. Continue progressing with persistent character data.

The world and player data are saved between sessions.

## Windows Installation

Download the latest Windows installer from the project's GitHub Releases page.

Run:

Wonderland RPG Setup 1.0.0.exe

The installer creates a normal Windows application with:

- Desktop shortcut
- Start Menu shortcut
- Uninstaller
- Wonderland RPG launcher

The installed version does not require Node.js to be installed on the computer.
## Twitch Setup

When Wonderland RPG is launched, the launcher can connect to Twitch using Twitch's device authorization process.

The user authorizes the Twitch account in the browser and the launcher receives the authorization needed to connect the bot.

No Twitch password is stored by the application.

OAuth configuration and access tokens are kept outside the source repository.

## Player Data

Player and world data are stored separately from the installed application files.

This allows the application to keep player progress without modifying the program installation itself.

User data is stored in the user's Windows AppData directory.

The project's source repository intentionally does not contain live player data.

## Development

Development requires Node.js.

After cloning the repository, install the dependencies:

npm install

Start the bot directly:

npm.cmd start

Start the desktop launcher:

npm.cmd run launcher

Build the Windows application:

npm.cmd run build

Build an unpacked Windows application:

npm.cmd run build:dir

Build the Windows installer:

npm.cmd run build:installer

The installer is created in the dist directory.

## Development Configuration

Create a local .env file if running the bot directly during development.

Use .env.example as the template:

TWITCH_USERNAME=
TWITCH_CHANNEL=
TWITCH_CLIENT_ID=
TWITCH_ACCESS_TOKEN=
TWITCH_REFRESH_TOKEN=

Never commit the .env file.

The .gitignore file is configured to exclude local credentials, player data, logs, build output, and dependencies.

## Project Structure

WonderlandRPG/
â”œâ”€â”€ data/
â”‚   â””â”€â”€ .gitkeep
â”œâ”€â”€ dist/
â”œâ”€â”€ installer/
â”œâ”€â”€ launcher/
â”‚   â”œâ”€â”€ client-config.json
â”‚   â””â”€â”€ launcher.js
â”œâ”€â”€ logs/
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ bot.js
â”‚   â”œâ”€â”€ combat.js
â”‚   â”œâ”€â”€ commands.js
â”‚   â”œâ”€â”€ crafting.js
â”‚   â”œâ”€â”€ events.js
â”‚   â”œâ”€â”€ game.js
â”‚   â”œâ”€â”€ items.js
â”‚   â”œâ”€â”€ players.js
â”‚   â”œâ”€â”€ shop.js
â”‚   â””â”€â”€ world.js
â”œâ”€â”€ .env.example
â”œâ”€â”€ .gitignore
â”œâ”€â”€ LICENSE
â”œâ”€â”€ package.json
â”œâ”€â”€ package-lock.json
â””â”€â”€ README.md
## Security

Private Twitch credentials must never be committed to GitHub.

The repository excludes:

- .env
- Twitch access tokens
- Twitch refresh tokens
- Player save data
- World save data
- Backup save files
- Logs
- node_modules
- Windows build output

The Twitch client ID used by the launcher is not a secret and is safe to include as part of the application's public configuration.

## Project Status

Version 1.0.0 includes the core Wonderland RPG gameplay systems and a Windows desktop launcher.

The following systems have been tested:

- Twitch connection
- Player status
- Inventory
- Equipment
- World information
- Character classes
- Enemy information
- Recipes
- Entering Wonderland
- Exploration
- Combat
- Abilities
- Ability cooldowns
- Item usage
- Equipment
- Shop
- Buying items
- Crafting
- Persistent player data
- Windows launcher
- Twitch device authorization
- Windows installer

## License

Wonderland RPG is released under the MIT License.

See the LICENSE file for the complete license text.
## Code Signing Policy

Wonderland RPG Windows releases are code signed to help users verify the authenticity and integrity of distributed binaries.

Official release binaries are published through the Wonderland RPG GitHub repository and releases page.

The project uses SignPath Foundation for code signing of eligible open-source releases. Signing certificates and signing services are used only for official Wonderland RPG release artifacts.

Source code is publicly available in this repository so users can inspect the code corresponding to each release.
