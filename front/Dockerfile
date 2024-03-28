# Use node.js image with version 20.11.1
FROM node:20.11.1

# Set working directory in the container
WORKDIR /var/www/it-vesna
RUN mkdir /var/www/it-vesna/node
RUN mkdir /var/www/it-vesna/body

# Link all docker to this port (server port)
EXPOSE 80

# Install React and React Router
RUN npm install react@18.2.0 react-dom@18.2.0 react-router-dom@6.22.3 react-scripts