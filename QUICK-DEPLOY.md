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

## Step 2: Render Backend Setup (5 min)

1. Go to **[render.com](https://render.com)** → Sign up with GitHub
2. **New +** → **Web Service** → Connect your repo
3. Settings:
   - Name: `sora-api`
   - Build: `npm install`
   - Start: `npm run start`
   - Plan: **FREE**

4. **Environment Variables** (copy these exactly):

```
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://postgres:Subho%409832080964@db.glaohiknckchopbofxzl.supabase.co:5432/postgres?sslmode=no-verify
```

5. Click **Create Web Service**
6. **COPY YOUR API URL** → `https://sora-api-XXXX.onrender.com`

---

## Step 3: Render Frontend Setup (3 min)

1. **New +** → **Static Site** → Same repo
2. Settings:
   - Name: `sora-frontend`
   - Build: `npm run build`
   - Publish: `dist`
   - Plan: **FREE**

3. **Environment Variable**:

```
VITE_API_URL=YOUR_BACKEND_URL_FROM_STEP2
```
*(Paste the URL you copied in Step 2)*

4. **Redirects/Rewrites** tab:
   - Source: `/*`
   - Destination: `/index.html`
   - Action: `Rewrite`

5. Click **Create Static Site**

---

## Step 4: Update Supabase (1 min)

1. [Supabase Dashboard](https://supabase.com/dashboard/project/glaohiknckchopbofxzl/auth/url-configuration)
2. Add to **Redirect URLs**:
   ```
   https://YOUR-FRONTEND-URL.onrender.com
   ```

---

## ✅ Done! Your app is LIVE 🎉

**Cost:** $0/month  
**Time to deploy:** ~15 minutes  

### Your URLs:
- Frontend: `https://sora-frontend-XXXX.onrender.com`
- Backend: `https://sora-api-XXXX.onrender.com`

### Auto-deploys:
Every `git push` triggers automatic redeployment!

---

## 💡 Pro Tips

**Keep backend awake (free):**
1. Sign up at [uptimerobot.com](https://uptimerobot.com)
2. Add monitor: `https://sora-api-XXXX.onrender.com/api/health`
3. Check every 10 minutes

**Custom domain (optional):**
- Render allows free custom domains
- Settings → Custom Domain → Add your domain

---

## 🆘 Need Help?

Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed troubleshooting!
