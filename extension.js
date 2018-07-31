const vscode = require('vscode')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

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
        fs.renameSync(productFile, origFile)
      }
      fs.writeFileSync(productFile, json, { encoding: 'utf8' })
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
      fs.renameSync(origFile, productFile)
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
