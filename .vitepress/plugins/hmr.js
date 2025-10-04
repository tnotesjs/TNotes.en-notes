import { fileURLToPath } from 'url'
import fs from 'fs'
import path from 'path'
import {
  ROOT_DIR_PATH,
  ignore_dirs,
  REPO_NOTES_URL,
  NOTES_TOC_START_TAG,
  NOTES_TOC_END_TAG,
  BILIBILI_VIDEO_BASE_URL,
  TNOTES_YUQUE_BASE_URL,
  EOL,
  repoName,
} from '../tnotes/constants.js'
import { createAddNumberToTitle, generateToc } from '../tnotes/utils'

export default async function TN_HMR_Plugin() {
  return {
    name: 'tn-hmr-plugin',
    configureServer(server) {
      /**
       * 平均 3s 内只处理一次 hmr
       */
      const HANDLE_DURATION = 3 * 1000
      let lastHandleTime = Date.now()
      let isHmrEnable = true

      // 监听文件变化事件
      server.watcher.on('all', async (event, filePath) => {
        // /Users/huyouda/tnotesjs/TNotes.leetcode/notes/0002. xxx/README.md
        // console.log('path.basename(filePath)', path.basename(filePath))

        // console.log('Date.now()', Date.now())
        // console.log('lastUpdateTime', lastUpdateTime)
        // console.log('Date.now() - lastUpdateTime', Date.now() - lastUpdateTime)
        // console.log('最近两次更新的时间间隔：', Date.now() - lastHandleTime)
        // console.log('HRM 开关是否打开：', isHmrEnable)
        if (
          Date.now() - lastHandleTime < HANDLE_DURATION || // 如果最近两次更新的时间需要小于 UPDATE_TIMEOUT 阈值，直接 return
          !isHmrEnable // 如果 hmr 被禁用，直接 return
        ) {
          return
        }
        console.log('[hmr]', filePath)
        lastHandleTime = Date.now()
        isHmrEnable = false

        try {
          const basename = path.basename(filePath)
          const notesStats = await fs.promises.lstat(filePath)
          const notesDirName = path.basename(path.dirname(filePath))

          if (
            basename === 'README.md' &&
            notesStats.isFile() &&
            notesDirName.match(/^\d{4}.\s/) &&
            !ignore_dirs.includes(notesDirName)
          ) {
            const startTime = Date.now()
            // console.log(
            //   `⌛️ update start => ${notesDirName} => ${encodeURIComponent(
            //     filePath
            //   )}`
            // )
            let lines = await fs.promises.readFile(filePath, 'utf-8')
            lines = lines.split(EOL)
            // console.log('lines', lines)

            // update title ---------------------------------------------------------
            lines[0] = `# [${notesDirName}](${REPO_NOTES_URL}/${encodeURIComponent(
              notesDirName
            )})`

            // update toc -----------------------------------------------------------
            let startLineIdx = -1,
              endLineIdx = -1
            lines.forEach((line, idx) => {
              if (line.startsWith(NOTES_TOC_START_TAG)) startLineIdx = idx
              if (line.startsWith(NOTES_TOC_END_TAG)) endLineIdx = idx
            })
            if (startLineIdx !== -1 && endLineIdx !== -1) {
              const notesID = notesDirName.slice(0, 4)
              const titles = []
              const headers = ['## ', '### ', '#### ', '##### ', '###### '] // 2~6 级标题，忽略 1 级标题。
              const addNumberToTitle = createAddNumberToTitle()
              for (let i = 0; i < lines.length; i++) {
                const line = lines[i]
                const isHeader = headers.some((header) =>
                  line.startsWith(header)
                )
                if (isHeader) {
                  const [numberedTitle] = addNumberToTitle(line)
                  titles.push(numberedTitle)
                  lines[i] = numberedTitle // 更新原行内容
                }
              }
              const toc = generateToc(titles, 2)
              let bilibiliTOCItems = []
              let tnotesTOCItems = []
              let yuqueTOCItems = []
              const configPath = path.resolve(
                path.dirname(filePath),
                '.tnotes.json'
              )
              let notesConfig = await fs.promises.readFile(configPath, 'utf8')
              notesConfig = JSON.parse(notesConfig)
              if (notesConfig) {
                if (notesConfig.bilibili.length > 0) {
                  bilibiliTOCItems = notesConfig.bilibili.map(
                    (bvid, i) =>
                      `  - [bilibili.${repoName}.${notesID}.${i + 1}](${
                        BILIBILI_VIDEO_BASE_URL + bvid
                      })`
                  )
                }
                if (notesConfig.tnotes.length > 0) {
                  tnotesTOCItems = notesConfig.tnotes.map(
                    ([tnotesName, notesID, notesName], i) =>
                      `  - [TNotes.${tnotesName} - ${notesID}](${
                        `https://tnotesjs.github.io/TNotes.${tnotesName}/notes/` +
                        notesID +
                        (notesName
                          ? `%20.${encodeURIComponent(notesName)}/README`
                          : '')
                      })`
                  )
                }
                if (notesConfig.yuque.length > 0) {
                  yuqueTOCItems = notesConfig.yuque.map(
                    (slug, i) =>
                      `  - [TNotes.yuque.${repoName.replace(
                        'TNotes.',
                        ''
                      )}.${notesID}](${TNOTES_YUQUE_BASE_URL + slug})`
                  )
                }
              }

              const insertTocItems = []

              if (bilibiliTOCItems.length > 0) {
                insertTocItems.push(
                  `- [📺 bilibili 👉 TNotes 合集](https://space.bilibili.com/407241004)`,
                  ...bilibiliTOCItems
                )
              }

              if (tnotesTOCItems.length > 0) {
                insertTocItems.push(
                  `- [📒 TNotes](https://tnotesjs.github.io/TNotes/)`,
                  ...tnotesTOCItems
                )
              }

              if (yuqueTOCItems.length > 0) {
                insertTocItems.push(
                  `- [📂 TNotes.yuque](${TNOTES_YUQUE_BASE_URL})`,
                  ...yuqueTOCItems
                )
              }

              lines.splice(
                startLineIdx + 1,
                endLineIdx - startLineIdx - 1,
                '',
                ...insertTocItems,
                ...toc.replace(new RegExp(`^${EOL}`), '').split(EOL)
              )
            }

            // 写入前标记

            await fs.promises.writeFile(filePath, lines.join(EOL))

            // console.log(
            //   `✅ update end => ${notesDirName} => ${encodeURIComponent(
            //     filePath
            //   )}`
            // )
            console.log(`🚀 ${Date.now() - startTime} ms`)
          }
        } catch (err) {
          if (
            event !== 'unlinkDir' &&
            !['ENOENT', 'ENOTDIR'].includes(err.code)
          ) {
            console.log('❌ tn hmr error', err)
          }
        } finally {
          isHmrEnable = true
        }
      })
    },
  }
}
