# Changelog

All notable changes to this project will be documented in this file.

## [1.1.2]

### Fixed
 - Wrong version fetched in `update`

## [1.1.1]

### Fixed
 - `rr resetReact` and `rr viewIgnore` missing return values for args check

## [1.1.0]

### Added
 - Handlers system for all events, with reload capabilities
 - ReactionRole (see dedicated section)
 - `logChanSpam` setting
 - Reloadable database models
 - ModulesManager with reload capabilities

### Changed
 - `update` command also update npm dependencies and execute migrations
 - Updated to discord.js v14
 - Moved Spam logs from `logChan` to `logChanSpam`

### ReactionRole
 - system to give roles based on reactions on a message
 - `rr create` `rr addReaction` for creation
 - `rr delete` `rr removeReaction` for deletion
 - `rr resetReact` if reactions have been accidentally removed
 - `rr addIgnore` `rr removeIgnore` `rr viewIgnore` to manage users that shouldn't interact
 - logs role claims and unclaims in `logChan`

## [1.0.2]

### Fixed
 - Help message with bad display for commands without argument

### Added
 - Blacklist for all chans at once

### Changed
 - Return value for all commands
 - Special sentence for ban/unban bot itself
 - Spam easter egg cannot happen if no/too many user(s) would have been found
 - Only users having access to a chan can be chosen as spam target

## [1.0.1]

### Added
 - Some more NSFW commands

### Fixed
 - Help not working with subcommands
 - Wrong gestion of the permissions of commands
 - Fix commands callable with args when not needed
 - Renamed bl view as bl list

## [1.0.0]

### Added
 - Ban/Unban fake commands
 - Speak command for guild owners
 - Added function for checking command arguments
 - Added `kiss` command
 - Added 8-ball command
 - Added roll command
 - Added NSFW commands (accessible only in NSFW channels)
 - Added roulette command
 - Added subcommands system (including loading/reloading/help/cron)
 - Added description to settings
 - Added blacklist command for commands in individual channels
 - Added blacklist command for users across guilds

### Changed
 - Clear can remove arbitrary number of message
 - Reorganized function in groups
 - Include category in help message
 - Gestion of commands as an object
 - Reorganized settings in groups

### Fix
 - Fix logs showing for resumed spams
 - Fix wrong log with spaced names
 - Fix spams with float number of spams
 - Translated commands descriptions

## [0.0.6] 2022-03-15

### Fix
 - Failed spam resuming if spamLimit changed to be lower than resumed spams

### Added
 - `reload` command to reload all commands, cron and config
 - `easterProba` and `logChan` settings
 - Log spams and reboot on configurable logging channels
 - Added back update command

### Changed
 - Delete stalled spams if UserNotFound
 - Added more info in logs (guild and channel ID)
 - Removed ambiguous logs when resuming spams
 - `help` command only shows available commands

## [0.0.5.2] 2022-03-02

### Fixed
 - Easter egg triggering on spam resume

### Changed
 - Removed unused API call

## [0.0.5.1] 2022-03-02

### Fixed
 - Bad reaction with thread channels

## [0.0.5] 2022-03-02

### Added
 - Cron job for restarting spams
 - Secret functionnality
 - Debug command
 - Guild-wide settings + settings command
 - Spam random number

### Changed
 - Check permissions before `clear`

### Fixed
 - Wrong logging function
 - Fix ignored arguments in spam with everyone/random

## [0.0.4] 2021-12-29

### Added
 - Added log on spam command
 - Added DB for saving spams in case of crash
 - Added auto restart of crashed spams

### Fixed
 - `undefined` in help of commands without `usage`
 - Commands now stops triggering with uppercase and/or spaces between prefix and command name

### Changed
 - `spam everyone` now works with `@everyone` too
 - `help` command shows details for each argument
 - Default message for unhandeld errors

## [0.0.3] 2021-12-20

### Added

 - Added spam `everyone`
 - Added `help` command (list + individual)

### Changed

 - Prevent bot spamming
 - Better error management
 - Reduced spam limit from 100k to 10k

## [0.0.2.1] 2021-12-16

### Fixed

- exit process on failed login

## [0.0.2] - 2021-12-16

### Added 

- Added `clear` command
- Added `random` option for `spam`
- Added CHANGELOG.md

### Changed

- Edited infos showed by `userinfo`

### Fixed

- Fix user search with space in `spam`

### Removed

- Removed `update` command
- Removed `args-info` command

## [0.0.1] - 2021-12-14

### Changed

- Migrated to Discord.js v13
- Improved `spam` performances and added progress
- `convertUser` now returns a `GuildMember`

## [0.0.0] - 2020-08-04

### Added

- spam command
- ping command
- pong command
- args-info command
- update command
- userinfo command


[1.1.2]: https://github.com/Zone04/discord-bot/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/Zone04/discord-bot/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/Zone04/discord-bot/compare/v1.0.2...v1.1.0
[1.0.2]: https://github.com/Zone04/discord-bot/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/Zone04/discord-bot/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/Zone04/discord-bot/compare/v0.0.6...v1.0.0
[0.0.6]: https://github.com/Zone04/discord-bot/compare/v0.0.5.2...v0.0.6
[0.0.5.2]: https://github.com/Zone04/discord-bot/compare/v0.0.5.1...v0.0.5.2
[0.0.5.1]: https://github.com/Zone04/discord-bot/compare/v0.0.5...v0.0.5.1
[0.0.5]: https://github.com/Zone04/discord-bot/compare/v0.0.4...v0.0.5
[0.0.4]: https://github.com/Zone04/discord-bot/compare/v0.0.3...v0.0.4
[0.0.3]: https://github.com/Zone04/discord-bot/compare/v0.0.2.1...v0.0.3
[0.0.2.1]: https://github.com/Zone04/discord-bot/compare/v0.0.2...v0.0.2.1
[0.0.2]: https://github.com/Zone04/discord-bot/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/Zone04/discord-bot/compare/v0.0.0...v0.0.1
[0.0.0]: https://github.com/Zone04/discord-bot/releases/tag/v0.0.0