# [0009. 单词本概述](https://github.com/tnotesjs/TNotes.en-notes/tree/main/notes/0009.%20%E5%8D%95%E8%AF%8D%E6%9C%AC%E6%A6%82%E8%BF%B0)

<!-- region:toc -->

- [1. 概述](#1-概述)

<!-- endregion:toc -->

## 1. 概述

- 每个单词本存储 100 个词。
- 使用自定义的 `WordList.vue` 组件，完成单词本中词汇列表的渲染。
- 按照字母升序排序
- 自动生成编号
- 实现 checkbox 缓，以便临时自测。

::: details checkbox 缓存实现方案

将 checkout 状态存储在 local storage 中，以 pathname 和 word 拼接作为索引 key。

:::
