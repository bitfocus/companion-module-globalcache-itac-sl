# Changelog

All notable changes to this module are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2026-11-21

Requires Companion 5.0 or later or Bitfocus Buttons 1.8 or later.

### Added

- A `response_hex` variable, showing the last data received as hex alongside the `response` variable.
- Variables can be used in the "Command" and "HEX Command" actions.

### Changed

- Rewritten in TypeScript on Companion module API 2.1, running on Node.js 26.
- Connection status reflects the TCP connection (connecting, connected, disconnected), and reports when no IP is configured.
- The port setting is a number field. Saved configurations are upgraded automatically.
- A "HEX Command" with no hex values, or an empty "Command", is logged rather than sending nothing to the device.

### Removed

- The "Convert TCP Response Format" setting. The `response` variable always shows text and `response_hex` hex; saved configurations are upgraded automatically.

### Fixed

- The connection not being retried after a network error.
- An error when the connection was deleted or disabled.
- The `response` variable holding raw bytes when no response conversion was selected.
- A network error being logged on every reconnect attempt, rather than once until the connection succeeds or the error changes.

## [2.0.0]

Last release of the JavaScript module.

[3.0.0]: https://github.com/bitfocus/companion-module-globalcache-itac-sl/compare/v2.0.0...v3.0.0
[2.0.0]: https://github.com/bitfocus/companion-module-globalcache-itac-sl/releases/tag/v2.0.0
