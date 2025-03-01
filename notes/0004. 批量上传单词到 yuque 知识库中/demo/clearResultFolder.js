const fs = require('fs')

function clearResultFolder(result_folder_path) {
  emptyDir(result_folder_path)
  rmEmptyDir(result_folder_path)
  fs.mkdirSync(result_folder_path)
}

/**
 * 删除所有的文件(将所有文件夹置空)
 * @param {*} filePath
 */
function emptyDir(filePath) {
  try {
    const files = fs.readdirSync(filePath) // 读取该文件夹
    files.forEach((file) => {
      const nextFilePath = `${filePath}/${file}`
      const states = fs.statSync(nextFilePath)
      if (states.isDirectory()) {
        emptyDir(nextFilePath)
      } else {
        fs.unlinkSync(nextFilePath)
        // console.log(`删除文件 ${nextFilePath} 成功`)
      }
    })
  } catch (error) {
    // console.log(error)
    return
  }
}

/**
 * 删除所有的空文件夹
 * @param {*} filePath
 */
function rmEmptyDir(filePath) {
  try {
    const files = fs.readdirSync(filePath)
    if (files.length === 0) {
      fs.rmdirSync(filePath)
      // console.log(`删除空文件夹 ${filePath} 成功`)
    } else {
      let tempFiles = 0
      files.forEach((file) => {
        tempFiles++
        const nextFilePath = `${filePath}/${file}`
        rmEmptyDir(nextFilePath)
      })
      //删除母文件夹下的所有字空文件夹后，将母文件夹也删除
      if (tempFiles === files.length) {
        fs.rmdirSync(filePath)
        // console.log(`删除空文件夹 ${filePath} 成功`)
      }
    }
  } catch (error) {
    // console.log(error)
    return
  }
}

exports.clearResultFolder = clearResultFolder