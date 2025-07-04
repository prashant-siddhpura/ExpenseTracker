FROM node:20-alpine

WORKDIR /app

# Install curl
RUN apk add --no-cache curl bash netcat-openbsd

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

# Add wait-for-it.sh script (must be in project root or copied manually)
COPY wait-for-it.sh ./wait-for-it.sh
RUN chmod +x wait-for-it.sh

EXPOSE 5000

# Wait for MySQL before running index.js
CMD ["./wait-for-it.sh", "mysql:3306", "-t", "60", "--", "node", "index.js"]