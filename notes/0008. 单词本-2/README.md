# [0008. 单词本-2](https://github.com/Tdahuyou/TNotes.en-notes/tree/main/notes/0008.%20%E5%8D%95%E8%AF%8D%E6%9C%AC-2)

<!-- region:toc -->
- [1. ⚙️ EnWordList](#1-️-enwordlist)
- [2. ⏰ TODO - 优化新增单词逻辑](#2--todo---优化新增单词逻辑)
<!-- endregion:toc -->

## 1. ⚙️ EnWordList

<EnWordList :words="[
'accord',
'archive',
'authentication',
'badge',
'bevel',
'Bezier',
'cabbage',
'Cascade',
'cave',
'compose',
'course',
'cubic',
'curve',
'darkgreen',
'decompose',
'dimension',
'elliptical',
'enrollment',
'foreign',
'garlic',
'graphics',
'horizontal',
'lineto',
'magenta',
'manipulation',
'miter',
'moveto',
'mutator',
'orientation',
'patrol',
'police',
'populate',
'prose',
'purify',
'quadratic',
'represent',
'restrict',
'runoob',
'scalable',
'serial',
'sophisticated',
'vector',
'vertical',
]"></EnWordList>

## 2. ⏰ TODO - 优化新增单词逻辑

- 检测单词是否存在于词库 `TNotes.en-words` 中
- 如果单词不存在于词库中，则自动跳转到词库的新建界面：
  - https://github.com/Tdahuyou/TNotes.en-words/new/main
