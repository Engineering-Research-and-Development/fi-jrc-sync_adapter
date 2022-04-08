FROM node:16

#Create app directory
WORKDIR /usr/src/jrc-adapter

#Install dependencies
COPY package*.json ./

# If you are building your code for production
# RUN npm ci --only=production

RUN npm install

COPY . .

CMD ["node", "index.js"]