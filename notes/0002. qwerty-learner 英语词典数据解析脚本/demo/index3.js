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

let sourcesFolderPath = path.join(__dirname, SOURCE_FOLDER_NAME); // sources 目录的绝对路径
let resultsFolderPath = path.join(__dirname, RESULT_FOLDER_NAME); // results 目录的绝对路径

// 创建 results 目录（如果不存在）
if (!fs.existsSync(resultsFolderPath)) {
  fs.mkdirSync(resultsFolderPath, { recursive: true });
}

// 创建 A 到 Z 的子目录
for (let charCode = 'A'.charCodeAt(0); charCode <= 'Z'.charCodeAt(0); charCode++) {
  const letter = String.fromCharCode(charCode);
  const letterPath = path.join(resultsFolderPath, letter);

  // 创建子目录（如果不存在）
  if (!fs.existsSync(letterPath)) {
    fs.mkdirSync(letterPath);
  }
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

  data.forEach((it, i) => {

    if (i > 1000) return;

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

    const firstLetter = it.headWord[0].toUpperCase();
    const fileDirectoryPath = path.join(resultsFolderPath, firstLetter);

    if (!fs.existsSync(fileDirectoryPath)) {
      fs.mkdirSync(fileDirectoryPath, { recursive: true });
    }

    const filePath = path.join(fileDirectoryPath, `${it.headWord.replace(/\//g, '\\')}.md`);

    fs.writeFileSync(filePath, wordStr);
  })
}
