# Supabase Setup Guide

This project uses Supabase as its database backend.

## 1. Create a Supabase Project

Go to https://supabase.com and create a new project.

## 2. Run the Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Open `supabase-schema.sql` from this project root
4. Paste the entire contents and click **Run**

This creates the `loans`, `payments`, and `notifications` tables with indexes, RLS policies, and realtime enabled.

## 3. Get Your API Keys

In your Supabase dashboard, go to **Settings → API** and copy:
- **Project URL** → `VITE_SUPABASE_URL`
- **anon / public key** → `VITE_SUPABASE_ANON_KEY`

## 4. Set Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```env
VITE_SUPABASE_URL = "https://tpofvourtuuvqneuvxti.supabase.co"
VITE_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwb2Z2b3VydHV1dnFuZXV2eHRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NTQ4MzMsImV4cCI6MjA5NjEzMDgzM30.G54JOdkwzw4HlGLFGNdxEoyVrZ4zWVbANcFmKGTMEJk"
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
APP_URL=http://localhost:3000
```
