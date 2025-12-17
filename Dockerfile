# 1단계: 빌드 환경 설정
FROM node:20-alpine as builder
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm prisma generate

COPY . .
RUN pnpm build

# 2단계: 프로덕션 환경 설정
FROM node:20-alpine as production
EXPOSE 3000
WORKDIR /app

RUN npm install -g pnpm

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

# 수정
COPY --from=builder /app/prisma ./prisma
# 
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

CMD ["pnpm", "run", "start:prod"]
