const fs = require('fs')
const path = require('path')

const { SOURCE_FOLDER_NAME, RESULT_FOLDER_NAME } = require('./const')

const { parsePhone } = require('./parsePhone')
const { parseTrans } = require('./parseTrans')
const { parseRemMethod } = require('./parseRemMethod')
const { parseRelWord } = require('./parseRelWord')
const { parseSyno } = require('./parseSyno')
const { parsePhrase } = require('./parsePhrase')
const { parseSentence } = require('./parseSentence')
const { generateChapterMD } = require('./generateChapterMD')
const { clearResultFolder } = require('./clearResultFolder')

let sourcesFolderPath = path.join(__dirname, SOURCE_FOLDER_NAME); // sources 目录的绝对路径
let resultsFolderPath = path.join(__dirname, RESULT_FOLDER_NAME); // results 目录的绝对路径

// 创建 results 目录（如果不存在）
if (!fs.existsSync(resultsFolderPath)) {
  fs.mkdirSync(resultsFolderPath, { recursive: true });
}

const JSON_FileList = fs.readdirSync(sourcesFolderPath)
  .filter(p => p.includes('.json'))
  .map(p => path.join(sourcesFolderPath, p)) // sources 目录下所有 json 文件的绝对路径

for (let i = 0; i < JSON_FileList.length; i++) {
  writeFile(JSON_FileList[i])
}

// 写入文件
function writeFile(file_path) {
  // JSON parse
  let data = JSON.parse(
    `[${fs.readFileSync(file_path, 'utf-8')}]`
    .replaceAll(/}\r\n/g, '},')
    .replaceAll(/},]/g, '}]')
  )

  const basename = path.basename(file_path, '.json')
  const result_folder_path = path.join(resultsFolderPath, basename)

  clearResultFolder(result_folder_path)
  generateChapterMD(data.map(w => w.headWord), path.join(result_folder_path, `${basename}.md`), basename)

  data.forEach((it, i) => {

    // if (i > 1000) return;

    if (/[\s-=?()0123456789]/.test(it.headWord)) return;

    const word = it.content.word.content

    let wordStr = '' +
        parsePhone(word) +
        '\n\n' +
        parseTrans(word) +
        parseRemMethod(word) +
        parseSyno(word) +
        parseRelWord(word) +
        parsePhrase(word) +
        parseSentence(word);

    fs.writeFileSync(path.join(result_folder_path, `./${it.headWord.replace(/\//g, '\\')}.md`), wordStr)
  })
}