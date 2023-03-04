const vscode = require('vscode')
const axios = require('axios')

/**
 * @param {vscode.ExtensionContext} context
 */

function GetRandomAyaNumber() {
  const ayaMin = 1
  const ayaMax = 6236

  return Math.floor(Math.random() * (ayaMax - ayaMin + 1)) + ayaMin
}

function getUserLanguage() {
  let lang = 'ar'

  if (vscode.workspace.getConfiguration('islamic').get('language') === 'Arabic') {
    return lang
  } else {
    lang = 'en'
  }

  return lang
}

async function getRandomAya() {
  let randomAyaNumber = GetRandomAyaNumber()

  let content = ''

  try {
    let ayaLang = getUserLanguage()

    let response = await axios.get(`http://api.alquran.cloud/v1/ayah/${randomAyaNumber}/${ayaLang}.asad`)
    console.log(response)

    let aya = response.data.data.text

    let ayaNumber = response.data.data.numberInSurah

    let surahName = response.data.data.surah.name

    content = `${aya}✨${surahName} (${ayaNumber})`
  } catch (error) {
    content = `✨لا إله إلا أنت سبحانك إني كنت من الظالمين🔴 غير متصل بالشبكة  `
  }

  return content
}

function activate(context) {
  let interval = vscode.workspace.getConfiguration('islamic').get('interval')
  let intervalMS = 3000

  // let intervalMS = interval * 60000

  setInterval(async function () {
    getRandomAya()
      .then(function (response) {
        vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: response,
            cancellable: true,
          },
          async progress => {
            progress.report({ increment: 0 })
            await new Promise(resolve => setTimeout(resolve, intervalMS))
            progress.report({ increment: 100, message: 'Done!' })
          }
        )
      })
      .catch(function () {
        vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: 'Error while activating islamic :( ',
            cancellable: true,
          },
          async progress => {
            progress.report({ increment: 0 })
            await new Promise(resolve => setTimeout(resolve, intervalMS))
            progress.report({ increment: 100, message: 'Done!' })
          }
        )
      })
  }, intervalMS)
}

// console.log('Congratulations, your extension "islamic" is now active!')
// vscode.window.showInformationMessage('hello')
// const array = [
//   'اللهم صل على محمد وعلى آل محمد',
//   'الحمد لله',
//   'الله أكبر',
//   'سبحان الله',
//   'لا إله إلا الله',
//   'لا إله إلا الله وحده لا شريك له، له الملك وله الحمد، وهو على كل شيء قدير',
//   'اللهم إني أعوذ بك من الهم والحزن، والعجز والكسل، والجبن والبخل، وغلبة الدين وقهر الرجال',
//   'لا إله إلا الله وحده لا شريك له، له الملك وله الحمد، وهو على كل شيء قدير',
//   'أستغفر الله',
// ]

// let disposable = vscode.commands.registerCommand('islamic.helloWorld', function () {
//   // Display a message box to the user
//   vscode.window.showInformationMessage('Hello World from Islamic!')
// })

// context.subscriptions.push(disposable)

function deactivate() {}

module.exports = {
  activate,
  deactivate,
}
