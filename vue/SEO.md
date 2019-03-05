## SEO
前端SEO
1. 网站结构布局优化
    扁平化结构
        控制首页链接数量 100个 页面导航 和 底部导航
    扁平化的目录层次
        3层结构 树形结构（尽量爬完整个网站）
    导航SEO优化
       导航上加上面包屑导航 
2. 网页代码优化
    <title> 标题
    <meta keywords> 关键词
    <meta description> 网页描述（关键字的扩展）
    语义化标签
        H1~H6标签用于标题
        ul标签多用于无序列表
        ol标签多用于有序列表
        dl标签用来定义数据列表
        em，strong表示强调
        <a> 需要加上title
        <h1> 正标题 副标题 <h2>
        <p> 段落内容
        表格加上 <caption>标题</caption>
        <img>  加上alt说明
        <strong><em> 强调内容
        重要内容html代码放在最前面 (爬虫上从上往下爬取)
        重要内容不要用JS输出
        尽量少使用iframe框架
        谨慎使用display:none （爬虫会忽略）
        不断精简代码