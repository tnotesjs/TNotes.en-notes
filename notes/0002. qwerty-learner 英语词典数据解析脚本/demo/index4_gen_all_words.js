/**
 * index4_gen_all_words.js 这个脚本是 24.10.26 时基于 index4.js 编写的
 * 用于提取 sources 中的所有单词，将其汇总到 results 目录中。
 * en.0001 中的批处理脚本源码，其实就是这边搬运过去的。
 */

const fs = require('fs')
const path = require('path')

const SPACE_2 = '  ';
/**
 * 源目录名
 */
const SOURCE_FOLDER_NAME = 'sources'
/**
 * 目标目录名
 */
const RESULT_FOLDER_NAME = 'results'

const SUB_TITLE = {
  sentence: '例句',
  phone: '发音',
  usphone: '美',
  ukphone: '英',
  syno: '近义词',
  remMethod: '记忆',
  relWord: '同根词',
  phrase: '短语',
  trans: '词义',
}

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

  data.forEach((it, i) => {

    // if (i > 1000) return;
    // if (i > 1000) return;

    if (/[\s-=?()0123456789]/.test(it.headWord)) return;

    const word = it.content.word.content

    let wordStr =
        '- ' +
        it.headWord.replace(/\//g, '\\') +
        '\n' +
        parsePhone(word) +
        parseTrans(word) +
        parseRemMethod(word) +
        parseRelWord(word) +
        parseSyno(word) +
        parsePhrase(word) +
        parseSentence(word);

    fs.writeFileSync(path.join(resultsFolderPath, `./${it.headWord.replace(/\//g, '\\')}.md`), wordStr)
  })
}

/* -- 发音部分 -- */
function parsePhone(word) {
  return `${SPACE_2}- ${SUB_TITLE.phone}
${SPACE_2}${SPACE_2}- ${SUB_TITLE.ukphone} \`/${word.ukphone}/\`
${SPACE_2}${SPACE_2}- ${SUB_TITLE.usphone} \`/${word.usphone}/\`
`
}

/* -- 词义部分 -- */
function parseTrans(word) {
  let text = ''

  // 拼接词义
  if (word.trans && word.trans.length > 0) {
    const trans = word.trans
    for (let i = 0; i < trans.length; i++) {
      const t = trans[i]
      if (t.pos && t.tranCn) text += `${SPACE_2}${SPACE_2}- ${t.pos}. ${t.tranCn.replace(/\s/g, '')}\n`
      if (t.tranOther) text += `${SPACE_2}${SPACE_2}- \`${t.tranOther}\`\n`
    }
  }

  return `${SPACE_2}- ${SUB_TITLE.trans}
${text}`
}

/* -- 记忆部分 -- */
function parseRemMethod(word) {
  return (word.remMethod && word.remMethod.val) ? `${SPACE_2}- ${SUB_TITLE.remMethod}
${SPACE_2}${SPACE_2}- ${word.remMethod.val.trim()}
` : ''
}

/* -- 同根词部分 -- */
function parseRelWord(word) {
  let text = ''

  if (word.relWord && word.relWord.rels && word.relWord.rels.length > 0) {
    const rels = word.relWord.rels
    for (let i = 0; i < rels.length; i++) {
      const r = rels[i];
      text += `${SPACE_2}${SPACE_2}- ${r.pos}.\n`
      text += r.words.map(w => `${SPACE_2}${SPACE_2}${SPACE_2}- \`${w.hwd}\` ${w.tran.trim()}`).join('\n') + '\n'
    }
  }

  return text ? `${SPACE_2}- ${SUB_TITLE.relWord}
${text}` : ''
}

/* -- 同近词部分 -- */
function parseSyno(word) {
  let text = ''

  if (word.syno && word.syno.synos && word.syno.synos.length > 0) {
    const synos = word.syno.synos
    for (let i = 0; i < synos.length; i++) {
      const s = synos[i];
      text += `${SPACE_2}${SPACE_2}- ${s.pos}. ${s.tran}\n`
      text += s.hwds.map(h => `${SPACE_2}${SPACE_2}${SPACE_2}- \`${h.w}\``).join('\n') + '\n'
    }
  }

  return text ? `${SPACE_2}- ${SUB_TITLE.syno}
${text}` : ''
}

/* -- 短语部分 -- */
function parsePhrase(word) {
  let text = ''

  if (word.phrase && word.phrase.phrases) {
    const phrase = word.phrase
    const phrases = phrase.phrases
    phrases.forEach(p => {
      text += `${SPACE_2}${SPACE_2}- \`${p.pContent}\` ${p.pCn} \n`
    })
  }

  return text ? `${SPACE_2}- ${SUB_TITLE.phrase}
${text}` : ''
}

/* -- 例句部分 -- */
function parseSentence(word) {
  let text = ''

  if (word.sentence && word.sentence.sentences) {
    const sentence = word.sentence
    const sentences = sentence.sentences
    sentences.forEach(s => {
      text += `${SPACE_2}${SPACE_2}- \`${s.sContent}\`\n${SPACE_2}${SPACE_2}${SPACE_2}- ${s.sCn}` + '\n'
    })
  }

  return text ? `${SPACE_2}- ${SUB_TITLE.sentence}
${text}
` : ''
}

/* 章节自测列表 */
function generateChapterMD(all_words, result_folder_path) {
  let checkString = '';
  all_words.map((h, i) => {
    const chapterNum = Math.floor(i / 20 + 1);
    if (i % 20 === 0) return `\n# Chapter ${chapterNum.toString().padStart(3, '0')}\n\n` + `- [ ] ${h}\n`
    else return `- [ ] ${h}\n`
  }).forEach((w, i) => {
    const chapterNum = Math.floor(i / 20 + 1);
    checkString += w;
    if (chapterNum % 10 === 0 && i === chapterNum * 20 - 1) {
      fs.writeFileSync(path.join(result_folder_path, `./${(chapterNum - 9).toString().padStart(3, '0')}~${chapterNum.toString().padStart(3, '0')}.md`), checkString)
      checkString = '';
    }
    if (i === all_words.length - 1) {
      fs.writeFileSync(path.join(result_folder_path, `./${(Math.floor(chapterNum / 10) * 10 + 1).toString().padStart(3, '0')}~${chapterNum.toString().padStart(3, '0')}.md`), checkString)
      checkString = '';
    }
  });
}

function clearResultFolder(result_folder_path) {
  emptyDir(result_folder_path)
  rmEmptyDir(result_folder_path)
  fs.mkdirSync(result_folder_path)
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