const fs = require('fs')
const https = require('https')
const http = require('http')
const path = require('path')

// 图片 URL 列表
const imageUrls = [
  // 'url1',
  // 'url2',
  // 'url3',
]

// 确保 assets 目录存在
const assetsDir = path.join(__dirname, 'assets')
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir)
}

// 下载单个文件的函数
function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createWriteStream(filePath)

    // 根据 URL 协议选择 http 或 https 模块
    const protocol = url.startsWith('https') ? https : http

    // 定义请求头，模拟浏览器行为
    const options = {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        // Referer: 'https://www.example.com', // 替换为实际的 Referer，或者留空
      },
    }

    protocol
      .get(url, options, (response) => {
        if (response.statusCode !== 200) {
          // 如果响应状态码不是 200，抛出错误
          fileStream.close()
          fs.unlinkSync(filePath) // 删除部分下载的文件
          reject(
            new Error(
              `Failed to get '${url}' (Status Code: ${response.statusCode})`
            )
          )
          return
        }

        response.pipe(fileStream)
        fileStream.on('finish', () => {
          fileStream.close()
          console.log(`Downloaded: ${filePath}`)
          resolve()
        })
      })
      .on('error', (err) => {
        fileStream.close()
        fs.unlinkSync(filePath) // 删除部分下载的文件
        console.error(`Failed to download ${url}: ${err.message}`)
        reject(err)
      })
  })
}

// 主函数：下载所有图片
async function downloadImages() {
  try {
    for (const url of imageUrls) {
      const fileName = url.split('/').pop() // 提取最后一部分作为文件名
      const filePath = path.join(assetsDir, fileName)
      await downloadFile(url, filePath)
    }
    console.log('All images have been downloaded successfully.')
  } catch (error) {
    console.error('Error occurred during downloading:', error)
  }
}

// 执行主函数
downloadImages()
