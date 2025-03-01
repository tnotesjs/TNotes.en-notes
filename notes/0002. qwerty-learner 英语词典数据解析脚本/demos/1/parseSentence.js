const { SUB_TITLE } = require('./const')

/* -- 例句部分 -- */
/*
${SUB_TITLE.sentence}

*/
function parseSentence(word) {
  let text = ''

  if (word.sentence && word.sentence.sentences) {
    const sentence = word.sentence
    const sentences = sentence.sentences
    sentences.forEach(s => {
      text += `${s.sContent}` + '\n' + s.sCn + '\n\n'
    })
  }

  return text ? `${SUB_TITLE.sentence}

${text}
` : ''
}

exports.parseSentence = parseSentence;