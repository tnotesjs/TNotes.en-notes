# [0013. fish-speech tts 体验](https://github.com/tnotesjs/TNotes.en-notes/tree/main/notes/0013.%20fish-speech%20tts%20%E4%BD%93%E9%AA%8C)

<!-- region:toc -->

::: details 📚 相关资源

- [📂 TNotes.yuque（笔记附件资源）](https://www.yuque.com/tdahuyou/tnotes.yuque/)
  - [TNotes.yuque.en-notes.0013](https://www.yuque.com/tdahuyou/tnotes.yuque/en-notes.0013)

:::

- [1. 概述](#1-概述)
- [2. 免费方案 - fish-speech tts 体验](#2-免费方案---fish-speech-tts-体验)
- [3. 收费方案评价](#3-收费方案评价)

<!-- endregion:toc -->

## 1. 概述

- `25.06` 在找 tts 解决方案，了解了一些免费和付费的方案。
- 免费方案：
  - tts maker
    - https://ttsmaker.com/
      - 国际
    - https://ttsmaker.cn/
      - 国内
  - github 开源项目，比如：
    - fish-speech - https://github.com/fishaudio/fish-speech
    - TTS - https://github.com/coqui-ai/TTS
- 收费方案：
  - 字节的火山引擎 tts 服务
    - https://www.volcengine.com/product/tts
  - 阿里的阿里云 tts 服务
    - https://ai.aliyun.com/nls/tts

## 2. 免费方案 - fish-speech tts 体验

- fish-speech - https://github.com/fishaudio/fish-speech
  - 在本地成功部署了，并体验了 `openaudio-s1-mini` 模型的效果，上传了个人的音频作为克隆样本，就 `mini` 模型而言，感觉克隆效果还是蛮不错的。
  - 环境准备好之后，以 `webui` 的形式在本地跑 `openaudio-s1-mini` 模型。
  - 更大的模型就带不动了，尚未体验过。
- 基本流程：
  - 克隆项目到本地 `git clone https://github.com/fishaudio/fish-speech.git`
  - 安装依赖
  - 上 Hugging Face 下载 mini 模型相关的文件丢到项目根目录下的 `checkpoints/openaudio-s1-mini` 下。
    - https://huggingface.co/fishaudio/openaudio-s1-mini/tree/main
    - ![图 2](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-06-08-19-18-36.png)
  - 启动 webui `python tools/run_webui.py`
- 环境：
  - 环境用的是阿里云主机，显卡是 `2080 Ti`。
  - ![图 1](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-06-08-19-07-09.png)
  - 这已经是当前能选择的个人云主机最高配了。
- 速度：
  - 转换速度测试下来是 500 字符，3min 左右。
    - 如果没有 GPU，用 CPU 去跑的话，更慢 ……
    - 在启动 webui 的时候可以通过终端日志看到是否用的是 cpu。
  - 这速度确实接受不了，如果要把当前需要转的几十万字符去转为音频，压根儿就等不了。
  - 当识别的字符数达到 5k 左右的时候，运行出现了异常。
- `TNotes.yuque`
  - 输出的一些测试音频啥的记录在了 `TNotes.yuque` 上。
  - 如有需要，可以去预览一下当时上传的克隆测试音频，以及使用 `mini` 模型转换文本后得到的识别结果。
  - ![图 3](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-06-08-19-22-19.png)

## 3. 收费方案评价

- 以字节的 tts 服务为例：（因为从听感上来看，感觉豆包的语音更好一些）
- https://www.volcengine.com/product/tts
- ![图 0](https://cdn.jsdelivr.net/gh/tnotesjs/imgs@main/2025-06-08-18-57-33.png)
- 最便宜的 10w 字符需要 36 元，就 en-notes.0012 中要转换的字符就 20w↑ 了，单是 QWERTY Learner 的 CET-4 的识别需求估计就得破百了。
- 果断放弃……
- 其他厂家的收费标准也就没必要去细看了，估计都差不太多，要么就是费用接受不了，要么就是音质接受不了。
