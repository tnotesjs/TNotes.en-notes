// 词汇数据从 qwerty learner 词典数据源中获取
const fs = require('fs')
const path = require('path')

// data from => https://github.com/kajweb/dict/blob/master/book/1521164643060_CET4_3.zip
let data = fs.readFileSync('./cet4.json', 'utf-8')
data = JSON.parse(data)
// console.log(data.length) // => 2607

genEnWordListTemplate()

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
