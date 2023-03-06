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

    let aya = response.data.data.text

    let ayaNumber = response.data.data.numberInSurah

    let surahName = response.data.data.surah.name

    content = `${aya}✨${surahName} (${ayaNumber})`
  } catch (error) {
    content = `✨لا إله إلا أنت سبحانك إني كنت من الظالمين🔴 غير متصل بالشبكة  `
  }

  return content
}

const getRandomHadith = async () => {
  let hadith =
    '✨ إِنَّ اللَّهَ وَمَلائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ يَا أَيُّهَا الَّذِينَ آمَنُوا صَلُّوا عَلَيْهِ وَسَلِّمُوا تَسْلِيمًا'

  try {
    const { data } = await axios.get(`https://api.sunnah.com/v1/hadiths/random`, {
      headers: {
        'X-API-Key': 'SqD712P3E82xnwOAEOkGd5JZH8s9wRR24TqNFzjk',
      },
    })
    // // Select Muslim language
    // const muslimLanguage = vscode.workspace
    //   .getConfiguration("hadith")
    //   .get("language");

    let hadithLang = getUserLanguage()

    hadithLang === 'ar'
      ? (hadith = `✨ ${data.hadith[1].body.slice(3, -4)}`)
      : (hadith = `✨ ${data.hadith[0].body.slice(3, -4)}`)
  } catch (error) {}

  return hadith
}

const getRandomAzkar = async () => {}

let num = 1
function activate(context) {
  // let interval = vscode.workspace.getConfiguration('islamic').get('interval')

  // let intervalMS = interval * 60000
  let intervalMS = 10000

  setInterval(async function () {
    if (num > 2) num = 1
    let data
    if (num === 1) data = await getRandomAya()
    else if (num === 2) data = await getRandomHadith()
    // else data = await getRandomAzkar()
    num++

    vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: data,
        cancellable: true,
      },
      async progress => {
        progress.report({ increment: 0 })
        await new Promise(resolve => setTimeout(resolve, 10000))
        progress.report({ increment: 100, message: 'Done!' })
      }
    )

    // getRandomHadith()
    //   .then(function (response) {
    //     vscode.window.withProgress(
    //       {
    //         location: vscode.ProgressLocation.Notification,
    //         title: response,
    //         cancellable: true,
    //       },
    //       async progress => {
    //         progress.report({ increment: 0 })
    //         await new Promise(resolve => setTimeout(resolve, 10000))
    //         progress.report({ increment: 100, message: 'Done!' })
    //       }
    //     )
    //   })
    //   .catch(function () {
    //     vscode.window.withProgress(
    //       {
    //         location: vscode.ProgressLocation.Notification,
    //         title: 'Error while activating islamic :( ',
    //         cancellable: true,
    //       },
    //       async progress => {
    //         progress.report({ increment: 0 })
    //         await new Promise(resolve => setTimeout(resolve, 10000))
    //         progress.report({ increment: 100, message: 'Done!' })
    //       }
    //     )
    //   })
  }, intervalMS)
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
}
