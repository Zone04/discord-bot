# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

Nothing yet

## [0.0.5.1]

### Fixed
 - Bad reaction with thread channels

## [0.0.5]

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

## [0.0.4]

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

## [0.0.3]

### Added

 - Added spam `everyone`
 - Added `help` command (list + individual)

### Changed

 - Prevent bot spamming
 - Better error management
 - Reduced spam limit from 100k to 10k

## [0.0.2.1]

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


[unreleased]: https://github.com/Zone04/discord-bot/compare/v0.0.5.1...HEAD
[0.0.5.1]: https://github.com/Zone04/discord-bot/compare/v0.0.5...v0.0.5.1
[0.0.5]: https://github.com/Zone04/discord-bot/compare/v0.0.4...v0.0.5
[0.0.4]: https://github.com/Zone04/discord-bot/compare/v0.0.3...v0.0.4
[0.0.3]: https://github.com/Zone04/discord-bot/compare/v0.0.2.1...v0.0.3
[0.0.2.1]: https://github.com/Zone04/discord-bot/compare/v0.0.2...v0.0.2.1
[0.0.2]: https://github.com/Zone04/discord-bot/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/Zone04/discord-bot/compare/v0.0.0...v0.0.1
[0.0.0]: https://github.com/Zone04/discord-bot/releases/tag/v0.0.0