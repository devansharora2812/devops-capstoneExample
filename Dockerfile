# Use official NodeJS image
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the code
COPY . .

# Expose app port
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]
