const fs = require('fs')
const path = require('path')

// 读取文件内容
const filePath = path.join(__dirname, 'chapters.md')
const content = fs.readFileSync(filePath, 'utf8')

// 使用正则表达式按章节拆分内容，并包含章节标题
const chapters = content.split(/(?=# Chapter \d+)/).slice(1)

// 生成文件
chapters.forEach((chapter, index) => {
  // 提取章节标题
  const titleMatch = chapter.match(/# Chapter \d+/)
  if (titleMatch) {
    const title = titleMatch[0]
    const fileName = `${title.slice(9)}.md`
    const fileContent = chapter.replace(/# Chapter \d+/, '').trim()

    fs.writeFile(fileName, fileContent, (err) => {
      if (err) {
        console.error(`Error writing file ${fileName}:`, err)
      } else {
        console.log(`Successfully wrote file ${fileName}`)
      }
    })
  } else {
    console.error('Error: No chapter title found in chapter content:', chapter)
  }
})