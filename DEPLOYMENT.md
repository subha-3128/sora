# 🚀 Free Deployment Guide - Render.com

This guide will help you deploy your app **completely free** using Render.com.

## Prerequisites
- GitHub account
- Your Supabase database credentials (already have this)
- 10 minutes of your time

---

## Step 1: Push to GitHub

```bash
# Initialize git if you haven't already
git init
git add .
git commit -m "Initial commit - ready for deployment"

# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend API on Render

1. **Go to [render.com](https://render.com) and sign up with GitHub**

2. **Create New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your repo

3. **Configure the backend service:**
   - **Name:** `sora-api` (or any name you like)
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm run start`
   - **Plan:** Select **FREE**

4. **Add Environment Variables:**
   Click "Advanced" → "Add Environment Variable":
   
   ```
   NODE_ENV=production
   DATABASE_URL=postgresql://postgres:Subho%409832080964@db.glaohiknckchopbofxzl.supabase.co:5432/postgres?sslmode=no-verify
   PORT=10000
   ```

5. **Click "Create Web Service"**
   - Wait 5-10 minutes for deployment
   - **Copy the service URL** (looks like: `https://sora-api-xxxx.onrender.com`)

---

## Step 3: Deploy Frontend on Render

1. **Create New Static Site:**
   - Click "New +" → "Static Site"
   - Select the same GitHub repository

2. **Configure the frontend:**
   - **Name:** `sora-frontend`
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
   - **Plan:** Select **FREE**

3. **Add Environment Variable:**
   ```
   VITE_API_URL=https://sora-api-xxxx.onrender.com
   ```
   *(Replace with your actual backend URL from Step 2)*

4. **Add Rewrite Rule** (for React Router):
   - Go to "Redirects/Rewrites" tab
   - Add rule: `/*` → `/index.html` (200 status)

5. **Click "Create Static Site"**
   - Wait 3-5 minutes for deployment
   - Your app will be live at: `https://sora-frontend-xxxx.onrender.com`

---

## Step 4: Update Supabase Redirect URLs

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project → Authentication → URL Configuration
3. Add your Render frontend URL to **Redirect URLs**:
   ```
   https://sora-frontend-xxxx.onrender.com
   ```

---

## ✅ You're Live!

Your app is now deployed and accessible worldwide for **$0/month**!

### Important Notes:

⚠️ **Free Tier Limitations:**
- Backend will sleep after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake up
- 750 hours/month free (enough for 24/7 uptime with one service)

💡 **To Keep Backend Awake (Optional):**
Use a service like [UptimeRobot](https://uptimerobot.com/) (free) to ping your backend every 10 minutes.

---

## Troubleshooting

**Backend won't start?**
- Check environment variables are set correctly
- Check build logs in Render dashboard

**Frontend can't connect to API?**
- Verify VITE_API_URL is set correctly
- Check CORS settings if needed

**Database connection fails?**
- Verify DATABASE_URL is URL-encoded
- Check Supabase credentials

---

## Future Updates

After making code changes:
```bash
git add .
git commit -m "Your update message"
git push
```

Render will automatically redeploy! 🎉
