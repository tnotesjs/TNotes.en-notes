const { SUB_TITLE } = require('./const')

/* -- 词义部分 -- */
/*
${SUB_TITLE.trans}

${trans[i]}. ${trans[i].tranCn}

`${trans[i].tranOther}`

*/
function parseTrans(word) {
  let text = ''

  // 拼接词义
  if (word.trans && word.trans.length > 0) {
    const trans = word.trans
    for (let i = 0; i < trans.length; i++) {
      const t = trans[i]
      if (t.pos && t.tranCn)
        text += `${t.pos}. ${t.tranCn.replace(/\s/g, '')}` + '\n'
      if (t.tranOther) text += `\`${t.tranOther}\``
      text += '\n\n'
    }
  }

  return `${SUB_TITLE.trans}

${text}`
}

exports.parseTrans = parseTrans;