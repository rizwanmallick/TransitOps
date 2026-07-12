# TransitOps - Deployment Guide

## Local Development

### Prerequisites
- Node.js v18+
- PostgreSQL v14+
- Git

### Quick Start
```bash
# Clone
git clone <repo-url>
cd TransitOps

# Install
npm install

# Configure
copy .env.example .env
# Edit .env with your PostgreSQL password

# Database setup
npx prisma db push
npx tsx --tsconfig tsconfig.json src/seed.ts

# Run
npm run dev
```

---

## Production Deployment

### Option 1: Vercel (Recommended)

Vercel is the easiest deployment option for Next.js applications.

#### Step 1: Push to GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

#### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import the TransitOps repository
5. Configure environment variables:
   ```
   DATABASE_URL=postgresql://user:pass@host:5432/transitops
   AUTH_SECRET=your-production-secret
   ```
6. Click "Deploy"

#### Step 3: Setup Database
Use a managed PostgreSQL service:
- [Neon](https://neon.tech) (free tier available)
- [Supabase](https://supabase.com) (free tier available)
- [Railway](https://railway.app)

```bash
# After setting up managed database
npx prisma db push
npx tsx --tsconfig tsconfig.json src/seed.ts
```

---

### Option 2: Docker

#### Dockerfile
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

#### docker-compose.yml
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/transitops
      - AUTH_SECRET=your-secret
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=transitops
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

#### Deploy
```bash
docker-compose up -d
docker-compose exec app npx prisma db push
docker-compose exec app npx tsx --tsconfig tsconfig.json src/seed.ts
```

---

### Option 3: Railway

1. Go to [railway.app](https://railway.app)
2. Create new project
3. Add PostgreSQL service
4. Add Next.js app service
5. Configure environment variables
6. Deploy

---

### Option 4: DigitalOcean App Platform

1. Create a Droplet or use App Platform
2. Install Node.js and PostgreSQL
3. Follow local setup instructions
4. Use PM2 for process management:
```bash
npm install -g pm2
pm2 start npm --name "transitops" -- run start
pm2 save
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `AUTH_SECRET` | Yes | Secret for JWT signing |
| `AUTH_URL` | Yes | Base URL for auth callbacks |
| `NEXTAUTH_URL` | Yes | Next.js auth URL |

### Generating AUTH_SECRET
```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString()))
```

---

## Database Management

### Reset Database
```bash
npx prisma db push --force-reset
npx tsx --tsconfig tsconfig.json src/seed.ts
```

### View Database
```bash
npx prisma studio
```

### Generate Prisma Client
```bash
npx prisma generate
```

---

## SSL/HTTPS Setup

For production, always use HTTPS.

### With Nginx
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Performance Tips

1. **Database Indexing**: Add indexes on frequently queried fields
```sql
CREATE INDEX idx_vehicle_status ON "Vehicle"(status);
CREATE INDEX idx_driver_status ON "Driver"(status);
CREATE INDEX idx_trip_status ON "Trip"(status);
```

2. **Connection Pooling**: Use PgBouncer for production
3. **Caching**: Add Redis for session and query caching
4. **CDN**: Use Vercel Edge Network or Cloudflare
5. **Image Optimization**: Use Next.js Image component

---

## Dependencies

### Production Dependencies
- next.js 16, react 19, framer-motion
- prisma 6, @prisma/client
- next-auth 5, bcryptjs
- recharts, @tanstack/react-table
- react-hook-form, zod, @hookform/resolvers
- sonner (toast notifications)
- next-themes (dark mode)

### Dev Dependencies
- typescript, @types/node, @types/react
- eslint, eslint-config-next
- tailwindcss 4, postcss, autoprefixer
- tsx (TypeScript execution)

---

## Monitoring

### Health Check Endpoint
Add to `app/api/health/route.ts`:
```typescript
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "healthy" });
  } catch {
    return NextResponse.json({ status: "unhealthy" }, { status: 500 });
  }
}
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Database connection refused | Check PostgreSQL is running and URL is correct |
| Prisma client not found | Run `npx prisma generate` |
| Port 3000 in use | Kill process or use different port |
| Build fails | Run `npm run lint` to check for errors |
| Seed fails | Ensure `.env` has correct `DATABASE_URL` |
| Framer Motion errors | Ensure `"use client"` directive on animated components |
