FROM node:24

WORKDIR /app

RUN npm install -g bun

COPY package.json bun.lock* ./

COPY prisma ./prisma

RUN bun install

COPY . .

RUN bun run build

EXPOSE 5000

CMD ["bun", "run", "start"]