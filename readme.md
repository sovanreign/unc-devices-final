# 🚀 UNC Devices – Setup Guide

Follow the steps below to get the fullstack UNC Devices system running locally.

---

## ✅ 0. Install Dependencies

Make sure you have [pnpm](https://pnpm.io/) installed globally. Then run:

```bash
pnpm install
```

This will install dependencies for both the frontend and backend via workspaces.

---

## ✅ 1. Configure Environment Variables

Edit the `.env` file inside the `unc-itam-api` folder to match your local database setup:

```bash
cd unc-itam-api
cp .env.example .env
# Then update the values accordingly
```

---

## ✅ 2. Set Up the Database

This will generate the Prisma client, apply migrations, and seed initial data:

```bash
pnpm run db
```

> 💡 Make sure your database is running and accessible.

---

## ✅ 3. Build the Project

Build both the Next.js (frontend) and NestJS (backend) applications:

```bash
pnpm run build
```

---

## ✅ 4. Run the Application

Start both the frontend and backend in parallel:

```bash
pnpm run dev
```

> ✅ By default:
>
> - Frontend runs at `http://localhost:3000`
> - Backend (API) runs at `http://localhost:3001` (or as configured in `.env`)

---

## ✅ 5. Open in Your Browser

Once the servers are running, go to:

```
http://localhost:3000/login
```

You should see the login screen of the UNC Devices Inventory System.

---

## 📦 Tech Stack

- **Frontend:** Next.js, Tailwind CSS, Shadcn UI
- **Backend:** NestJS, Prisma, PostgreSQL
- **Monorepo:** Powered by `pnpm` workspaces + `concurrently`

---

## 🧠 Need Help?

For issues or contributions, feel free to open an issue or contact the project maintainer.
