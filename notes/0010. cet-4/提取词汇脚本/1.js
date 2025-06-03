// 词汇数据从 qwerty learner 词典数据源中获取
import fs from 'fs'
let data = fs.readFileSync('./cet4.json', 'utf-8')
data = JSON.parse(data)
console.log(data.length)
for (let i = 0; i < data.length; i++) {
  const w = data[i]
  if ((i + 1) % 20 === 0)
    console.log(
      `]" />\n\n## 🎯 Chapter ${(i + 1) / 20 + 1}\n\n<EnWordList :words="[`
    )
  console.log("'" + w.content.word.wordHead + "',")
  // if ((i + 1) % 20 === 0) console.log(']" />')
}
