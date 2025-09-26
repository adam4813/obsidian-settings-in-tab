# Settings In Tab Plugin for Obsidian

A plugin to open Obsidian settings in a tab.

## Features

- Ribbon icon to open the settings in a tab
- Command palette command to open settings in a tab

## Limitations
On the Community Plugins page, the Options and Hotkeys button do not navigate to the plugin's options tab or hotkeys tab, respectively.

## Installation

### Manual Installation

1. Download the latest release
2. Extract the plugin folder to your vault's plugins folder: `<vault>/.obsidian/plugins/settings-tab-plugin/`
3. Reload Obsidian
4. Enable the plugin in Settings > Community Plugins

### Development

1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start development mode
4. Make changes to `main.ts` and other source files
5. Run `npm run build` to build for production

## Usage

Once installed and enabled:

1. You'll see a new ribbon icon on the left sidebar to open the settings in a new tab
2. Use commands from the Command Palette to open settings in a new tab

## Development Notes

This plugin is built with:
- TypeScript
- esbuild for bundling
- Obsidian Plugin API

## Contributing

Feel free to contribute by:
- Reporting bugs
- Suggesting features
- Submitting pull requests

## License

MIT License