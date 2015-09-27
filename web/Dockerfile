FROM ubuntu:14.10
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
RUN chmod 755 /code/*


# Start the script
WORKDIR /code/
EXPOSE 8000
CMD ["/code/start-container.sh"]
