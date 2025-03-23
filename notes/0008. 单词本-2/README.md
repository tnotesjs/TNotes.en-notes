# [0008. 单词本-2](https://github.com/Tdahuyou/TNotes.en-notes/tree/main/notes/0008.%20%E5%8D%95%E8%AF%8D%E6%9C%AC-2)

<!-- region:toc -->
- [1. ⚙️ EnWordList](#1-️-enwordlist)
- [2. ⏰ TODO - 新增逻辑 - 不存在词典中的内容，自动跳转到词库的新建界面。](#2--todo---新增逻辑---不存在词典中的内容自动跳转到词库的新建界面)
<!-- endregion:toc -->

## 1. ⚙️ EnWordList

<EnWordList :words="[
'police',
'restrict',
'serial',
'patrol',
'scalable',
'vector',
'graphics',
'moveto',
'lineto',
'horizontal',
'vertical',
'cubic',
'Bezier',
'curve',
'quadratic',
'elliptical',
'miter',
'bevel',
'cabbage',
'garlic',
'magenta',
'darkgreen',
'purify',
'populate',
'mutator',
'compose',
'decompose',
'cave',
'badge',
'represent',
'archive',
'dimension',
'accord',
'orientation',
'authentication',
'Cascade',
'course',
'enrollment',
'foreign',
'manipulation',
'runoob',
]"></EnWordList>

## 2. ⏰ TODO - 优化新增单词逻辑

- 检测单词是否存在于词库 `TNotes.en-words` 中
- 如果单词不存在于词库中，则自动跳转到词库的新建界面：
  - https://github.com/Tdahuyou/TNotes.en-words/new/main
