# Base image
FROM ubuntu:precise

# Update image
RUN echo "deb http://us.archive.ubuntu.com/ubuntu/ precise universe" >> /etc/apt/sources.list
RUN apt-get update -y

# Install git
RUN apt-get -y install git-core

# Install NodeJS
RUN apt-get install -y python-software-properties python g++ make
RUN apt-add-repository ppa:chris-lea/node.js
RUN apt-get update -y
RUN apt-get install -y nodejs

# Install GruntJS
RUN npm install -g grunt-cli

# Create working directory in the container
RUN mkdir -p /intelligence-web-client
WORKDIR /intelligence-web-client

# Add package.json to working directory
ADD package.json /intelligence-web-client/package.json

# Install dependencies
RUN npm install

# Add rest of the project to the working directory
ADD . /intelligence-web-client

# Expose ports
EXPOSE 8000
EXPOSE 8001

# Run Grunt
CMD ["grunt"]
