# Base image
FROM node:onbuild

# Set environment variables
ENV GITHUB_USERNAME krossoverbuild
ENV GITHUB_PASSWORD Popcorn23

# Install third party packages outside npm
RUN node_modules/.bin/napa

# Install components
RUN node_modules/.bin/component install

# Expose port
EXPOSE 8000

# Run grunt
CMD node_modules/.bin/grunt
