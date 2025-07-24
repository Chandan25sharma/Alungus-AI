# Free API Setup Guide

To use Alungus AI with free APIs, you'll need to get API keys from the following services:

## 1. HuggingFace (for Image Generation)
- Visit: https://huggingface.co/settings/tokens
- Create a free account
- Generate a new token with "Read" permissions
- Add to `.env.local` as: `HUGGINGFACE_API_TOKEN=your_token_here`

## 2. OpenRouter (for Chat/LLM)
- Visit: https://openrouter.ai/keys
- Sign up for a free account
- Get $1 free credits to start
- Create an API key
- Add to `.env.local` as: `OPENROUTER_API_KEY=your_key_here`

## 3. Replicate (for Video Generation)
- Visit: https://replicate.com/account/api-tokens
- Sign up for a free account
- Get free credits to start
- Create an API token
- Add to `.env.local` as: `REPLICATE_API_TOKEN=your_token_here`

## 4. ElevenLabs (for Text-to-Speech)
- Visit: https://elevenlabs.io/app/speech-synthesis
- Create a free account (10,000 characters/month free)
- Go to Profile → API Keys
- Create a new API key
- Add to `.env.local` as: `ELEVENLABS_API_KEY=your_key_here`

## Complete .env.local Example

```bash
# MongoDB (already configured)
MONGODB_URI=mongodb+srv://zaqqai43:DxVRUBpgWGHvuWMb@alunguai.jplvz2e.mongodb.net/?retryWrites=true&w=majority&appName=AlunguAi

# NextAuth (already configured)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-jwt-key-here

# OAuth Providers (already configured)
GOOGLE_CLIENT_ID=718020089893-u5o9349vuj7dpv01sk5bh6u56db4eshp.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=IzaSyDaJYNyvzAotIjYNWdFKvE0yszlyzM54Sk

# Free AI API Keys (ADD THESE)
HUGGINGFACE_API_TOKEN=hf_your_token_here
OPENROUTER_API_KEY=sk-or-v1-your_key_here
REPLICATE_API_TOKEN=r8_your_token_here
ELEVENLABS_API_KEY=your_elevenlabs_key_here
```

## Features Available

- ✅ **Image Generation**: FLUX.1-dev model via HuggingFace
- ✅ **Chat Assistant**: Llama 3 and other models via OpenRouter
- ✅ **Video Generation**: Stable Video Diffusion via Replicate
- ✅ **Text-to-Speech**: High-quality voices via ElevenLabs

## Usage Limits (Free Tiers)

- **HuggingFace**: Rate limited but free
- **OpenRouter**: $1 free credits (~1000 chat messages)
- **Replicate**: Free credits for testing
- **ElevenLabs**: 10,000 characters/month free

## Production Deployment

For Vercel deployment, add the same environment variables in your Vercel dashboard under Settings → Environment Variables.

## Check API Status

Visit `/api/status` after adding your keys to verify they're configured correctly.
