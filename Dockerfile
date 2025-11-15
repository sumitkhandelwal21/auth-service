FROM node:alpine

WORKDIR /usr/src/app

# 1. Copy only package.json first
COPY package*.json ./

# 2. Install ALL dependencies including devDependencies
RUN npm config set strict-ssl false
RUN npm install

# 3. Copy the rest of the project
COPY . .

# 4. Build TypeScript
RUN npm run build

# 5. Expose port
EXPOSE 6001

# 6. Start the app
CMD ["node", "dist/cluster.js"]