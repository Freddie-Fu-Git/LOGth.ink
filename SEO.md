# 搜索优化维护

页面地址统一以 `/` 结尾。站点地图入口为 `https://www.logth.ink/sitemap-index.xml`。

文章作者、标题、摘要、发布日期和修改日期来自文章元数据。Agent 不得为了让搜索引擎认为文章更新而改动日期。文章封面可用于搜索与分享图片。

每篇文章的摘要应准确说明主题与主要内容。不要为消除字数提示而堆砌关键词。首页和列表页分别使用对应的摘要，分页标题包含页码。

中英文通用页面使用双向 `hreflang`。文章没有可靠的译文关联字段，因此不自动猜测译文对应关系。

发布步骤：

1. 执行 `pnpm build`。
2. 执行 `pnpm seo:check`，检查生成页面、标准网址、文章结构化数据和站点地图。
3. 部署到生产环境。
4. 确认新页面和 `indexnow-key.txt` 已上线后，执行 `pnpm indexnow`。

`pnpm indexnow --dry-run` 只检查待提交的网址，不发送通知。IndexNow 命令提交当前地图中的网址；不要频繁重复提交。它不会自动在构建或预览时运行。HTTP 200/202 仅表示收到通知，不保证抓取、收录或排名。

Google 和 Bing 后台的收录与性能报告需分别检查。优先观察文章的标准网址、展示次数、点击次数和相关查询。外链应来自实际引用和相关内容，不购买或自动批量创建。

参考：

- [Google 文章结构化数据](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Google 搜索摘要说明](https://developers.google.com/search/docs/appearance/snippet)
- [IndexNow 协议](https://www.indexnow.org/documentation)
