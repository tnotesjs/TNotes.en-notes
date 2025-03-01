const { SUB_TITLE } = require('./const')

/* -- 记忆部分 -- */
/*
${SUB_TITLE.remMethod}

*/
function parseRemMethod(word) {
  return (word.remMethod && word.remMethod.val) ? `${SUB_TITLE.remMethod}

${word.remMethod.val.trim()}

` : ''
}

exports.parseRemMethod = parseRemMethod;