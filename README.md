# Increment Extension for Visual Studio Code

This extension provides simple commands to insert incrementing numbers into your text using multiple cursors.

> For creating, and using multiple cursors, see the [Visual Studio Code documentation](https://code.visualstudio.com/docs/editor/codebasics#_multiple-selections-multicursor).

## Usage

Create multiple cursors in your text, then run one of the following commands:

- `increment-extension.increment`

  - Specify the starting number, increment value, and a [c printf-style format string](https://cplusplus.com/reference/cstdio/printf/).

- `increment-extension.increment-indexed-0`
- `increment-extension.increment-indexed-1`

The commands will insert an incrementing number at each cursor position, in order of selection.

## Features

- `increment-extension.increment` (Increment: Customizable Increment)

  - Insert an incrementing number at each cursor position.
  - Prompted with an input box specifying the starting number, increment value, and a c printf-style format string.
  - Example

    - start: `1`, increment: `1`, format: `%d`, will insert `1`, `2`, `3`, `4`, etc.
    - start: `1`, increment: `2`, format: `%d`, will insert `1`, `3`, `5`, `7`, etc.
    - start: `1`, increment: `1`, format: `%02d`, will insert `01`, `02`, `03`, `04`, etc.
    - start: `1`, increment: `1`, format: `0x%02x`, will insert `0x01`, `0x02`, `0x03`, `0x04`, etc.

- `increment-extension.increment-indexed-0` (Increment: Index 0 Increment)

  - Insert an incrementing number at each cursor position, starting at `0`

- `increment-extension.increment-indexed-1` (Increment: Index 1 Increment)

  - Insert an incrementing number at each cursor position, starting at `1`
