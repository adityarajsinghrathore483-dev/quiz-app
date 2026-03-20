# Deployment Guide - Current Affairs Quiz App

## Prerequisites
- Vercel Account (free tier available at vercel.com)
- GitHub Account (for pushing code)
- MongoDB Atlas Account (free tier available)
- Git installed locally

## Step 1: Prepare MongoDB Connection

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string:
   - Click "Connect"
   - Choose "Connect with application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Save as `MONGODB_URI`

## Step 2: Initialize Git Repository

```bash
cd c:\Users\ratho\OneDrive\Desktop\quiz-app01
git init
git add .
git commit -m "Initial commit"
```

## Step 3: Push to GitHub

1. Go to [GitHub.com](https://github.com)
2. Create a new repository named `quiz-app`
3. Follow the instructions to push your code:

```bash
git remote add origin https://github.com/YOUR_USERNAME/quiz-app.git
git branch -M main
git push -u origin main
```

## Step 4: Deploy to Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repository `quiz-app`
4. Configure project settings:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `frontend/dist`
   - **Install Command**: `npm install && npm install --prefix backend && npm install --prefix frontend`

5. Add Environment Variables:
   - Click "Environment Variables"
   - Add:
     - **Name**: `MONGODB_URI`
     - **Value**: Your MongoDB connection string
     - **Environments**: Production, Preview, Development

6. Click "Deploy"

## Step 5: Configure API URL

After deployment, Vercel will give you a URL like: `https://quiz-app-xyz.vercel.app`

Update the frontend environment:
1. Edit `frontend/.env.production`
2. Change `VITE_API_BASE_URL` to your Vercel deployment URL + `/api`

Example:
```
VITE_API_BASE_URL=https://quiz-app-xyz.vercel.app/api
```

3. Commit and push changes:
```bash
git add frontend/.env.production
git commit -m "Update API URL for production"
git push
```

Vercel will automatically redeploy.

## Step 6: Test the Deployment

1. Go to your Vercel URL
2. Login with test credentials
3. Take a quiz and verify scores are saved
4. Check the Results page

## Troubleshooting

### API Connection Issues
- Verify MONGODB_URI environment variable is set correctly
- Check that MongoDB IP whitelist includes Vercel's IPs (0.0.0.0/0)

### Quiz Data Not Showing
- Run seeding on deployed backend manually via API endpoint
- Or use MongoDB Atlas directly to insert test data

### Static Files Not Loading
- Clear browser cache (Ctrl+Shift+Delete)
- Verify `frontend/dist` folder is created during build

## Production Checklist

- [ ] MongoDB Atlas cluster created and connected
- [ ] GitHub repository created and code pushed
- [ ] Vercel project created and deployed
- [ ] MONGODB_URI environment variable set
- [ ] API URL configured in frontend `.env.production`
- [ ] Database seeded with questions
- [ ] Login and quiz submission working
- [ ] Results page displaying correctly
- [ ] Custom domain configured (optional)

## Local Development

To run locally during development:

```bash
npm run dev
```

This runs both backend (port 5000) and frontend (port 5173) concurrently.

## Support

For deployment issues:
- Check Vercel logs: Dashboard → Project → Deployments → View Logs
- Check MongoDB Atlas status and connection
- Verify all environment variables are set correctly
