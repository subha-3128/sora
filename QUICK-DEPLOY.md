# 🎯 Quick Deploy - Copy & Paste Ready

## Step 1: Push to GitHub (5 min)

```bash
# Run this to prepare git
./setup-deploy.sh

# Then create repo on GitHub and run:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

---

## Step 2: Render Deployment (5 min)

1. Go to **[render.com](https://render.com)** → Sign up with GitHub
2. **New +** → **Web Service** → Connect your repo
3. Settings:
   - Name: `sora`
   - Build: `npm install --include=dev && npm run build`
   - Start: `npm run start`
   - Plan: **FREE**

4. **Environment Variables** (copy these exactly):

```
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://postgres:Subho%409832080964@db.glaohiknckchopbofxzl.supabase.co:5432/postgres?sslmode=no-verify
```

5. Click **Create Web Service**
6. **Wait 5-10 minutes** for deployment
7. **Your app will be live!** Copy the URL: `https://sora-xxxx.onrender.com`

---

## Step 3: Update Supabase (1 min)

1. [Supabase Dashboard](https://supabase.com/dashboard/project/glaohiknckchopbofxzl/auth/url-configuration)
2. Add to **Redirect URLs**:
   ```
   https://sora-xxxx.onrender.com
   ```
   *(Replace with your actual Render URL)*

---

## ✅ Done! Your app is LIVE 🎉

**Cost:** $0/month  
**Time to deploy:** ~10 minutes  

### Your URL:
- **Full App:** `https://sora-xxxx.onrender.com`

### Auto-deploys:
Every `git push` triggers automatic redeployment!

---

## 💡 Pro Tips

**Keep app awake (free):**
1. Sign up at [uptimerobot.com](https://uptimerobot.com)
2. Add monitor: `https://sora-xxxx.onrender.com/api/health`
3. Check every 10 minutes

**Custom domain (optional):**
- Render allows free custom domains
- Settings → Custom Domain → Add your domain

---

## 🆘 Need Help?

Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed troubleshooting!
