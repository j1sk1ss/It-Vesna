# Use python image
FROM python:3

# Work directory in docker
WORKDIR /var/www/it-vesna/server

# Copy requirements.txt to container
COPY requirements.txt ./

# Run command at first startup
RUN pip install --no-cache-dir -r requirements.txt

# Create dirs for storing data
RUN mkdir -p /var/www/it-vesna/server/body
RUN mkdir -p /var/www/it-vesna/server/data