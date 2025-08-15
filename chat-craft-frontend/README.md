# Chatbot Generator Frontend

A complete React frontend for creating and embedding AI-powered chatbots on websites. Built with React, TypeScript, Tailwind CSS, and modern web technologies.

![Chatbot Generator](https://img.shields.io/badge/React-18.2.0-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.3.0-38bdf8?logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-5.0.0-646cff?logo=vite)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Setup & Installation

1. **Clone and setup**
   ```bash
   git clone <your-git-url>
   cd chatbot-generator-frontend
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your API settings:
   ```env
   VITE_API_BASE_URL=https://your-backend-api.com
   VITE_USE_MOCK=false  # Set to true for development without backend
   ```

3. **Development Server**
   ```bash
   npm run dev
   ```
   Open http://localhost:5173

4. **Build for Production**
   ```bash
   npm run build
   npm run preview  # Preview the production build
   ```

## 🌟 Key Features

### Core Functionality
- 🤖 **AI Chatbot Creation** - Transform business info + FAQs into intelligent chatbots
- 📄 **Knowledge Base Upload** - Upload PDF, Word docs, text files to enhance chatbot responses  
- 🎨 **Tone Customization** - Choose friendly, professional, or casual chatbot personality
- 📋 **Easy Embed Code** - One-line script tag works on any website
- 📱 **Responsive Widget** - Perfect on desktop, tablet, and mobile devices
- 🔄 **Live Demo** - Test your chatbot before deployment
- ⚡ **Fast & Lightweight** - Optimized performance with zero external dependencies

### Form Features
- ✅ **Business Information** - Name, description, website, tone selection
- 📝 **FAQ Management** - Support for text format or JSON input
- 📄 **File Upload** - Drag & drop PDF/Word documents with validation
- 🔍 **Real-time Validation** - Instant feedback and error handling
- 💾 **File Management** - Preview, remove, and organize uploaded documents
## 📁 Project Structure

```
chatbot-generator-frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── Layout.tsx      # Main layout wrapper
│   │   ├── BusinessForm.tsx # Chatbot creation form
│   │   ├── EmbedCodeCard.tsx # Shows embed code & preview
│   │   ├── WidgetPreview.tsx # Widget demo component
│   │   ├── FileUpload.tsx  # File upload with drag & drop
│   │   └── LoadingSpinner.tsx # Loading states
│   ├── pages/              # Route components
│   │   ├── CreateBotPage.tsx # Main chatbot creation page
│   │   ├── DemoEmbedHost.tsx # Widget demo page
│   │   └── NotFound.tsx     # 404 page
│   ├── services/           # API integration
│   │   ├── api.ts          # Axios client with interceptors
│   │   └── chatbot.ts      # Chatbot API functions
│   ├── hooks/              # React Query hooks
│   │   ├── useCreateChatbot.ts
│   │   └── useChatbot.ts
│   ├── widget/             # Embeddable widget code
│   │   ├── widgetEntry.ts  # Widget TypeScript source
│   │   └── build-widget.sh # Build script
│   ├── types/              # TypeScript interfaces
│   ├── utils/              # Helper utilities
│   └── main.tsx           # App entry point
├── public/
│   ├── widget.js          # Built widget for development
│   └── demo-host.html     # Static demo page
├── package.json
├── vite.config.ts         # Main Vite config
├── vite.widget.config.ts  # Widget build config
└── README.md
```

## 🔌 API Integration

### Backend Endpoints

The frontend integrates with these FastAPI endpoints:

#### 1. Create Chatbot
```http
POST /chatbot/create
Content-Type: multipart/form-data (when files included) or application/json

# JSON format (no files):
{
  "name": "ABC Store Bot",
  "description": "We sell handmade soaps and organic skincare...",
  "website_url": "https://abcstore.com",
  "tone": "friendly",
  "faqs": [
    {"q":"Do you ship internationally?","a":"Yes, we ship worldwide."},
    {"q":"Return policy?","a":"30 day returns on unused items."}
  ]
}

# FormData format (with files):
name: "ABC Store Bot"
description: "We sell handmade soaps..."
website_url: "https://abcstore.com"
tone: "friendly"
faqs: '[{"q":"Do you ship internationally?","a":"Yes, we ship worldwide."}]'
knowledge_files: [File1, File2] // PDF, Word, or text files
```

**Response (201):**
```json
{
  "chatbot_id": "uuid-v4-string",
  "embed_script_url": "https://api.yoursaas.com/widget.js",
  "created_at": "2025-08-09T12:00:00Z",
  "config": { ... }
}
```

#### 2. Chat Response
```http
POST /chatbot/respond
Content-Type: application/json

{
  "chatbot_id": "uuid-v4-string",
  "message": "Hello, do you have vegan soaps?"
}
```

**Response (200):**
```json
{
  "reply": "Yes — we have a vegan lavender soap. It costs $12 and ships in 2 days.",
  "meta": { "confidence": 0.9 }
}
```

#### 3. Get Chatbot Info (Optional)
```http
GET /chatbot/:id
```

**Response (200):**
```json
{
  "chatbot_id": "...",
  "name": "ABC Store Bot",
  "description": "...",
  "tone": "friendly",
  "faqs": [...]
}
```

### CORS Requirements

Your backend must enable CORS for domains hosting the widget:

```python
# FastAPI example
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
```

## 🔧 Widget Integration

### Basic Embed (Recommended)

Add this single line to any website:

```html
<script src="https://your-api.com/widget.js" data-chatbot-id="YOUR_CHATBOT_ID"></script>
```

### Manual Integration

For more control:

```html
<!-- 1. Add container div -->
<div id="chatbot-widget-container"></div>

<!-- 2. Load and configure -->
<script>
  window.ChatbotConfig = {
    chatbotId: "YOUR_CHATBOT_ID",
    apiUrl: "https://your-api.com",
    position: "bottom-right"  // or "bottom-left"
  };
</script>
<script src="https://your-api.com/widget.js"></script>
```

### Widget Features

- 🎨 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎯 **Floating Button** - Unobtrusive bottom-right positioning
- 💬 **Chat Interface** - Clean, modern chat UI
- ⚡ **Fast Loading** - Lightweight and optimized
- 🔒 **Secure** - No external dependencies
- 🎨 **Self-contained CSS** - No styling conflicts

## 🧪 Testing & Development

### Running Tests
```bash
npm run test        # Run unit tests
npm run lint        # Check code quality
npm run format      # Format code with Prettier
npm run type-check  # TypeScript type checking
```

### Mock Mode

For development without a backend:

```env
VITE_USE_MOCK=true
```

This enables mock responses for all API calls.

### Widget Development

The widget is built separately for embedding:

```bash
npm run build:widget  # Builds src/widget/widgetEntry.ts to public/widget.js
```

### Demo Pages

- **Main App**: http://localhost:5173/
- **Widget Demo**: http://localhost:5173/demo
- **Static Demo**: http://localhost:5173/demo-host.html

## 🎨 Design System

The app uses a modern design system with:

- **Colors**: Purple gradient primary theme
- **Typography**: System fonts with clear hierarchy  
- **Components**: shadcn/ui component library
- **Responsive**: Mobile-first approach
- **Accessibility**: WCAG 2.1 AA compliance

### Customizing the Theme

Edit `src/index.css` to modify the design system:

```css
:root {
  --primary: 262 83% 58%;        /* Purple */
  --primary-glow: 270 91% 65%;   /* Light purple */
  --gradient-primary: linear-gradient(135deg, hsl(262 83% 58%), hsl(270 91% 65%));
}
```

## 🚀 Deployment

### Frontend Deployment (Recommended: Vercel)

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   npx vercel --prod
   ```

3. **Set environment variables** in Vercel dashboard:
   - `VITE_API_BASE_URL`: Your backend API URL

### Backend Integration

1. **Serve the widget**: Your backend should serve `public/widget.js` at `/widget.js`
2. **Enable CORS**: Allow requests from widget-hosting domains
3. **Environment**: Set production API URL in frontend build

### Environment Variables

Production `.env`:
```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_USE_MOCK=false
```

## 🔐 Adding Authentication (Future)

This MVP doesn't include authentication, but here's how to add it:

1. **Add Auth Context**
   ```tsx
   // src/contexts/AuthContext.tsx
   export const AuthContext = createContext<AuthState>(null);
   ```

2. **Protected Routes**
   ```tsx
   // src/components/ProtectedRoute.tsx
   const ProtectedRoute = ({ children }) => {
     const { user } = useAuth();
     return user ? children : <Navigate to="/login" />;
   };
   ```

3. **API Integration**
   Update `src/services/api.ts` to include JWT tokens in requests.

## 🐛 Troubleshooting

### Common Issues

**Widget not loading:**
- Check CORS settings on your backend
- Verify the script src URL is correct
- Check browser console for errors

**API connection failed:**
- Confirm `VITE_API_BASE_URL` is set correctly
- Test API endpoints with Postman/curl
- Check network requests in browser dev tools

**Build errors:**
- Run `npm install` to ensure dependencies are installed
- Check TypeScript errors with `npm run type-check`
- Clear node_modules and reinstall if needed

**Styling issues:**
- Ensure Tailwind CSS is properly configured
- Check for CSS conflicts with existing website styles
- Verify CSS variables are defined in `:root`

### Development Tips

- Use React DevTools for component debugging
- Enable mock mode (`VITE_USE_MOCK=true`) for backend-independent development
- Check the browser Network tab for API request/response details
- Use the Console tab to monitor widget loading and errors

## 👥 Team Development Guidelines

This codebase is designed for a 4-person team:

### Recommended Work Division

1. **Frontend Developer**: React components, UI/UX, styling
2. **Backend Developer**: API endpoints, database, widget serving
3. **DevOps Engineer**: Deployment, environment setup, CI/CD
4. **QA/Product**: Testing, requirements, user experience

### Contributing

1. **Feature Development**
   ```bash
   git checkout -b feature/your-feature-name
   npm run dev
   # Make changes
   npm run test
   npm run lint
   git commit -m "feat: add your feature"
   git push origin feature/your-feature-name
   ```

2. **Code Standards**
   - Use TypeScript for all new code
   - Follow existing component patterns
   - Add JSDoc comments for complex functions
   - Write tests for new components
   - Use conventional commit messages

3. **Testing**
   - Unit tests for business logic
   - Component tests for UI interactions
   - Integration tests for API calls
   - Manual testing of widget embedding

## 📜 License

This project is built for educational and demonstration purposes. Modify and use according to your needs.

---

## 🆘 Support

For questions or issues:

1. Check the troubleshooting section above
2. Review the component documentation in the code
3. Test with mock mode to isolate frontend vs backend issues
4. Check browser console and network tabs for detailed error information

Built with ❤️ using React, TypeScript, and modern web technologies.