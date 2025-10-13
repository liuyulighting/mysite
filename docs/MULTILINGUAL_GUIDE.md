# 多语言文本管理指南

## 📋 概述

本项目支持多语言文本管理，包括中文（zh）、英文（en）和日文（ja）。文本内容通过JSON文件管理，支持动态切换和实时更新。

## 🗂️ 文件结构

```
i18n/
├── zh.json          # 中文文本
├── en.json          # 英文文本
└── ja.json          # 日文文本

data/
└── profile.json     # 游戏仪表板数据（包含多语言字段）

js/
└── i18n.js          # 多语言处理脚本
```

## 🔧 如何修改文本内容

### 1. 修改现有文本

#### 方法一：直接编辑JSON文件

**编辑 `i18n/zh.json`（中文）：**
```json
{
  "profile": {
    "name": "刘禹",
    "role": "产品经理",
    "location": "中国南京"
  }
}
```

**编辑 `i18n/en.json`（英文）：**
```json
{
  "profile": {
    "name": "Yu Liu",
    "role": "Product Manager", 
    "location": "Nanjing, China"
  }
}
```

#### 方法二：修改游戏仪表板数据

**编辑 `data/profile.json`：**
```json
{
  "profile": {
    "name": "Yu Liu",
    "nameZh": "刘禹",
    "title": "Product Manager",
    "titleZh": "产品经理"
  }
}
```

### 2. 添加新的文本内容

#### 在i18n文件中添加：

**1. 在 `i18n/zh.json` 中添加：**
```json
{
  "newSection": {
    "title": "新标题",
    "description": "新描述"
  }
}
```

**2. 在 `i18n/en.json` 中添加对应英文：**
```json
{
  "newSection": {
    "title": "New Title",
    "description": "New Description"
  }
}
```

**3. 在 `i18n/ja.json` 中添加对应日文：**
```json
{
  "newSection": {
    "title": "新しいタイトル",
    "description": "新しい説明"
  }
}
```

### 3. 删除文本内容

**删除步骤：**
1. 从所有语言文件中删除对应的键值对
2. 从HTML中删除使用该文本的元素或更新其 `data-i18n` 属性
3. 确保没有其他地方引用该文本

## 🎮 游戏仪表板文本管理

### 1. 修改个人信息

**编辑 `data/profile.json` 中的 `profile` 部分：**
```json
{
  "profile": {
    "name": "Your Name",
    "nameZh": "您的姓名",
    "title": "Your Title",
    "titleZh": "您的职位",
    "location": "Your Location",
    "locationZh": "您的位置",
    "email": "your.email@example.com",
    "phone": "+86 138-0000-0000"
  }
}
```

### 2. 修改项目经验

**编辑 `experience` 部分：**
```json
{
  "experience": {
    "d5": {
      "team-edition": [
        {
          "title": "Your Achievement",
          "titleZh": "您的成就",
          "desc": "Your description",
          "descZh": "您的描述",
          "badges": ["Badge 1", "Badge 2"],
          "metrics": [
            {"label": "Metric", "value": "100", "unit": "Unit"}
          ]
        }
      ]
    }
  }
}
```

### 3. 修改项目轮播

**在HTML中修改项目信息：**
```html
<div class="project-slide" data-link="https://your-project.com" data-bg="linear-gradient(135deg, #color1 0%, #color2 100%)">
    <div class="project-icon">🎯</div>
    <div class="project-title">项目标题</div>
    <div class="project-desc">项目描述</div>
</div>
```

## 🌐 HTML中的多语言使用

### 1. 基本用法

**在HTML元素上添加 `data-i18n` 属性：**
```html
<h1 data-i18n="profile.name">默认文本</h1>
<p data-i18n="profile.role">默认文本</p>
```

### 2. 作用域用法

**使用 `data-i18n-scope` 定义作用域：**
```html
<div data-i18n-scope="profile">
    <h1 data-i18n="name">默认文本</h1>
    <p data-i18n="role">默认文本</p>
</div>
```

### 3. 属性翻译

**翻译HTML属性：**
```html
<img data-i18n="image.alt" data-i18n-attrs="alt" src="image.jpg" alt="默认alt文本">
<a data-i18n="link.title" data-i18n-attrs="title" href="#" title="默认title">链接</a>
```

### 4. HTML内容翻译

**翻译包含HTML标签的内容：**
```html
<div data-i18n="content.html" data-i18n-html="true">默认HTML内容</div>
```

## 🔄 语言切换

### 1. 程序化切换

**在JavaScript中切换语言：**
```javascript
import { setLanguage } from './js/i18n.js';

// 切换到中文
await setLanguage('zh');

// 切换到英文
await setLanguage('en');

// 切换到日文
await setLanguage('ja');
```

### 2. 获取当前语言

```javascript
import { getCurrentLanguage } from './js/i18n.js';

const currentLang = getCurrentLanguage();
console.log(currentLang); // 'zh', 'en', 或 'ja'
```

### 3. 获取翻译文本

```javascript
import { t } from './js/i18n.js';

const text = t('profile.name', '默认文本');
console.log(text); // 当前语言的翻译文本
```

## 📝 最佳实践

### 1. 命名规范

- 使用小写字母和点号分隔：`section.subsection.key`
- 使用有意义的键名：`profile.name` 而不是 `p.n`
- 保持键名一致性：所有语言文件使用相同的键结构

### 2. 文本组织

- 按功能模块组织：`nav`, `profile`, `projects` 等
- 使用嵌套结构：`profile.name`, `profile.role`
- 避免过深的嵌套：最多3-4层

### 3. 默认值处理

- 总是提供默认文本作为后备
- 使用有意义的默认值，而不是占位符
- 在HTML中提供默认文本

### 4. 特殊字符处理

- 使用UTF-8编码保存文件
- 正确转义特殊字符：`"` → `\"`
- 注意不同语言的标点符号差异

## 🚀 实时更新

### 1. 开发环境

**修改文本后刷新页面即可看到效果：**
```bash
# 启动开发服务器
python3 -m http.server 8080

# 访问页面
open http://localhost:8080/game-dashboard.html
```

### 2. 生产环境

**修改后需要重新部署到GitHub Pages：**
```bash
git add .
git commit -m "Update multilingual content"
git push origin main
```

## 🔍 调试技巧

### 1. 检查翻译键

**在浏览器控制台中：**
```javascript
// 检查当前语言
console.log(getCurrentLanguage());

// 检查翻译文本
console.log(t('profile.name'));

// 检查所有翻译
console.log(currentDict);
```

### 2. 常见问题

- **文本不显示**：检查 `data-i18n` 属性是否正确
- **翻译缺失**：检查JSON文件是否包含对应键
- **语言不切换**：检查语言代码是否正确（zh/en/ja）

### 3. 验证工具

**使用在线JSON验证器检查文件格式：**
- [JSONLint](https://jsonlint.com/)
- [JSON Formatter](https://jsonformatter.curiousconcept.com/)

## 📚 示例：完整的多语言文本修改

### 1. 添加新的联系信息

**在 `i18n/zh.json` 中：**
```json
{
  "contact": {
    "email": "📧 liuyulighting@gmail.com",
    "phone": "📱 +86 18069860189",
    "website": "🌐 liuyulighting.github.io"
  }
}
```

**在 `i18n/en.json` 中：**
```json
{
  "contact": {
    "email": "📧 liuyulighting@gmail.com",
    "phone": "📱 +86 18069860189", 
    "website": "🌐 liuyulighting.github.io"
  }
}
```

**在HTML中使用：**
```html
<div class="contact-item">
    <div class="contact-label" data-i18n="contact.email">📧 Email</div>
    <div class="contact-value">liuyulighting@gmail.com</div>
</div>
```

### 2. 修改项目描述

**在 `data/profile.json` 中：**
```json
{
  "experience": {
    "d5": {
      "team-edition": [
        {
          "title": "D5 Team Edition Launch",
          "titleZh": "D5团队版发布",
          "desc": "Led the complete product development lifecycle from concept to market launch",
          "descZh": "主导从概念到市场发布的完整产品开发生命周期"
        }
      ]
    }
  }
}
```

这样，您就可以轻松地管理项目中的多语言文本内容了！
