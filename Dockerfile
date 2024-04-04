# Use an official Node runtime as a parent image
FROM node:alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the current directory contents into the container at /usr/src/app
COPY . .


# Make port 3000 available to the world outside this container
EXPOSE 3000

# Define environment variable
ENV NODE_ENV=production

# Run app.js when the container launches
CMD ["node", "app.js"]
