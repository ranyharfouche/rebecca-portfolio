# Vercel KV Setup Instructions

## Step 1: Set up Vercel KV in your Vercel Dashboard
1. Go to your Vercel project dashboard
2. Go to "Storage" tab
3. Click "Create Database"
4. Select "KV" (Redis-compatible)
5. Choose the "Hobby" plan (free)
6. Click "Create"

## Step 2: Connect KV to your project
1. Once created, click "Connect Project"
2. Select your `rebecca-portfolio-vercel` project
3. Vercel will automatically add the necessary environment variables:
   - `KV_URL`
   - `KV_REST_API_URL` 
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`

## Step 3: Redeploy
After connecting KV, Vercel will automatically redeploy your project with the new environment variables.

## How it works:
- Projects are stored persistently in Vercel KV (Redis)
- Changes survive deployments and server restarts
- Real-time updates work across all devices
- Admin dashboard fully functional

## Environment Variables (auto-added by Vercel):
- KV_URL - Redis connection URL
- KV_REST_API_URL - REST API endpoint
- KV_REST_API_TOKEN - Authentication token
- KV_REST_API_READ_ONLY_TOKEN - Read-only token

No manual configuration needed - Vercel handles it automatically!
