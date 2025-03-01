const { SUB_TITLE } = require('./const')

/* -- 发音部分 -- */
/*
${SUB_TITLE.phone}

${SUB_TITLE.ukphone} /${word.ukphone}/
${SUB_TITLE.usphone} /${word.usphone}/*/
function parsePhone(word) {
  return `${SUB_TITLE.phone}

- ${SUB_TITLE.ukphone} \`/${word.ukphone}/\`
- ${SUB_TITLE.usphone} \`/${word.usphone}/\``
}

exports.parsePhone = parsePhone