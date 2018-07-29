# VSCode Extension to Fix Checksums

An extension to to adjust checksums after changes to core files.

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
Fix Checksums: Apply //
Fix Checksums: Restore //
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
root, quit VScode and start it normally without root privileges again.

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
