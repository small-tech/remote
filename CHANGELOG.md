# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.1] - 2021-06-23

  - Use keyd instead of keypather to remove Node dependency in its string-reduce → assert-err dependency (which uses `__filename` in one place). See https://github.com/tjmehta/string-reduce/issues/5

## [2.0.0] - 2021-06-23

  - Create `handler` keyword to enable sending and receiving on the same message type.

## [1.0.0] - 2021-06-23

Initial release.
