#!/bin/bash
# 上传云函数脚本

echo "开始上传 generateText 云函数..."
cd /Users/shangui/clawd/teacher-summary-miniprogram/cloudfunctions/generateText
npm install
echo "依赖安装完成"

echo "请在微信开发者工具中："
echo "1. 右键点击 cloudfunctions/generateText 文件夹"
echo "2. 选择'上传并部署：云端安装依赖'"
echo ""
echo "如果没有右键菜单，请："
echo "1. 点击顶部'云开发'按钮"
echo "2. 进入云函数管理"
echo "3. 点击'上传云函数'"
echo "4. 选择 generateText 文件夹"
