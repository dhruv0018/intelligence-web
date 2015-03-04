# Base image
FROM node

# Create an app directory
RUN mkdir -p /usr/src/app

# Use the app directory as the working directory
WORKDIR /usr/src/app

# Add package.json to the working directory
COPY package.json /usr/src/app/

# Set environment variables
ENV GITHUB_USERNAME krossoverbuild
ENV GITHUB_PASSWORD Popcorn23

# Install dependencies
# NOTE: Docker runs a root, so npm has to be run as root also
#       The --unsafe-perm flag keeps npm from changing permissions
#       when running scripts, so the postinstall scripts work.
RUN npm install --unsafe-perm

# Copy the rest of the project to the working directory
COPY . /usr/src/app

# Expose port
EXPOSE 8000

# Run with start script
CMD [ "npm", "start" ]
