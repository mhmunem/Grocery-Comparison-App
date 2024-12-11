FROM node:22.12.0
 
WORKDIR /backend
 
COPY package.json package.json
COPY package-lock.json package-lock.json
 
RUN npm install
 
COPY . .
 
# CMD [ "node", "src/main.js" ]
