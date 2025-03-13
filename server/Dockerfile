FROM node:18-alpine

WORKDIR /app/auth-ms

COPY package*.json ./

RUN npm install
RUN npm install -g nodemon


COPY . .

# Set ENV
ENV NODE_ENV=dev

EXPOSE 3001

CMD ["node", "run", "start:dev"]