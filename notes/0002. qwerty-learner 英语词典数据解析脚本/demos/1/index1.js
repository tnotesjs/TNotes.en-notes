// 写得比较乱，后续有精力会优化，并尝试提 pr
const fs = require('fs')
const path = require("path")
// const {
//   EOL
// } = require('os')

/**
 * 源目录名
 */
const SOURCE_FOLDER_NAME = 'sources'
/**
 * 目标目录名
 */
const RESULT_FOLDER_NAME = 'results'
/**
 * 一个单词下边的子标题
 */
const SUB_TITLE = {
  sentence: '例句',
  phrase: '短语',
  trans: '词义',
  relWord: '关联词汇',
  ukphone: 'UK',
  usphone: 'US',
  syno: '同义词'
}

let sourcesFolderPath = path.join(__dirname, SOURCE_FOLDER_NAME); // sources 目录的绝对路径
let resultsFolderPath = path.join(__dirname, RESULT_FOLDER_NAME); // results 目录的绝对路径

const JSON_FileList = fs.readdirSync(sourcesFolderPath)
  .filter(p => p.includes('.json'))
  .map(p => path.join(sourcesFolderPath, p)) // sources 目录下所有 json 文件的绝对路径

for (let i = 0; i < JSON_FileList.length; i++) {
  writeFile(JSON_FileList[i])
}

// 写入文件
function writeFile(fileName) {
  // 处理文件内容
  let fileContent = fs.readFileSync(fileName, 'utf-8')
  fileContent = '[' + fileContent + ']'

  fileContent = fileContent.replaceAll(/}\r\n/g, '},').replaceAll(/},]/g, '}]')
  // console.log(fileContent);

  let data = JSON.parse(fileContent)

  // 解析的 json 词典名称
  const basename = path.basename(fileName, '.json')

  // 清空 results 目录下指定词典目录
  const resultFolderPath = path.join(resultsFolderPath, basename)
  emptyDir(resultFolderPath)
  rmEmptyDir(resultFolderPath)
  fs.mkdirSync(resultFolderPath)

  // 单词列表（只含单词）
  const headWords = data.map(w => w.headWord)
  // console.log(headWords)
  let checkString = '';
  headWords.map((h, i) => {
    const chapterNum = Math.floor(i / 20 + 1);
    if (i % 20 === 0) return `\n# Chapter ${chapterNum.toString().padStart(3, '0')}\n\n` + `- [ ] ${h}\n`
    else return `- [ ] ${h}\n`
  }).forEach((w, i) => {
    const chapterNum = Math.floor(i / 20 + 1);
    checkString += w;
    if (chapterNum % 10 === 0 && i === chapterNum * 20 - 1) {
      fs.writeFileSync(path.join(resultFolderPath, `./${(chapterNum - 9).toString().padStart(3, '0')}~${chapterNum.toString().padStart(3, '0')}.md`), checkString)
      checkString = '';
    }
    if (i === headWords.length - 1) {
      fs.writeFileSync(path.join(resultFolderPath, `./${(Math.floor(chapterNum / 10) * 10 + 1).toString().padStart(3, '0')}~${chapterNum.toString().padStart(3, '0')}.md`), checkString)
      checkString = '';
    }
  });

  let chapterString;
  let chapterNum = 0;
  data.forEach((it, i) => {
    // 拼接章节
    if (i % 20 === 0) {
      if (chapterNum !== 0) fs.writeFileSync(path.join(resultFolderPath, `./Chapter ${chapterNum.toString().padStart(3, '0')}.md`), chapterString)
      chapterNum++;
      chapterString = '';
      //   chapterString += `# Chapter ${chapterNum.toString().padStart(3, '0')}`
      //   chapterString += '\n\n'

      // 拼接该 chapter 中的所有单词为 checkbox
      //   chapterString += headWords.slice((chapterNum - 1) * 20, chapterNum * 20).map(h => `- [ ] ${h}\n`).join('')
      //   chapterString += '\n'
    }

    // 拼接单词
    chapterString += `# ${i % 20 + 1}. ${it.headWord}`
    chapterString += '\n\n'
    const word = it.content.word.content

    // 拼接发音
    chapterString += `${SUB_TITLE.usphone}: [${word.usphone}]` + '\n'
    chapterString += `${SUB_TITLE.ukphone}: [${word.ukphone}]` + '\n\n'

    // 拼接词义
    if (word.trans && word.trans.length > 0) {
      const trans = word.trans
      chapterString += `**${SUB_TITLE.trans}**` + '\n\n'
      for (let i = 0; i < trans.length; i++) {
        const t = trans[i]
        if (t.pos && t.tranCn) chapterString += `${t.pos}. ${t.tranCn.replace(/\s/g, '')}` + '\n'
        if (t.tranOther) chapterString += `\`${t.tranOther}\``
        chapterString += '\n\n'
      }
    }

    // 拼接同义词
    if (word.syno && word.syno.synos && word.syno.synos.length > 0) {
      const synos = word.syno.synos
      chapterString += `**${SUB_TITLE.syno}**` + '\n\n'
      for (let i = 0; i < synos.length; i++) {
        const s = synos[i];
        const w = s.hwds.map(h => `\`${h.w}\``).join(' ')
        chapterString += `${s.pos}. ${s.tran}` + '\n' + w + '\n\n';
      }
      chapterString += '\n'
    }

    // 拼接短语
    if (word.phrase && word.phrase.phrases) {
      const phrase = word.phrase
      const phrases = phrase.phrases
      chapterString += `**${phrase.desc}**` + '\n\n'
      phrases.forEach(p => {
        chapterString += `- \`${p.pContent}\` ${p.pCn}` + '\n'
      })
      chapterString += '\n'
    }

    // 拼接例句
    if (word.sentence && word.sentence.sentences) {
      const sentence = word.sentence
      const sentences = sentence.sentences
      chapterString += `**${sentence.desc}**` + '\n\n'
      sentences.forEach(s => {
        chapterString += `\`${s.sContent}\`` + '\n' + s.sCn + '\n\n'
      })
      chapterString += '\n'
    }

    if (i === data.length - 1) fs.writeFileSync(path.join(resultFolderPath, `./Chapter ${chapterNum.toString().padStart(3, '0')}.md`), chapterString)
  })
}

/**
 * 删除所有的文件(将所有文件夹置空)
 * @param {*} filePath
 */
function emptyDir(filePath) {
  try {
    const files = fs.readdirSync(filePath) // 读取该文件夹
    files.forEach((file) => {
      const nextFilePath = `${filePath}/${file}`
      const states = fs.statSync(nextFilePath)
      if (states.isDirectory()) {
        emptyDir(nextFilePath)
      } else {
        fs.unlinkSync(nextFilePath)
        // console.log(`删除文件 ${nextFilePath} 成功`)
      }
    })
  } catch (error) {
    // console.log(error)
    return
  }
}

/**
 * 删除所有的空文件夹
 * @param {*} filePath
 */
function rmEmptyDir(filePath) {
  try {
    const files = fs.readdirSync(filePath)
    if (files.length === 0) {
      fs.rmdirSync(filePath)
      // console.log(`删除空文件夹 ${filePath} 成功`)
    } else {
      let tempFiles = 0
      files.forEach((file) => {
        tempFiles++
        const nextFilePath = `${filePath}/${file}`
        rmEmptyDir(nextFilePath)
      })
      //删除母文件夹下的所有字空文件夹后，将母文件夹也删除
      if (tempFiles === files.length) {
        fs.rmdirSync(filePath)
        // console.log(`删除空文件夹 ${filePath} 成功`)
      }
    }
  } catch (error) {
    // console.log(error)
    return
  }
}