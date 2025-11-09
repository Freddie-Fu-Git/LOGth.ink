---
title: 零代码+AI：实现博客热力图功能
published: 2025-11-09
description: '零代码+AI：实现博客热力图功能'
image: 'https://img-1300288738.cos.ap-beijing.myqcloud.com/PicGo_Home/202511092310953.webp'
tags: ['AI']
category: '学习'
draft: false
lang: 'zh-CN'
---

不得不感慨 AI 的快速发展，为我等零代码经验的小白带来了很大的便利。

事情是这样的，摸鱼时看到了 [Eallion](https://www.eallion.com/) 和 [伏枥](https://leehenry.top/) 两位大佬都给博客添加了热力图组件，心里痒痒，也想给自己的博客添加一个。Eallion 虽然撰写了相近的说明，但奈何大佬用的是 HUGO 框架，与我选择的 Astro 框架并不通用；伏枥大佬虽然与公开了 GitHub 仓库，并且使用的同样是 Astro 框架下的 Fuwari 主题，但对于零代码基础的我来说，仅靠阅读 GitHub 仓库中的代码就复现功能，简直难如登天。

于是我灵机一动，将 Eallion 大佬的教程链接和伏枥大佬的仓库链接，一同扔给了 Trae AI (没错，我电脑中甚至没有安装 VS Code) 请它帮我实现热力图的功能。

<img src="https://img-1300288738.cos.ap-beijing.myqcloud.com/PicGo_Home/202511092218387.png" alt="提出需求" style="height: 280px; display: block; margin: 0 auto; width: auto; max-width: 100%; object-fit: contain;" loading="lazy" />

很快，两百多行的代码就写好了，根据提示一路确认代码变更，并执行命令，发现预览并不如 Trae AI 自己所说实现了热力图的功能，而是出现了报错。

```
Your site is configured with trailingSlash set to always . Do you want to go to /archive/ instead?

See the documentation for trailingSlash if you need help.
```

继续将错误提醒粘贴给它，很快便做出了修改。继续确认预览，发现功能确实已经实现，但并不美观。于是继续对话进行细节上的修改。

<img src="https://img-1300288738.cos.ap-beijing.myqcloud.com/PicGo_Home/202511092224227.png" alt="修改细节" style="height: 280px; display: block; margin: 0 auto; width: auto; max-width: 100%; object-fit: contain;" loading="lazy" />

为保持与博客视觉风格统一，于是截图给它，并继续要求它参考“分类”与“标签”组件的标题样式进行修改。它便自行查阅起主题文件中关于“分类”及“标签”组件标题部分的代码，并进行了修改。

<img src="https://img-1300288738.cos.ap-beijing.myqcloud.com/PicGo_Home/202511092227715.png" alt="继续优化细节" style="height: 280px; display: block; margin: 0 auto; width: auto; max-width: 100%; object-fit: contain;" loading="lazy" />

经检查确认，AI 生成的热力图月份与该月份所对应的 1 日，并不处于同一列，于是继续沟通修改。

<img src="https://img-1300288738.cos.ap-beijing.myqcloud.com/PicGo_Home/202511092229820.png" alt="继续优化功能" style="height: 280px; display: block; margin: 0 auto; width: auto; max-width: 100%; object-fit: contain;" loading="lazy" />

修改后虽然实现了功能，但并不美观，于是细化对样式的要求。

<img src="https://img-1300288738.cos.ap-beijing.myqcloud.com/PicGo_Home/202511092232401.png" alt="继续优化细节" style="height: 280px; display: block; margin: 0 auto; width: auto; max-width: 100%; object-fit: contain;" loading="lazy" />

自此，月份部分调整完毕，开始调整星期的部分

<img src="https://img-1300288738.cos.ap-beijing.myqcloud.com/PicGo_Home/202511092233231.png" alt="开始喜欢星期部分的功能" style="height: 280px; display: block; margin: 0 auto; width: auto; max-width: 100%; object-fit: contain;" loading="lazy" />

根据个人习惯，继续要求它进行修改，将一周的起始设置为星期日。

<img src="https://img-1300288738.cos.ap-beijing.myqcloud.com/PicGo_Home/202511092234470.png" alt="继续优化功能" style="height: 280px; display: block; margin: 0 auto; width: auto; max-width: 100%; object-fit: contain;" loading="lazy" />

经检查日期排序逻辑正确，与日历对照正确，自此基础功能实现。但此时热力图位于整个组件的左侧，并不美观，于是继续优化。

<img src="https://img-1300288738.cos.ap-beijing.myqcloud.com/PicGo_Home/202511092238765.png" alt="调整热力图位置" style="height: 280px; display: block; margin: 0 auto; width: auto; max-width: 100%; object-fit: contain;" loading="lazy" />

与 Trae AI 明确了一下热力图中，每个格子深浅颜色的规则，并根据实际情况做了一些调整。按 AI 的规则，一天 7 篇文章，实在有些太水了。

<div style="display: flex; gap: 12px; align-items: flex-start; justify-content: center;">
  <img
    src="https://img-1300288738.cos.ap-beijing.myqcloud.com/PicGo_Home/202511092238765.png"
    alt="初始的规则"
    style="height: 280px; width: auto; max-width: 100%; object-fit: contain;"
    loading="lazy"
  />
  <img
    src="https://img-1300288738.cos.ap-beijing.myqcloud.com/PicGo_Home/202511092242175.png"
    alt="修改后的规则"
    style="height: 280px; width: auto; max-width: 100%; object-fit: contain;"
    loading="lazy"
  />
</div>

经检查发现，热力图的文字不会随主题的明暗变化而改变，于是勒令修改。

<img src="https://img-1300288738.cos.ap-beijing.myqcloud.com/PicGo_Home/202511092244177.png" alt="修改文字随主题色变化而变化" style="height: 280px; display: block; margin: 0 auto; width: auto; max-width: 100%; object-fit: contain;" loading="lazy" />

自此，在 PC 端上的功能基本实现。参考 Eallion 大佬对不同移动端的适配，进行测试。发现 AI 果然没有为热力图进行多端的适配，于是命令其添加该功能。

<img src="https://img-1300288738.cos.ap-beijing.myqcloud.com/PicGo_Home/202511092248203.png" alt="移动端适配" style="height: 280px; display: block; margin: 0 auto; width: auto; max-width: 100%; object-fit: contain;" loading="lazy" />

修改后，热力图在移动端的显示又跑到了组件的左侧，于是继续调整。中途因未知原因中断失败了一次，应该是我没有确认修改导致的，但紧接着又重新进行了修改。

<img src="https://img-1300288738.cos.ap-beijing.myqcloud.com/PicGo_Home/202511092251018.png" alt="调整移动端热力图位置" style="height: 280px; display: block; margin: 0 auto; width: auto; max-width: 100%; object-fit: contain;" loading="lazy" />

继续测试，发现移动端热力图会有上下移动的滚轴出现，于是继续命令其修改布局。

<img src="https://img-1300288738.cos.ap-beijing.myqcloud.com/PicGo_Home/202511092252147.png" alt="优化布局" style="height: 280px; display: block; margin: 0 auto; width: auto; max-width: 100%; object-fit: contain;" loading="lazy" />

发现在移动端，显示一周七天的缩写有些拥挤。于是继续调整，在移动端隔行显示星期，优化阅读体验。

<img src="https://img-1300288738.cos.ap-beijing.myqcloud.com/PicGo_Home/202511092255206.png" alt="继续优化阅读体验" style="height: 280px; display: block; margin: 0 auto; width: auto; max-width: 100%; object-fit: contain;" loading="lazy" />

自此，我能想到的功能，已完整实现，完全依靠 Trae AI，全程零代码。AI 时代下，我等零代码基础的文科生也拥有了利用代码实现一些想法的可能，或许在未来，我也会尝试成为 AI 的产品经理，利用 AI 做一些小产品，而不仅仅局限于博客的功能中。

## 效果展示

欢迎到我的[归档页面](https://www.logth.ink/archive/)查看效果

## 特别感谢

- Eallion 大佬的[教程](https://www.eallion.com/blog-heatmap/)
- 伏枥大佬的[仓库](https://github.com/LeeHero0803/leehenry-blog)

::github{repo="LeeHero0803/leehenry-blog"}

## 后记

没错，文章中所有图片等高且居中显示，也是我请 AI 协助，批量将 Markdown 格式的图片链接转化为 HTML 格式的。