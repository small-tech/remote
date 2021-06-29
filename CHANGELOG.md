# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.2.0] - 2021-06-29

### Added

  - __Await support.__ You know have the option of calling `await()` instead of `send()`. This will return a promise that resolves when the other party uses `respond()` instead of `send()` to reply to your message.

## [2.1.0] - 2021-06-24

### Changed

  - __Warnings are no longer shown for unhandled messages.__ This is because an application can have several Remote instances (e.g., instantiated in different views on the client), each handling a subset of all possible messages and so the warnings can get confusing.

## [2.0.1] - 2021-06-23

### Breaking change

  - __Use keyd instead of keypather__ to remove Node dependency in its string-reduce → assert-err dependency (which uses `__filename` in one place). See https://github.com/tjmehta/string-reduce/issues/5

## [2.0.0] - 2021-06-23

### Added

  - __`handler` keyword__ to enable sending and receiving on the same message type.

## [1.0.0] - 2021-06-23

Initial release.
