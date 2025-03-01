const SDK = require('@yuque/sdk')
const fs = require('fs').promises
const path = require('path')
const os = require('os')

const TOKEN = '9PQFEQQyBOkyVVXHB85iY3CZbd1tvGUo2VrTaMTq'
const NAMESPACE = 'huyouda/vue-vben-admin-v2.11.5'

;(async () => {
  try {
    // 读取文件内容
    const fileContent = await fs.readFile(
      path.join(__dirname, './all.md'),
      'utf8'
    )

    // 分割文件内容，按行读取，并反转顺序
    const titles = fileContent.split(os.EOL).reverse()

    // 初始化 SDK 客户端
    const client = new SDK({
      token: TOKEN,
    })

    // 获取 docs 接口
    const { docs } = client
    let count = 0

    // 遍历每一个 title 并上传
    for (const title of titles) {
      if (title.trim()) {  // 过滤空行
        count++
        try {
          await docs.create({
            namespace: NAMESPACE,
            data: { title: `📝 ${title}`, body: ` ` },
          })
          console.log(count, `${title} 成功上传到语雀`)
        } catch (err) {
          console.log(count, title, '创建失败')
          console.error(err)
        }
      }
    }
  } catch (err) {
    console.error('读取文件失败', err)
  }
})()
