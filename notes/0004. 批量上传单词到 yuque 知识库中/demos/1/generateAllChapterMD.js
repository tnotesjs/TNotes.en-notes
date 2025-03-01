const fs = require('fs')
const path = require('path')

/* 章节自测列表 */
function generateAllChapterMD(all_words, result_file) {
  let checkString = '';
  all_words.map((h, i) => {
    const chapterNum = Math.floor(i / 20 + 1);
    if (i % 20 === 0) return `\n# Chapter ${chapterNum.toString().padStart(3, '0')}\n\n` + `- [ ] ${h}\n`
    else return `- [ ] ${h}\n`
  }).forEach((w, i) => {
    checkString += w;
    if (i === all_words.length - 1) {
      fs.writeFileSync(result_file, checkString)
      checkString = '';
    }
  });
}

exports.generateAllChapterMD = generateAllChapterMD