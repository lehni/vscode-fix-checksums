const vscode = require('vscode')
const crypto = require('crypto')
const path = require('path')
const sudo = require("sudo-prompt")
const tmp = require("tmp")
const fs = require('fs')

const appDir = path.dirname(require.main.filename)
const rootDir = path.join(appDir, '..')

const productFile = path.join(rootDir, 'product.json')
const origFile = `${productFile}.orig.${vscode.version}`

exports.activate = function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand('fixChecksums.apply', apply),
    vscode.commands.registerCommand('fixChecksums.restore', restore)
  )
  cleanupOrigFiles()
}

const messages = {
  changed: verb => `Checksums ${verb}. Please restart VSCode to see effect.`,
  unchanged: 'No changes to checksums were necessary.',
  error: `An error occurred during execution.
Make sure you have write access rights to the VSCode files, see README`
}

function apply() {
  const product = require(productFile)
  let changed = false
  let message = messages.unchanged
  for (const [filePath, curChecksum] of Object.entries(product.checksums)) {
    const checksum = computeChecksum(path.join(appDir, ...filePath.split('/')))
    if (checksum !== curChecksum) {
      product.checksums[filePath] = checksum
      changed = true
    }
  }
  if (changed) {
    const json = JSON.stringify(product, null, '\t')
    try {
      if (!fs.existsSync(origFile)) {
        renameFileAdmin(productFile, origFile)
      }
      writeFileAdmin(productFile, json)
      message = messages.changed('applied')
    } catch (err) {
      console.error(err)
      message = messages.error
    }
  }
  vscode.window.showInformationMessage(message)
}

function restore() {
  let message = messages.unchanged
  try {
    if (fs.existsSync(origFile)) {
      fs.unlinkSync(productFile)
      renameFileAdmin(origFile, productFile)
      message = messages.changed('restored')
    }
  } catch (err) {
    console.error(err)
    message = messages.error
  }
  vscode.window.showInformationMessage(message)
}

function computeChecksum(file) {
  var contents = fs.readFileSync(file)
  return crypto
    .createHash('md5')
    .update(contents)
    .digest('base64')
    .replace(/=+$/, '')
}

function cleanupOrigFiles() {
  // Remove all old backup files that aren't related to the current version
  // of VSCode anymore.
  const oldOrigFiles = fs.readdirSync(rootDir)
    .filter(file => /\.orig\./.test(file))
    .filter(file => !file.endsWith(vscode.version))
  for (const file of oldOrigFiles) {
    fs.unlinkSync(path.join(rootDir, file))
  }
}

function writeFileAdmin(filePath, writeString, encoding = "utf-8", promptName = "File Writer") {
  console.info("Writing file with administrator priveleges.")

  return new Promise((resolve, reject) => {
    tmp.file((error, tempFilePath) => {
      if (error) reject(error)
      else fs.writeFile(tempFilePath, writeString, encoding, (error) => {
        if (error) reject(error)
        else sudo.exec(
          (process.platform === "win32" ? "copy " : "cp ") +
          "\"" + tempFilePath + "\" \"" + filePath + "\"",
          { name: promptName },
          (error) => {
            if (error) reject(error)
            else resolve(error)
          }
        );
      });
    });
  });
}

function renameFileAdmin(filePath, newPath, promptName = "File Renamer") {
  console.info("Renaming file with administrator privileges")

  return new Promise((resolve, reject) => {
    sudo.exec(
      (process.platform === "win32" ? "ren " : "mv ") +
      "\"" + filePath + "\" \"" + newPath + "\"",
      { name: promptName },
      (error) => {
        if (error) reject(error)
        else resolve(error)
      }
    );
  });
}
