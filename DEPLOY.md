# Deploying Lifting Social Foods to Vercel

This is a one-time setup. After it's done, every `git push` to `main` auto-deploys.

## 1. Create a Neon Postgres database (free)

1. Go to https://console.neon.tech/ and sign up (free, GitHub login works).
2. Create a new project. Pick the **AWS region closest to Sri Lanka** (Mumbai `ap-south-1` or Singapore `ap-southeast-1`).
3. After creation, open the project → **Dashboard** → **Connection Details**.
4. You need **two** connection strings:
   - **Pooled** (default) → this is your `DATABASE_URL`. URL contains `-pooler` in the hostname.
   - **Direct** (uncheck "Pooled connection") → this is your `DIRECT_DATABASE_URL`. No `-pooler` in hostname.
5. Save both strings somewhere temporarily.

## 2. Create a Cloudinary account (free)

1. Go to https://cloudinary.com/users/register_free
2. After signup, you land on the dashboard. At the top you'll see:
   - **Cloud Name**
   - **API Key**
   - **API Secret** (click "reveal")
3. Save all three.

## 3. Push the database schema + seed initial admin

From your terminal, in the project directory, run:

```bash
# Set the env vars temporarily so Prisma talks to Neon
export DATABASE_URL="<your-neon-pooled-url>"
export DIRECT_DATABASE_URL="<your-neon-direct-url>"

# Push the schema (creates tables)
npx prisma db push

# Seed initial admin user + 8 sample meals
npm run db:seed
```

Confirm the seed printed `✓ Admin user ready: admin@theliftingsocial.com / ChangeMe!2026`.

## 4. Deploy to Vercel

1. Go to https://vercel.com/new
2. **Import Git Repository** → pick `TheAkila/liftingsocial-foods`.
3. Vercel auto-detects Next.js. Don't change Build Command / Output Directory.
4. Expand **Environment Variables** and add all of these:

| Name | Value |
|---|---|
| `DATABASE_URL` | Your Neon **pooled** connection string |
| `DIRECT_DATABASE_URL` | Your Neon **direct** connection string |
| `AUTH_SECRET` | Generate with `openssl rand -base64 32` (or any 32+ random chars) |
| `CLOUDINARY_CLOUD_NAME` | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | From Cloudinary dashboard |
| `PAYHERE_MERCHANT_ID` | From your PayHere merchant account (leave blank for now if not ready) |
| `PAYHERE_MERCHANT_SECRET` | Same |
| `PAYHERE_MODE` | `sandbox` (or `live` when ready to take real payments) |
| `NEXT_PUBLIC_APP_URL` | `https://<your-vercel-domain>.vercel.app` (set after first deploy) |

5. Click **Deploy**. First build takes ~2 min.

## 5. After first deploy

1. Visit `https://<your-project>.vercel.app/admin/login`
2. Sign in with `admin@theliftingsocial.com` / `ChangeMe!2026`.
3. **Immediately do these:**
   - Go to **Team** → Add a new admin with your own email + password.
   - Sign out, sign in as the new user.
   - Delete the default seed admin.
4. Go back to Vercel → Project Settings → Environment Variables → update `NEXT_PUBLIC_APP_URL` to your actual deployed URL (including custom domain if you add one). Redeploy.

## 6. (Optional) Custom domain

1. Vercel → Project Settings → Domains → Add `foods.theliftingsocial.com` (or whatever).
2. Vercel shows DNS records to set on your domain registrar. Add them.
3. Update `NEXT_PUBLIC_APP_URL` to the new domain and redeploy.

## 7. PayHere production setup (later)

When ready to take real payments:
1. Activate your PayHere live account.
2. In Vercel env vars: set `PAYHERE_MODE=live` and use your **live** merchant credentials.
3. In your PayHere dashboard, add the notification URL: `https://<your-domain>/api/payhere/notify`
4. Redeploy.

---

## Local dev after this

For local development you'll connect to the same Neon DB (or a separate one — your call). Create `.env.local` with the same values as Vercel's env vars (use `localhost:3000` for `NEXT_PUBLIC_APP_URL`).

```bash
npm run dev
```
