# Base image
FROM ubuntu:precise

# Update image
RUN echo "deb http://us.archive.ubuntu.com/ubuntu/ precise universe" >> /etc/apt/sources.list
RUN apt-get update -y

# Install NodeJS
RUN apt-get install -y python-software-properties python g++ make
RUN apt-add-repository ppa:chris-lea/node.js
RUN apt-get update -y
RUN apt-get install -y nodejs

# Install GruntJS
RUN npm install -g grunt-cli

# Add the project to the container
RUN mkdir -p /intelligence-web-client
ADD ./ /intelligence-web-client

# Install dependencies
RUN cd /intelligence-web-client; npm install

EXPOSE 8000
EXPOSE 8001

WORKDIR /intelligence-web-client

CMD ["grunt"]
