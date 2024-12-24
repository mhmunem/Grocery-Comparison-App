FROM node:22.12.0
 
WORKDIR /usr

COPY package*.json ./
 
RUN npm install
 
COPY . .

EXPOSE 3000
 
CMD [ "node", "src/server.ts" ]
