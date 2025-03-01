const { SUB_TITLE } = require('./const')

/* -- 同近词部分 -- */
/*
${SUB_TITLE.syno}

*/
function parseSyno(word) {
  let text = ''

  if (word.syno && word.syno.synos && word.syno.synos.length > 0) {
    const synos = word.syno.synos
    for (let i = 0; i < synos.length; i++) {
      const s = synos[i];
      const words = s.hwds.map(h => `\`${h.w}\``).join(' ')
      text += (`${s.pos}. ${s.tran}` + '\n' + words + '\n\n');
    }
  }

  return text ? `${SUB_TITLE.syno}

${text}` : ''
}

exports.parseSyno = parseSyno;