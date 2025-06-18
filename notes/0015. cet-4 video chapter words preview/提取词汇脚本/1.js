// 词汇数据从 qwerty learner 词典数据源中获取
const fs = require('fs')
const path = require('path')

// data from => https://github.com/kajweb/dict/blob/master/book/1521164643060_CET4_3.zip
let data = fs.readFileSync('./cet4.json', 'utf-8')
data = JSON.parse(data)
// console.log(data.length) // => 2607

/*
 * 排版规则：
 * 1. 每 20 个词汇视作一个 Chapter
 * 2. 每两个 Chapter 视作一个 🎯
 * 3. 每个 🎯 下都有 40 个词汇，每 10 个词汇排一列，一共 4 列
 * 4. 每列的宽度是该列最长的词汇加 5 个空格填充
 *
 * output example:
 *
 * - 🎯 Chapter 1～2
 *
 * 1 cancel         11 pretend        21 possess        31 fashionable
 * 2 explosive      12 kettle         22 competent      32 devise
 * 3 numerous       13 wreck          23 investment     33 apparent
 * 4 govern         14 drunk          24 neutral        34 journalist
 * 5 analyse        15 calculate      25 scratch        35 exposure
 * 6 discourage     16 persistent     26 optional       36 temper
 * 7 resemble       17 sake           27 require        37 protective
 * 8 remote         18 conceal        28 circular       38 sideways
 * 9 salary         19 audience       29 analysis       39 multicultural
 * 10 pollution     20 meanwhile      30 click          40 object
 *
 * - 🎯 Chapter n～n+1
 *
 * 20*(n-1) + 1 xxx ~ 20*n xxx */
function getVideoChapterWordsPreview() {
  let output = ''
  // 每40个词汇组成一个🎯（两个Chapter）
  for (let i = 0; i < data.length; i += 40) {
    const chunk = data.slice(i, i + 40)
    if (chunk.length === 0) continue

    // 计算当前🎯的Chapter范围
    const startChapter = Math.floor(i / 20) + 1
    const endChapter = startChapter + 1
    output += `- 🎯 Chapter ${startChapter}～${endChapter}\n\n\`\`\`txt\n`

    // 分成4列（每列10个词汇）
    const columns = [[], [], [], []]
    const colMaxLengths = [0, 0, 0, 0]

    // 填充列数据并计算每列最大长度
    chunk.forEach((w, idx) => {
      const word = w.content.word.wordHead
      const colIndex = Math.floor(idx / 10)
      columns[colIndex].push(word)
      if (word.length > colMaxLengths[colIndex]) {
        colMaxLengths[colIndex] = word.length
      }
    })

    // 生成每行输出（共10行）
    for (let row = 0; row < 10; row++) {
      let line = ''
      for (let col = 0; col < 4; col++) {
        const word = columns[col][row] || ''
        const padding = ' '.repeat(colMaxLengths[col] - word.length + 5)
        const globalIndex = i + col * 10 + row + 1

        // 只输出有词汇的行
        if (word) {
          line += `${globalIndex} ${word}${padding}`
        }
      }
      output += line + '\n'
    }
    output += '```\n\n' // 🎯块间空行
  }
  // console.log(output)
  fs.writeFileSync(path.join(`./video_preview.md`), output)
}
getVideoChapterWordsPreview()

function genEnWordListTemplate() {
  let output = ''
  for (let i = 0; i < data.length; i++) {
    const w = data[i]
    if (i % 20 === 0) {
      output += `]" />\n\n## 🎯 Chapter ${
        i / 20 + 1
      }\n\n<EnWordList :words="[\n`
    }
    // console.log("'" + w.content.word.wordHead + "',")
    output += `'${w.content.word.wordHead}',\n`
  }
  console.log(output)
  // output example:
  /*
## 🎯 Chapter 127

<EnWordList :words="[
'magic',
'argument',
'reveal',
'data',
'theoretical',
'adequate',
'utter',
'onion',
'vibrate',
'drum',
'sausage',
'hopeful',
'tremendous',
'condense',
'barrier',
'realistic',
'justice',
'create',
'criminal',
'tag',
]" />

## 🎯 Chapter 128

<EnWordList :words="[
'notebook',
'curious',
'indirect',
'individual',
'resource',
'ugly',
'nuisance',
'tax',
'earthquake',
'excitement',
'nightmare',
'cord',
'ending',
'core',
'council',
'enforce',
'embassy',
'departure',
'dash',
'concrete',
]" />
*/
}
