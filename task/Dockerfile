FROM ubuntu:trusty
MAINTAINER Uluc Aydin "hi@ulucaydin.com"

# install dependencies
RUN apt-get -y update &&\
    apt-get install -y python \
                       python-dev \
                       python-pip \
                       python-psycopg2

# Add current folder and run pip install
ADD . /code/
RUN pip install -r /code/requirements.txt

# Set celery_user and give privilidges
RUN useradd celery_user -ms /bin/bash &&\
    chown -R celery_user:celery_user /code &&\
    chmod 755 /code/*

# Start the script
WORKDIR /code/
CMD ["/code/start-container.sh"]
