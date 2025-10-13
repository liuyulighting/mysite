# 🎮 Yu Liu · Game Dashboard Portfolio

一个基于游戏机风格设计的个人作品集，采用现代化的游戏界面设计理念，支持多语言和实时文本编辑。

## 🚀 快速开始

### 本地运行
```bash
# 启动本地服务器
python3 -m http.server 8080

# 访问主页面
open http://localhost:8080/game-dashboard.html
```

### 部署到GitHub Pages
1. 将代码推送到GitHub仓库
2. 在仓库设置中启用GitHub Pages
3. 选择从 `main` 分支的 `/root` 目录部署

## 🎯 项目特色

### 游戏机风格设计
- **深色主题**：深蓝色调的游戏机风格
- **游戏化元素**：卡带、关卡、技能系统
- **现代化UI**：圆角、阴影、渐变效果
- **响应式设计**：适配各种屏幕尺寸

### 三层信息架构
1. **卡带仓（Cartridge Bay）** - 三张固定卡带
   - D5 工作经历（蓝色）
   - 酷家乐 工作经历（橙色）
   - 个人项目（红色）

2. **关卡选择（Level Select）** - 每个卡带下的子分类
   - D5：团队版从0→1、协作体系、商业化与增长、3D展示
   - 酷家乐：PLM系统、OMS平台、参数化CAD、设计系统
   - 个人项目：DiverseShot、个人站点、其它实验

3. **卡片主体（Cards）** - 每个bullet point形成一张卡片
   - 标题、描述、数据/徽章、预览链接

## 📁 项目结构

```
mysite.github.io/
├── game-dashboard.html          # 主页面（游戏仪表板）
├── game-text-editor.html        # 文本编辑器
├── text-manager.py              # 命令行文本管理工具
├── css/
│   ├── game-dashboard.css       # 游戏仪表板样式
│   └── styles.css               # 通用样式
├── js/
│   └── game-dashboard.js        # 游戏仪表板逻辑（包含多语言支持）
├── data/
│   └── profile.json             # 个人资料数据
├── assets/                      # 静态资源
│   └── avatar.svg               # 头像
└── docs/                        # 文档
    ├── GAME_DASHBOARD_GUIDE.md  # 游戏仪表板指南
    ├── TEXT_EDITOR_GUIDE.md     # 文本编辑器指南
    └── MULTILINGUAL_GUIDE.md    # 多语言指南
```

## 🛠️ 功能特性

### 游戏仪表板
- **交互式卡带系统**：点击卡带进入不同工作经历
- **关卡选择**：每个卡带下的详细项目分类
- **项目轮播**：自动轮播展示主要项目
- **游戏控制**：D-pad导航、A/B按钮操作
- **状态指示器**：显示当前卡带和关卡信息

### 文本管理系统
- **可视化编辑器**：`game-text-editor.html` 专门管理游戏界面文本
- **多语言支持**：中文、英文、日文三种语言
- **实时编辑**：修改后立即在界面中生效
- **命令行工具**：`text-manager.py` 支持批量操作

### 多语言支持
- **内置多语言系统**：集成在游戏仪表板中
- **支持语言**：中文、英文、日文三种语言
- **数据驱动**：通过 `data/profile.json` 管理多语言内容
- **实时编辑**：使用 `game-text-editor.html` 编辑多语言文本

## 📝 内容管理

### 修改个人信息
使用 `game-text-editor.html` 编辑：
- 姓名、职位、联系方式
- 工作经历描述
- 项目标题和描述
- 界面文本

### 添加新内容
1. 在文本编辑器中添加新的文本分组
2. 更新对应的HTML结构
3. 在JavaScript中添加相应的处理逻辑

### 多语言翻译
1. 使用 `game-text-editor.html` 编辑多语言文本
2. 修改 `data/profile.json` 中的多语言字段
3. 使用命令行工具验证和同步

## 🎨 自定义样式

### 颜色主题
在 `css/game-dashboard.css` 中修改CSS变量：
```css
:root {
  --console-base: #0a0e1a;
  --panel-grey-1: #1a2332;
  --brand-blue: #4a9eff;
  --brand-red: #ef4444;
  --brand-orange: #f59e0b;
}
```

### 布局调整
- 修改 `grid-template-columns` 调整布局比例
- 调整 `padding` 和 `margin` 改变间距
- 修改 `border-radius` 改变圆角大小

## 🔧 开发工具

### 文本编辑器
- **Web编辑器**：`game-text-editor.html` - 可视化编辑
- **命令行工具**：`text-manager.py` - 批量操作
- **JSON验证**：自动检查格式正确性

### 调试工具
- 浏览器开发者工具
- 控制台日志输出
- 网络请求监控

## 📚 文档

- [游戏仪表板指南](docs/GAME_DASHBOARD_GUIDE.md) - 详细的功能说明
- [文本编辑器指南](docs/TEXT_EDITOR_GUIDE.md) - 文本管理方法
- [多语言指南](docs/MULTILINGUAL_GUIDE.md) - 多语言支持说明

## 🚀 部署

### GitHub Pages
1. 推送代码到GitHub仓库
2. 在仓库设置中启用GitHub Pages
3. 选择部署分支和目录
4. 等待部署完成

### 其他平台
- **Netlify**：拖拽文件夹到Netlify
- **Vercel**：连接GitHub仓库自动部署
- **自定义服务器**：上传文件到服务器

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

---

**作者**: Yu Liu (刘禹)  
**邮箱**: liuyulighting@gmail.com  
**网站**: [liuyulighting.github.io](https://liuyulighting.github.io)