#!/bin/bash

# Build script for the chatbot widget
# This compiles the widget TypeScript to a standalone JavaScript file

echo "🔨 Building chatbot widget..."

# Build using Vite with the widget config
npm run build:widget

echo "✅ Widget built successfully!"
echo "📦 Output: public/widget.js"
echo ""
echo "🚀 The widget is now ready to be served by your backend at /widget.js"
echo "💡 For development, the widget is available at /widget.js on your dev server"