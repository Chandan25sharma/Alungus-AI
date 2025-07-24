# Alungus AI - Multimodal AI Web App

A complete web-based application that includes AI-powered features for image, video, audio, 3D content generation, and intelligent chatbot interaction. Built with Next.js 15, TypeScript, and integrates with open-source AI models hosted locally or through Google Colab.

## 🚀 Features

### 🤖 AI Generation Capabilities
- **Image Generation**: Stable Diffusion SDXL for text-to-image and image-to-image
- **Video Generation**: AnimateDiff for animation, ModelScope for realistic videos
- **Audio Generation**: Bark TTS for voice synthesis, MusicGen for music creation
- **3D Generation**: Threestudio for 3D characters, products, and objects
- **AI Chat**: Ollama integration with LLaMA 3, Mistral, and other LLMs

### 🔐 Authentication System
- **Multiple OAuth Providers**: Google, GitHub, X (Twitter), Microsoft Outlook
- **Email/Password Login**: Traditional authentication with MongoDB storage
- **Session Management**: JWT-based sessions with NextAuth.js

### 🎨 Modern UI/UX
- **Responsive Design**: TailwindCSS with mobile-first approach
- **Dark/Light Theme**: Theme switching with system preference detection
- **Component Library**: Radix UI + shadcn/ui for accessibility
- **Animations**: Framer Motion for smooth interactions

## 📁 Project Structure

```
alungus-ai/
├── app/                    # Next.js 15 App Router
│   ├── api/               # API endpoints
│   │   ├── auth/          # NextAuth.js authentication
│   │   ├── generate/      # AI generation endpoints
│   │   └── chat/          # Chat API
│   ├── dashboard/         # Protected dashboard pages
│   ├── auth/             # Authentication pages
│   └── globals.css       # Global styles
├── components/            # React components
│   ├── ui/               # Base UI components (shadcn/ui)
│   ├── generators/       # AI generation forms
│   ├── chat/            # Chat interface
│   ├── layout/          # Navigation, footer
│   └── sections/        # Landing page sections
├── lib/                  # Utility functions
│   ├── auth.ts          # NextAuth configuration
│   ├── utils.ts         # Utility functions
│   └── validations.ts   # Zod schemas
├── colab_notebooks/      # Google Colab notebooks
├── uploads/             # Local file storage
├── .env.local          # Environment variables
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- Git

### 1. Clone Repository
```bash
git clone https://github.com/your-username/alungus-ai.git
cd alungus-ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Copy `.env.local` and fill in your credentials:

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/alungus-ai

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-jwt-key

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# AI Model Endpoints
COLAB_API_BASE_URL=https://your-colab-endpoint.ngrok.io
COLAB_API_TOKEN=your-colab-api-token
OLLAMA_ENDPOINT=http://localhost:11434
```

### 4. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🔧 AI Model Setup

### Local Setup (Recommended for Development)

#### 1. Ollama (LLM Chat)
```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Download models
ollama pull llama3
ollama pull mistral
ollama pull phi3

# Start server (runs on localhost:11434)
ollama serve
```

#### 2. Stable Diffusion (Image Generation)
```bash
# Option A: AUTOMATIC1111 WebUI
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git
cd stable-diffusion-webui
python launch.py

# Option B: ComfyUI (Alternative)
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI
pip install -r requirements.txt
python main.py
```

### Google Colab Setup (For Production/Fallback)

1. **Create Colab Notebooks** for each AI model type
2. **Install ngrok or cloudflared** for public endpoints
3. **Set up API endpoints** that match our `/api/generate/*` structure
4. **Configure authentication tokens** for security

#### Example Colab Setup:
```python
# In Google Colab
!pip install flask
!pip install diffusers transformers accelerate

from flask import Flask, request, jsonify
import torch
from diffusers import StableDiffusionPipeline

app = Flask(__name__)

# Load model
pipe = StableDiffusionPipeline.from_pretrained(
    "runwayml/stable-diffusion-v1-5",
    torch_dtype=torch.float16
).to("cuda")

@app.route('/api/sd/txt2img', methods=['POST'])
def generate_image():
    data = request.json
    image = pipe(data['prompt']).images[0]
    # Save and return image URL
    return jsonify({'image_url': 'https://...'})

# Expose via ngrok
!ngrok http 5000
```

## 🌐 Deployment

### Vercel Deployment
1. **Connect GitHub Repository** to Vercel
2. **Set Environment Variables** in Vercel dashboard
3. **Deploy** - automatic builds on push to main

### Environment Variables for Production:
```bash
NEXTAUTH_URL=https://your-app.vercel.app
NODE_ENV=production
# ... other variables same as development
```

## 🔑 OAuth Setup Guide

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `https://your-app.vercel.app/api/auth/callback/google`

### GitHub OAuth
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create new OAuth App
3. Set Authorization callback URL: `https://your-app.vercel.app/api/auth/callback/github`

### Microsoft OAuth
1. Go to [Azure Portal](https://portal.azure.com)
2. Register new application in Azure AD
3. Add redirect URI: `https://your-app.vercel.app/api/auth/callback/azure-ad`

## 📱 Usage Examples

### Generate an Image
```javascript
const response = await fetch('/api/generate/image', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: "A cyberpunk cat wearing sunglasses",
    width: 1024,
    height: 1024,
    steps: 30
  })
})
```

### Chat with AI
```javascript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: "Explain quantum computing",
    model: "llama3"
  })
})
```

## 🚧 Development Roadmap

- [ ] **v1.0**: Core AI generation features
- [ ] **v1.1**: Advanced model settings and LoRA support
- [ ] **v1.2**: Real-time generation progress tracking
- [ ] **v1.3**: User workspace and project management
- [ ] **v1.4**: API marketplace for custom models
- [ ] **v2.0**: Mobile app with React Native

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Issues

- **GitHub Issues**: For bug reports and feature requests
- **Discussions**: For general questions and community chat
- **Documentation**: Full API docs at `/docs` (coming soon)

## 🙏 Acknowledgments

- **Stability AI** for Stable Diffusion
- **Meta** for LLaMA and MusicGen
- **Suno AI** for Bark TTS
- **Threestudio** for 3D generation
- **Vercel** for hosting platform
- **MongoDB** for database services

---

**Built with ❤️ by the Alungus AI Team**
