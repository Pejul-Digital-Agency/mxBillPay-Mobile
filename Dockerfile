# Base Ubuntu image
FROM ubuntu:latest

# Update and install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    build-essential
# Add any additional dependencies here

# Set the working directory inside the container
WORKDIR /app

# Copy your project files into the container
COPY . /app

# Optionally install any project dependencies (e.g., Node.js)
# RUN curl -sL https://deb.nodesource.com/setup_16.x | bash - && apt-get install -y nodejs
# RUN npm install

# Set the default command to run your application (e.g., for a Node app)
# CMD ["node", "index.js"]
