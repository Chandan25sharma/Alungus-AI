# 🚀 Alungus AI - Complete Setup Guide

Welcome to Alungus AI! This guide will help you set up your complete multimodal AI web application that runs on Vercel with Google Colab AI model backends.

## 📋 What You'll Build

- **🖼️ Image Generation**: Stable Diffusion SDXL
- **🎥 Video Generation**: AnimateDiff animations  
- **🎵 Audio Generation**: Bark TTS + MusicGen
- **🧊 3D Generation**: Threestudio (coming soon)
- **🤖 AI Chat**: Ollama integration
- **🔐 Authentication**: Google, GitHub, X, Microsoft OAuth + Email/Password
- **☁️ Deployment**: Vercel for frontend, Google Colab for AI models

## 🏁 Quick Start (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
Copy `.env.local` and fill in your MongoDB URI:
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/alungus-ai
NEXTAUTH_SECRET=your-super-secret-jwt-key-here
```

### 3. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` - you now have a working AI web app! 🎉

## 🔧 Full Production Setup

### Step 1: Database Setup (MongoDB Atlas)

1. **Create free MongoDB Atlas account**: https://cloud.mongodb.com
2. **Create a new cluster** (free tier)
3. **Create database user** with read/write permissions
4. **Get connection string** and add to `.env.local`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/alungus-ai
   ```

### Step 2: OAuth Provider Setup

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project → Enable Google+ API
3. Create OAuth 2.0 credentials
4. Add redirect URI: `http://localhost:3000/api/auth/callback/google`
5. Add to `.env.local`:
   ```
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

#### GitHub OAuth
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create new OAuth App
3. Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Add to `.env.local`:
   ```
   GITHUB_CLIENT_ID=your-github-client-id  
   GITHUB_CLIENT_SECRET=your-github-client-secret
   ```

#### Microsoft OAuth (Optional)
1. Go to [Azure Portal](https://portal.azure.com)
2. Register new application
3. Add redirect URI: `http://localhost:3000/api/auth/callback/azure-ad`
4. Add to `.env.local`:
   ```
   MICROSOFT_CLIENT_ID=your-microsoft-client-id
   MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret
   ```

### Step 3: AI Model Setup (Google Colab)

#### Option A: Quick Demo (Use Placeholder APIs)
- Your app is already configured with placeholder responses
- All generation forms work but return demo content
- Perfect for testing UI/UX and authentication

#### Option B: Real AI Models (Google Colab + ngrok)

1. **Get ngrok account**: https://ngrok.com (free tier)
2. **Copy your ngrok authtoken**

3. **Setup Stable Diffusion (Images)**:
   - Open `colab_notebooks/stable_diffusion_api.ipynb` in Google Colab
   - Replace `YOUR_NGROK_TOKEN` with your actual token
   - Replace `your-secure-api-token-here` with a secure random string
   - Run all cells
   - Copy the public URL and API token to your `.env.local`:
     ```
     COLAB_API_BASE_URL=https://xxxxx.ngrok.io
     COLAB_API_TOKEN=your-secure-api-token-here
     ```

4. **Setup Video Generation** (Optional):
   - Open `colab_notebooks/video_generation_api.ipynb` 
   - Follow same process as above
   - Uses AnimateDiff for animated GIFs/videos

5. **Setup Audio Generation** (Optional):
   - Open `colab_notebooks/audio_generation_api.ipynb`
   - Follow same process as above
   - Provides Bark TTS and MusicGen

### Step 4: Deploy to Vercel

1. **Connect GitHub repository** to Vercel
2. **Add environment variables** in Vercel dashboard:
   ```
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=your-super-secret-jwt-key
   MONGODB_URI=your-mongodb-connection-string
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   COLAB_API_BASE_URL=https://your-colab-endpoint.ngrok.io
   COLAB_API_TOKEN=your-colab-api-token
   ```
3. **Update OAuth redirect URIs** to use your Vercel domain
4. **Deploy** 🚀

## 🧪 Local AI Setup (Advanced)

Want to run AI models locally instead of Colab? Here's how:

### Ollama (Chat Assistant)
```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Download models
ollama pull llama3
ollama pull mistral

# Start server (runs on localhost:11434)
ollama serve
```

### Stable Diffusion (AUTOMATIC1111)
```bash
# Clone and setup
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git
cd stable-diffusion-webui
python launch.py --api
```

Update `.env.local`:
```
OLLAMA_ENDPOINT=http://localhost:11434
STABLE_DIFFUSION_ENDPOINT=http://localhost:7860
```

## 📚 Usage Examples

### Generate an Image
```javascript
const response = await fetch('/api/generate/image', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: "A cyberpunk cat wearing sunglasses in neon city",
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
    message: "Explain quantum computing in simple terms",
    model: "llama3"
  })
})
```

## 🎯 Features Walkthrough

### 🏠 Landing Page
- Hero section with gradient design
- Feature showcase with icons
- Interactive demos
- Pricing plans
- Responsive design

### 🔐 Authentication
- Email/password registration  
- OAuth with Google, GitHub, Microsoft, X
- Secure JWT sessions
- User profile management

### 🎨 AI Generation Dashboard
- **Image Generator**: Text-to-image, img-to-img, style transfer
- **Video Generator**: Animated videos, realistic scenes
- **Audio Generator**: Text-to-speech, voice cloning, music generation  
- **3D Generator**: Characters, products, objects (coming soon)
- **AI Chat**: Conversational AI assistant

### 📊 User Dashboard
- Generation history
- Usage statistics
- Model settings
- Account management

## 🛠️ Development Tips

### Adding New AI Models
1. Create new Colab notebook in `colab_notebooks/`
2. Add API endpoint in `app/api/generate/`
3. Create UI component in `components/generators/`
4. Add to dashboard tabs

### Customizing UI
- Components use **shadcn/ui** + **Radix UI**
- Styling with **TailwindCSS**
- Icons from **Lucide React**
- Animations with **Framer Motion**

### Database Schema
```javascript
// User collection
{
  _id: ObjectId,
  name: "John Doe",
  email: "john@example.com",
  image: "https://...",
  providers: ["google", "github"],
  createdAt: Date,
  // OAuth fields handled by NextAuth
}

// Generations collection (optional)
{
  _id: ObjectId,
  userId: ObjectId,
  type: "image" | "video" | "audio" | "3d",
  prompt: "...",
  settings: {...},
  resultUrl: "...",
  createdAt: Date
}
```

## 🔄 Scaling & Production

### Performance Optimization
- **Caching**: Redis for session storage
- **CDN**: Cloudflare for static assets
- **Database**: MongoDB Atlas with proper indexing
- **API**: Rate limiting with Vercel Edge Functions

### AI Model Hosting
- **Development**: Google Colab (free)
- **Production**: RunPod, Replicate, or Lambda Labs
- **Enterprise**: AWS/GCP with GPU instances

### Monitoring
- **Frontend**: Vercel Analytics
- **Backend**: Sentry for error tracking
- **Database**: MongoDB Atlas monitoring
- **AI APIs**: Custom logging in Colab notebooks

## 🆘 Troubleshooting

### Common Issues

**"Cannot connect to MongoDB"**
- Check connection string format
- Verify network access in MongoDB Atlas
- Ensure IP whitelist includes 0.0.0.0/0 for Vercel

**"OAuth callback error"**
- Verify redirect URIs match exactly
- Check client ID/secret are correct
- Ensure OAuth app is enabled

**"Colab API not responding"**
- Check if ngrok tunnel is still active
- Verify API token matches
- Restart Colab notebook if needed

**"NextAuth error"**
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain
- Clear browser cookies and try again

### Getting Help
- **GitHub Issues**: Bug reports and feature requests
- **Discussions**: General questions and community
- **Discord**: Real-time community chat (link in README)

## 🎉 What's Next?

Your Alungus AI app is now ready! Here's what you can do:

1. **Test all features** - try generating images, videos, audio
2. **Customize the UI** - change colors, layouts, add your branding  
3. **Add more models** - integrate additional AI models
4. **Build features** - user workspaces, collaborative editing
5. **Go viral** - share your creation with the world! 🚀

Welcome to the future of AI-powered content creation! 🌟
