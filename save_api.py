#!/usr/bin/env python3
"""
简单的文件保存API服务器
用于游戏仪表板文本编辑器的文件保存功能
"""

import json
import os
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

class SaveAPIHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        """处理POST请求"""
        if self.path == '/api/save':
            self.handle_save_request()
        else:
            self.send_error(404, "Not Found")
    
    def handle_save_request(self):
        """处理保存请求"""
        try:
            # 获取Content-Type
            content_type = self.headers.get('Content-Type', '')
            
            if 'application/json' in content_type:
                # 处理JSON数据
                content_length = int(self.headers.get('Content-Length', 0))
                post_data = self.rfile.read(content_length)
                data = json.loads(post_data.decode('utf-8'))
                
                # 保存到profile.json
                profile_path = 'data/profile.json'
                with open(profile_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
                
                # 返回成功响应
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
                self.send_header('Access-Control-Allow-Headers', 'Content-Type')
                self.end_headers()
                
                response = {'status': 'success', 'message': '文件保存成功'}
                self.wfile.write(json.dumps(response).encode('utf-8'))
                
            else:
                self.send_error(400, "Bad Request: Content-Type must be application/json")
                
        except Exception as e:
            print(f"保存错误: {e}")
            self.send_error(500, f"Internal Server Error: {str(e)}")
    
    def do_OPTIONS(self):
        """处理CORS预检请求"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def log_message(self, format, *args):
        """自定义日志格式"""
        print(f"[{self.date_time_string()}] {format % args}")

def run_server(port=8081):
    """启动服务器"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, SaveAPIHandler)
    print(f"保存API服务器启动在端口 {port}")
    print(f"访问地址: http://localhost:{port}/api/save")
    print("按 Ctrl+C 停止服务器")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n服务器已停止")
        httpd.server_close()

if __name__ == '__main__':
    run_server()
