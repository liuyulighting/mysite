# 🌐 多语言翻译迁移指南

## 📋 概述

本文档说明了如何将`js/game-dashboard.js`中的硬编码词条迁移到`data/profile.json`中，实现完整的多语言支持。

## 🔄 主要修改

### 1. JavaScript文件修改

**文件：** `js/game-dashboard.js`  
**方法：** `convertProfileToGameText()`

**修改前：** 硬编码所有翻译文本
```javascript
tabs: {
  skills: "技能",           // 硬编码
  achievements: "成就",     // 硬编码
  education: "教育"         // 硬编码
}
```

**修改后：** 从profile.json读取翻译
```javascript
tabs: {
  skills: profileData.ui?.tabs?.skills?.zh || "技能",
  achievements: profileData.ui?.tabs?.achievements?.zh || "成就",
  education: profileData.ui?.tabs?.education?.zh || "教育"
}
```

### 2. Profile.json结构扩展

**新增翻译结构：**

```json
{
  "ui": {
    "tabs": {
      "skills": {
        "zh": "技能",
        "en": "Skills",
        "ja": "スキル"
      },
      "achievements": {
        "zh": "成就",
        "en": "Achievements",
        "ja": "実績"
      },
      "education": {
        "zh": "教育",
        "en": "Education",
        "ja": "教育"
      }
    },
    "projects": {
      "d5Title": {
        "zh": "D5 渲染器团队版",
        "en": "D5 Render Team Edition",
        "ja": "D5 レンダーチーム版"
      },
      "d5Desc": {
        "zh": "全球领先的即时渲染器 B 端版本，ARR 超 1500 万",
        "en": "Leading real-time renderer B2B version with ARR over 15M RMB",
        "ja": "世界トップクラスのリアルタイムレンダラーB2B版、ARR 1500万超"
      }
      // ... 更多项目翻译
    }
  }
}
```

## 🎯 支持的翻译字段

### 标签页翻译 (tabs)
- `skills` - 技能
- `achievements` - 成就  
- `education` - 教育

### 项目翻译 (projects)
- `d5Title` - D5项目标题
- `d5Desc` - D5项目描述
- `kujialeTitle` - 酷家乐项目标题
- `kujialeDesc` - 酷家乐项目描述
- `officeTitle` - 公装项目标题
- `officeDesc` - 公装项目描述
- `diverseshotTitle` - AI项目标题
- `diverseshotDesc` - AI项目描述

### UI元素翻译
- `start` - 开始按钮
- `exit` - 退出按钮
- `welcome` - 欢迎信息
- `welcomeDesc` - 欢迎描述
- `cartridge` - 卡带
- `level` - 关卡
- `cards` - 卡片
- `gameConsole` - 游戏控制台

## 🛠️ 修改方法

### 方法一：直接编辑profile.json

1. 打开 `data/profile.json` 文件
2. 找到 `ui.tabs` 或 `ui.projects` 部分
3. 修改对应的翻译文本
4. 保存文件并刷新浏览器

**示例：**
```json
"tabs": {
  "skills": {
    "zh": "专业技能",        // 修改中文
    "en": "Professional Skills",  // 修改英文
    "ja": "プロフェッショナルスキル"  // 修改日文
  }
}
```

### 方法二：使用Python脚本

```bash
python3 update_translations.py
```

选择"3. UI文本"选项来修改翻译

### 方法三：使用文本编辑器

直接编辑 `data/profile.json` 文件

## 🔍 验证修改

### 测试页面
访问 `test_translations.html` 验证翻译功能

### 手动验证
1. 打开 `game-dashboard.html`
2. 切换语言按钮
3. 检查标签页和UI文本是否正确显示

## 📝 注意事项

### 1. 数据结构一致性
- 确保所有语言版本都有对应的翻译
- 使用相同的键名结构
- 保持JSON格式正确

### 2. 回退机制
- 如果profile.json中缺少翻译，会使用硬编码的默认值
- 确保默认值存在，避免显示空白

### 3. 缓存问题
- 修改后可能需要清除浏览器缓存
- 强制刷新页面 (Ctrl+F5)

## 🚀 优势

### 1. 集中管理
- 所有翻译文本集中在profile.json中
- 便于维护和更新

### 2. 动态加载
- 支持运行时修改翻译
- 无需重新编译JavaScript

### 3. 扩展性
- 易于添加新语言
- 支持添加新的翻译字段

### 4. 工具支持
- 支持多种编辑方式
- 提供验证和测试工具

## 🔧 故障排除

### 翻译不显示
1. 检查JSON格式是否正确
2. 确认键名拼写无误
3. 验证语言代码 (zh/en/ja)

### 部分翻译缺失
1. 检查profile.json中是否有对应字段
2. 确认默认值是否存在
3. 查看浏览器控制台错误信息

### 语言切换无效
1. 检查JavaScript文件是否正确加载
2. 确认语言切换逻辑正常
3. 验证事件监听器是否绑定

## 📚 相关文件

- `js/game-dashboard.js` - 主要JavaScript逻辑
- `data/profile.json` - 翻译数据文件
- `update_translations.py` - 翻译更新脚本
- `test_translations.html` - 翻译测试页面

## 🎉 完成状态

✅ 所有硬编码词条已迁移到profile.json  
✅ 支持中文、英文、日文三种语言  
✅ 提供多种编辑和测试工具  
✅ 保持向后兼容性  
✅ 完整的文档和指南  

现在您可以直接修改`data/profile.json`文件来更新所有UI翻译，无需修改JavaScript代码！
