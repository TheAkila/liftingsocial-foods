# Deploying Lifting Social Foods to Vercel

This is a one-time setup. After it's done, every `git push` to `main` auto-deploys.

## 1. Neon Postgres (database)

1. Go to https://console.neon.tech/ → sign up → create project (region: `ap-southeast-1` Singapore).
2. After creation, **Connect** button (top right) → grab two connection strings:
   - **Pooled** (default, hostname has `-pooler`) → use as `DATABASE_URL`.
   - **Direct** (untick "Pooled connection") → use as `DIRECT_DATABASE_URL`.

## 2. Push schema + seed admin

```bash
export DATABASE_URL="<your-neon-pooled-url>"
export DIRECT_DATABASE_URL="<your-neon-direct-url>"

npx prisma db push
npm run db:seed
```

You should see `✓ Admin user ready: admin@theliftingsocial.com / ChangeMe!2026`.

## 3. Cloudinary (image hosting)

1. https://cloudinary.com/users/register_free
2. Dashboard shows **Cloud Name**, **API Key**, **API Secret** — save them.

## 4. Google OAuth (customer sign-in)

1. Go to https://console.cloud.google.com/
2. Create a new project (or pick an existing one).
3. **APIs & Services → OAuth consent screen** → choose **External** → fill in app name (`Lifting Social Foods`), user support email, developer email → Save.
   - On the **Scopes** step, leave defaults.
   - On the **Test users** step, add your own Gmail (and any team email). While in "Testing" status, only listed test users can sign in.
4. **APIs & Services → Credentials → Create Credentials → OAuth client ID**
   - Application type: **Web application**
   - Name: `Lifting Social Foods Web`
   - **Authorized JavaScript origins**:
     - `http://localhost:3000`
     - `https://liftingsocial-foods.vercel.app` (replace with your Vercel URL)
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/callback/google`
     - `https://liftingsocial-foods.vercel.app/api/auth/callback/google`
5. Copy the **Client ID** and **Client Secret**.

When ready for real launch, click **Publish App** on the OAuth consent screen so any Google user can sign in (not just listed test users).

## 5. Deploy to Vercel

1. Go to https://vercel.com/new → import `TheAkila/liftingsocial-foods`.
2. Add **all** these env vars (Settings → Environment Variables):

| Name | Value |
|---|---|
| `DATABASE_URL` | Pooled Neon URL |
| `DIRECT_DATABASE_URL` | Direct (non-pooler) Neon URL |
| `AUTH_SECRET` | `openssl rand -base64 32` output (32+ chars) |
| `AUTH_GOOGLE_ID` | Google OAuth Client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth Client Secret |
| `CLOUDINARY_CLOUD_NAME` | from Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | from Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | from Cloudinary dashboard |
| `PAYHERE_MERCHANT_ID` | (leave blank until merchant account ready) |
| `PAYHERE_MERCHANT_SECRET` | (same) |
| `PAYHERE_MODE` | `sandbox` (or `live` later) |
| `NEXT_PUBLIC_APP_URL` | `https://<your-vercel-url>` |

3. Click **Deploy**.

## 6. First-login checklist

After deploy:

1. `https://<your-url>/admin/login` → sign in with the seed admin → /admin/users → add a real admin with your email → log out → log in as new admin → delete the seed account.
2. `https://<your-url>/login` → click **Continue with Google** → sign in with your own Gmail → end up at `/account`.
3. `https://<your-url>/admin/customers` → confirm your Google sign-in shows up as a customer.

## 7. Updating env vars

Vercel → Settings → Environment Variables → edit → Save → **Deployments tab → ⋯ → Redeploy** on the latest deployment.

## 8. PayHere (when ready for live payments)

- Activate PayHere live account.
- Set `PAYHERE_MODE=live` and use live credentials in Vercel.
- In PayHere dashboard, add notification URL: `https://<your-url>/api/payhere/notify`.

---

## Local dev

Make a `.env` file at the project root with the same vars (use `localhost:3000` for `NEXT_PUBLIC_APP_URL`). Then:

```bash
npm install
npm run dev
```
