# 🚀 部署指南

## 📋 部署前检查清单

### 必需文件检查
- [ ] `game-dashboard.html` - 主页面文件
- [ ] `css/game-dashboard.css` - 样式文件
- [ ] `js/game-dashboard.js` - 脚本文件
- [ ] `data/profile.json` - 数据文件
- [ ] `i18n/*.json` - 多语言文件
- [ ] `assets/avatar.svg` - 头像文件

### 功能测试
- [ ] 页面正常加载
- [ ] 游戏控制功能正常
- [ ] 项目轮播正常工作
- [ ] 多语言切换正常
- [ ] 文本编辑器功能正常
- [ ] 响应式布局正常

### 内容检查
- [ ] 个人信息准确
- [ ] 项目链接有效
- [ ] 联系方式正确
- [ ] 多语言翻译完整

## 🌐 GitHub Pages 部署

### 方法一：自动部署（推荐）

1. **推送代码到GitHub**
   ```bash
   git add .
   git commit -m "Update portfolio content"
   git push origin main
   ```

2. **启用GitHub Pages**
   - 进入GitHub仓库
   - 点击 `Settings` 标签
   - 滚动到 `Pages` 部分
   - 在 `Source` 下选择 `Deploy from a branch`
   - 选择 `main` 分支和 `/ (root)` 目录
   - 点击 `Save`

3. **等待部署完成**
   - 部署通常需要几分钟
   - 访问 `https://yourusername.github.io/mysite.github.io`

### 方法二：GitHub Actions（高级）

1. **创建部署工作流**
   ```yaml
   # .github/workflows/deploy.yml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - name: Deploy to GitHub Pages
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./
   ```

## ☁️ 其他平台部署

### Netlify

1. **拖拽部署**
   - 访问 [netlify.com](https://netlify.com)
   - 将项目文件夹拖拽到部署区域
   - 等待部署完成

2. **Git集成部署**
   - 连接GitHub仓库
   - 设置构建命令：`npm run build`（如需要）
   - 设置发布目录：`/`
   - 启用自动部署

### Vercel

1. **导入项目**
   ```bash
   npm i -g vercel
   vercel
   ```

2. **配置部署**
   - 选择项目根目录
   - 确认构建设置
   - 部署完成

### 自定义服务器

1. **上传文件**
   ```bash
   # 使用SCP上传
   scp -r * user@server:/var/www/html/
   
   # 使用FTP上传
   ftp your-server.com
   ```

2. **配置Web服务器**
   ```nginx
   # Nginx配置示例
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/html;
       index game-dashboard.html;
       
       location / {
           try_files $uri $uri/ =404;
       }
   }
   ```

## 🔧 部署配置

### 环境变量（如需要）

```bash
# .env 文件
NODE_ENV=production
BASE_URL=https://your-domain.com
```

### 构建优化

```bash
# 压缩CSS和JS文件
npm install -g clean-css-cli uglify-js
cleancss -o css/game-dashboard.min.css css/game-dashboard.css
uglifyjs js/game-dashboard.js -o js/game-dashboard.min.js
```

### 缓存策略

```html
<!-- 在HTML中添加缓存控制 -->
<meta http-equiv="Cache-Control" content="public, max-age=31536000">
```

## 📱 移动端优化

### 响应式测试
- [ ] iPhone SE (375x667)
- [ ] iPhone 12 (390x844)
- [ ] iPad (768x1024)
- [ ] Android (360x640)

### 性能优化
- [ ] 图片压缩
- [ ] CSS/JS压缩
- [ ] 启用Gzip压缩
- [ ] 使用CDN加速

## 🔍 部署后验证

### 功能测试
```bash
# 检查页面加载
curl -I https://your-domain.com/game-dashboard.html

# 检查资源文件
curl -I https://your-domain.com/css/game-dashboard.css
curl -I https://your-domain.com/js/game-dashboard.js
```

### 性能测试
- 使用 [PageSpeed Insights](https://pagespeed.web.dev/)
- 使用 [GTmetrix](https://gtmetrix.com/)
- 使用浏览器开发者工具

### 兼容性测试
- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)
- 移动端浏览器

## 🚨 常见问题

### 问题1：页面显示空白
**原因**: 文件路径错误或文件缺失
**解决**: 检查文件路径，确保所有必需文件都已上传

### 问题2：样式不生效
**原因**: CSS文件路径错误或缓存问题
**解决**: 检查CSS文件路径，清除浏览器缓存

### 问题3：JavaScript功能不工作
**原因**: JS文件路径错误或语法错误
**解决**: 检查浏览器控制台错误，验证JS文件路径

### 问题4：图片不显示
**原因**: 图片文件路径错误或文件缺失
**解决**: 检查图片文件路径，确保文件存在

### 问题5：多语言不工作
**原因**: i18n文件路径错误或格式错误
**解决**: 检查JSON文件格式，验证文件路径

## 🔄 更新部署

### 内容更新
1. 修改本地文件
2. 测试功能正常
3. 提交代码变更
4. 推送到远程仓库
5. 等待自动部署

### 回滚部署
```bash
# 回滚到上一个版本
git revert HEAD
git push origin main
```

## 📊 监控和维护

### 性能监控
- 使用 [Google Analytics](https://analytics.google.com/)
- 使用 [Hotjar](https://hotjar.com/) 进行用户行为分析
- 监控页面加载时间

### 错误监控
- 使用 [Sentry](https://sentry.io/) 监控JavaScript错误
- 设置错误邮件通知
- 定期检查日志文件

### 定期维护
- [ ] 检查外部链接有效性
- [ ] 更新个人信息
- [ ] 优化页面性能
- [ ] 备份重要数据

## 🎯 最佳实践

### 版本控制
- 使用语义化版本号
- 编写清晰的提交信息
- 使用分支管理功能开发

### 安全考虑
- 使用HTTPS
- 设置安全头
- 定期更新依赖

### 性能优化
- 压缩静态资源
- 使用CDN加速
- 启用浏览器缓存

### 用户体验
- 提供加载状态
- 处理错误情况
- 优化移动端体验

## 📞 技术支持

如果在部署过程中遇到问题，可以：

1. 查看浏览器控制台错误信息
2. 检查网络请求状态
3. 参考项目文档
4. 提交Issue到GitHub仓库

---

**部署完成后，记得更新README中的链接地址！** 🎉
