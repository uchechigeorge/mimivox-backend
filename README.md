This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started


First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Sample accounts

Seed the admin account with `npx prisma db seed`. It uses `INIT_ADMIN_*` from `.env` (defaults in `.env.example`):

| Role  | Email           | Password   |
| ----- | --------------- | ---------- |
| Admin | admin@email.com | `password` |

Create the sample user with `POST /api/v1/user/auth/register`:

| Role | Email          | Password       |
| ---- | -------------- | -------------- |
| User | user@email.com | `Password123!` |

These are development-only sample credentials. Never use them in production.

Add sample activity (subscription payment, credit purchase, audio, image, music, video) for the sample user:

```bash
npx tsx --env-file=.env src/prisma/seed/sample-activity.ts [email]
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details..
