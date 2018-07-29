# VSCode Extension to Fix Checksums

An extension to to adjust checksums after changes to VSCode core files. Once the
checksum changes are applied and VSCode is restarted, all warning about core
file modifications will disappear, such as the display of `[Unsupported]` in the
title-bar, or the following dialog on start-up:

<p align="center">
  <img src="https://raw.githubusercontent.com/lehni/vscode-fix-checksums/master/resources/corrupt.png" alt="Corrupt">
</p>

## Installation

Follow the instructions in the
[Marketplace](https://marketplace.visualstudio.com/items?itemName=lehni.vscode-fix-checksums),
or run the following in the command palette:

```shell
ext install lehni.vscode-fix-checksums
```

Alternatively, you can run this command in the command line:

```sh
code --install-extension lehni.vscode-fix-checksums
```

## Usage

The extension adds 2 new commands to the command palette:

```js
Fix Checksums: Apply // Checks core files for changes and applies new checksums.
Fix Checksums: Restore // Restores original state of VSCode checkums.
```

After executing either of these commands, you need to fully restart VSCode in
order to see the extension's effect. Simply reloading the window is not enough.

See [Disclaimer / A Word of Caution](#disclaimer--a-word-of-caution) for
details.

## Installing on macOS 10.14 Mojave

Due to security restrictions on macOS 10.14, VSCode needs to run as root
in order to be able to apply the patches. To do so, open the `Terminal.app` and
run:

```sh
sudo "/Applications/Visual Studio Code.app/Contents/MacOS/Electron"
```

Or this if you're using VSCode Insiders:

```sh
sudo "/Applications/Visual Studio Code - Insiders.app/Contents/MacOS/Electron"
```

Once you ave applied the modifications by executing `Fix Checksums: Apply` as
root, quit VSCode and start it normally without root privileges again.

## Disclaimer / A Word of Caution

This extension modifies files that are part of the core of VSCode, so use it at
your own risk.

This extension creates backup files before modifying the core files, and these
can be restored at any time using the `Fix Checksums: Restore` command.

If anything goes wrong, you can always reinstall VSCode from
[code.visualstudio.com](https://code.visualstudio.com/download) without loosing
any settings or installed extensions.

## License

MIT © Jürg Lehni, 2018
