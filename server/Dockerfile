# Use python image
FROM python:3

# Work directory in docker
WORKDIR /var/www/it-vesna

# Link all docker to this port (server port)
EXPOSE 5000 

# Copy requirements.txt to container
COPY requirements.txt ./

# Run command at first startup
RUN pip install --no-cache-dir -r requirements.txt

# Copy all data from repo
COPY . /var/www/it-vesna/server