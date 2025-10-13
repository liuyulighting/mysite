# 游戏仪表板文本编辑器使用指南

## 🎯 问题解决

您发现的问题已经解决！现在 `game-text-editor.html` 专门用于管理游戏仪表板界面中的所有文本内容，与 `game-dashboard.js` 完全集成。

## 🚀 快速开始

### 1. 访问游戏文本编辑器

```
http://localhost:8080/game-text-editor.html
```

### 2. 编辑文本内容

编辑器会自动加载 `data/profile.json` 中的数据，并转换为游戏界面使用的文本格式。

## 📝 文本分类

### 1. **个人信息** 👤
- `name`: 姓名
- `title`: 职位
- `location`: 位置
- `email`: 邮箱
- `phone`: 电话

### 2. **游戏卡带** 🎮
- `d5`: D5渲染器
- `kujiale`: 酷家乐
- `projects`: 个人项目

### 3. **标签页** 📑
- `skills`: 技能
- `achievements`: 成就
- `education`: 教育

### 4. **项目轮播** 🎯
- `d5Title` / `d5Desc`: D5项目标题和描述
- `kujialeTitle` / `kujialeDesc`: 酷家乐项目标题和描述
- `officeTitle` / `officeDesc`: 公装项目标题和描述
- `diverseshotTitle` / `diverseshotDesc`: DiverseShot项目标题和描述

### 5. **界面文本** 🖥️
- `start` / `exit`: 开始/退出按钮
- `welcome` / `welcomeDesc`: 欢迎消息
- `cartridge` / `level` / `cards`: 状态指示器

## 🔧 使用方法

### 方法一：Web编辑器（推荐）

1. **打开编辑器**：访问 `game-text-editor.html`
2. **编辑文本**：直接在输入框中修改文本内容
3. **实时预览**：修改后立即在游戏界面中生效
4. **保存更改**：点击"💾 保存所有文件"按钮

### 方法二：直接编辑数据文件

编辑 `data/profile.json` 文件：

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

## 🌐 多语言支持

### 支持的语言
- 🇨🇳 **中文 (zh)**: 默认语言
- 🇺🇸 **英文 (en)**: 英文版本
- 🇯🇵 **日文 (ja)**: 日文版本

### 语言切换
游戏仪表板目前默认使用中文，如需切换语言，可以修改 `game-dashboard.js` 中的 `currentLanguage` 属性：

```javascript
this.currentLanguage = 'en'; // 切换到英文
this.currentLanguage = 'ja'; // 切换到日文
```

## 📱 实际应用示例

### 示例1：修改个人信息

**在编辑器中：**
1. 找到"个人信息"分组
2. 修改 `name` 字段：`刘禹` → `您的姓名`
3. 修改 `title` 字段：`产品经理` → `您的职位`
4. 点击保存

**效果：**
- 游戏界面中的个人信息立即更新
- 所有相关文本同步更改

### 示例2：更新项目描述

**在编辑器中：**
1. 找到"项目轮播"分组
2. 修改 `d5Title`：`D5 渲染器团队版` → `新的项目标题`
3. 修改 `d5Desc`：更新项目描述
4. 点击保存

**效果：**
- 项目轮播中的标题和描述立即更新
- 点击项目时显示新的内容

### 示例3：添加新的文本内容

**在编辑器中：**
1. 点击"➕ 添加新文本"
2. 输入分组名：`newSection`
3. 输入键名：`newKey`
4. 分别输入三种语言的文本
5. 点击保存

**在代码中使用：**
```javascript
const newText = this.getText('newSection.newKey');
```

## 🔄 数据流程

```
data/profile.json → game-text-editor.html → 编辑 → 保存 → game-dashboard.js → 界面更新
```

1. **加载**：编辑器从 `profile.json` 加载数据
2. **转换**：将数据转换为游戏文本格式
3. **编辑**：用户修改文本内容
4. **保存**：将修改保存回 `profile.json`
5. **应用**：游戏界面自动使用新文本

## 🛠️ 技术实现

### 1. 数据转换

```javascript
// 将profile数据转换为游戏文本格式
convertProfileToGameText(profileData) {
  return {
    zh: { /* 中文文本 */ },
    en: { /* 英文文本 */ },
    ja: { /* 日文文本 */ }
  };
}
```

### 2. 文本获取

```javascript
// 获取当前语言的文本
getText(key, fallback = '') {
  const keys = key.split('.');
  let value = this.gameTexts[this.currentLanguage];
  // ... 查找逻辑
  return value || fallback || key;
}
```

### 3. 界面更新

```javascript
// 更新界面文本
updateUITexts() {
  // 更新标签页
  // 更新项目轮播
  // 更新按钮文本
  // 更新状态指示器
}
```

## 🎯 最佳实践

### 1. 文本组织
- 按功能模块分组
- 使用有意义的键名
- 保持键名一致性

### 2. 内容管理
- 提供默认值
- 保持文本简洁
- 使用统一的术语

### 3. 版本控制
- 修改前备份文件
- 提交前验证格式
- 记录重要更改

## 🚨 常见问题

### Q: 修改后界面没有更新？
A: 检查以下几点：
1. 是否点击了保存按钮
2. 浏览器是否缓存了旧版本
3. JSON格式是否正确

### Q: 如何添加新的文本分组？
A: 使用编辑器中的"添加新文本"功能，或直接编辑 `profile.json` 文件。

### Q: 如何切换语言？
A: 修改 `game-dashboard.js` 中的 `currentLanguage` 属性。

### Q: 文本编辑器无法加载？
A: 确保：
1. 服务器正在运行
2. `data/profile.json` 文件存在
3. 文件格式正确

## 📚 相关文件

- `game-text-editor.html`: 游戏文本编辑器
- `game-dashboard.html`: 游戏仪表板界面
- `js/game-dashboard.js`: 游戏仪表板逻辑
- `data/profile.json`: 数据文件
- `css/game-dashboard.css`: 样式文件

现在您可以轻松地管理游戏仪表板中的所有文本内容了！🎉
