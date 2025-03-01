const { SUB_TITLE } = require('./const')

/* -- 短语部分 -- */
/*
${SUB_TITLE.phrase}

*/
function parsePhrase(word) {
  let text = ''

  if (word.phrase && word.phrase.phrases) {
    const phrase = word.phrase
    const phrases = phrase.phrases
    phrases.forEach(p => {
      text += `- \`${p.pContent}\` ${p.pCn}` + '\n'
    })
  }

  return text ? `${SUB_TITLE.phrase}

${text}
` : ''
}

exports.parsePhrase = parsePhrase;