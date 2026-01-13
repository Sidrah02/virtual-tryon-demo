# Deployment & GitHub Guide

## 1. Push to GitHub
Since you requested to add this to `sidrah02/virtual-tryon-demo`, run these commands in your terminal:

1. **Create the repository** on GitHub:
   - Go to [https://github.com/new](https://github.com/new)
   - Repository name: `virtual-tryon-demo`
   - Description: "Virtual Try-On Fashion Demo with Next.js and FastAPI"

2. **Push your code**:
   ```bash
   git branch -m main
   git remote add origin https://github.com/sidrah02/virtual-tryon-demo.git
   git push -u origin main
   ```

## 2. Get Your Live Link (Resume)
To get a working live link, you need to deploy the project.

### Frontend (Vercel)
1. Go to [Vercel Dashboard](https://vercel.com/new).
2. Import `virtual-tryon-demo` from your GitHub.
3. **Environment Variables**:
   - `NEXT_PUBLIC_API_URL`: *Link to your backend* (see below)
4. Click **Deploy**.
   - Your link will look like: `https://virtual-tryon-demo.vercel.app`

### Backend (Render/Railway)
1. Go to [Render](https://render.com/).
2. Create a **Web Service** linked to your repo.
3. **Root Directory**: `backend`
4. **Build Command**: `pip install -r requirements.txt`
5. **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Copy the URL Render gives you (e.g., `https://virtual-tryon-backend.onrender.com`) and paste it into Vercel's environment variables.

**Resume Link**: `https://virtual-tryon-demo.vercel.app` (Once deployed)
