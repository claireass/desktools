# Changelog

## [0.6.1] - 2026-10-03

### Fixed

- Closing the window hides it when the tray icon exists, and closes the app when close-to-tray is off

## [0.6.0] - 2026-10-02

### Added

- Windows startup entry when the desktop preference is on
- Tray icon that keeps the window open when close-to-tray is on
- One update check after startup when update checking is on, still asking before download

## [0.5.0] - 2026-10-02

### Added

- Local password generator with an entropy estimate

### Security

- The desktop app can open only the DeskTools GitHub page
- Regular expression tests stop if they run too long
- The JWT reader warns when the algorithm is `none` or the signature is empty
- Downloaded copy names drop path pieces and Windows device names

## [0.4.0] - 2026-10-02

### Added

- Regular expression tester with groups
- Local JWT reader that shows the header and payload and does not verify the signature
- Five-field cron calculator for the next UTC runs

## [0.3.0] - 2026-10-02

### Added

- URL encode and decode
- Unix timestamp and UTC date conversion

### Changed

- JSON formatter can also minify JSON onto one line

## [0.2.1] - 2026-10-02

### Changed

- Update checks ask before downloading and installing a newer release

## [0.2.0] - 2026-10-02

### Added

- Base64 encode and decode for text

## [0.1.0] - 2026-10-02

### Added

- Desktop shell with collapsible sidebar, routing, and light, dark, and system themes
- Turkish and English interface
- Tool registry, global search, favorites, and recent tools
- Local settings storage through the Tauri store plugin
- JSON formatter, text counter, UUID generator, hash generator, and calculator
- File info, size analyzer, and rename preview that downloads copies without changing the originals
- Image convert, resize, and compress tools that download copies without changing the originals
- PDF merge, split, and page extract tools that download copies without changing the originals
- Offline URL parser, IPv4 subnet calculator, and HTTP status lookup
- Clipboard tool that reads only on request, and session system info
- Case converter, line tools, percentage, unit converter, and date calculator
- Saved startup, tray, and update preferences that do not start Windows login, a tray icon, or update downloads yet
- Unsigned NSIS installer for the current user machine (`DeskTools_0.1.0_x64-setup.exe`)
- GitHub owner `claireass` and a signed updater that downloads a newer release in the desktop app
