# Settings Tab Plugin

A customizable settings tab plugin for Obsidian.

## Features

- Customizable settings interface
- Ribbon icon and status bar integration
- Command palette commands
- Configurable options with various input types

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

1. You'll see a new ribbon icon on the left sidebar
2. Access plugin settings via Settings > Plugin Options > Settings Tab Plugin
3. Use commands from the Command Palette
4. Configure the plugin options to your liking

## Settings

- **Setting #1**: A text input for secret configuration
- **Enable Feature**: Toggle to enable/disable plugin features
- **Number Setting**: Slider to adjust numeric values

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