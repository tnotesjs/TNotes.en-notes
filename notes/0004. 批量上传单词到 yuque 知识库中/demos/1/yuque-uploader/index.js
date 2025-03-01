const SDK = require('@yuque/sdk')
const fs = require('fs').promises
const path = require('path')

const TOKEN = 'iEiHzFKVk5ZTEntnyq7vgKPBRr3j4JrWX9VS9KCo'
const NAMESPACE = 'huyouda/en'

;(async () => {
  const client = new SDK({
    token: TOKEN,
  })

  // apis
  const { docs } = client

  const filesDir = './files'
  const fileNames = await fs.readdir(filesDir)
  let count = 0

  for (const fileName of fileNames.slice().reverse()) {
    // 只处理以 .md 为后缀的文件
    if (fileName.endsWith('.md')) {
      // 提取文件名作为title和slug
      const title = path.basename(fileName, '.md').trim()
      const slug = title

      count++

      await docs
        .get({
          namespace: NAMESPACE,
          slug,
        })
        .then(() => {
          console.log(count, slug, '文档已存在，跳过上传')
        })
        .catch(async (err) => {
          // console.log(count, title, '获取文档失败', err)
          if (err.status === 404) {
            const filePath = path.join(filesDir, fileName)
            const fileContent = await fs.readFile(filePath, 'utf8')
            await docs
              .create({
                namespace: NAMESPACE,
                data: { title: `${title}`, slug, body: fileContent },
              })
              .catch((err) => {
                console.log(count, title, '创建失败')
                console.error(err)
              })
            console.log(count, `${fileName} 成功上传到语雀`)
          }
        })
    }
  }
})()
