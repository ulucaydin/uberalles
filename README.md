# Uberalles
An experimental webapp to discover food trucks of San Francisco. It uses the SFgov.org API for spartial data fetching of trucks.  

#### Stack

##### Frontend

- ReactJS (JS framework)
- Gulp (task manager)
- Bower (package manager)
- Yeoman (generator)
- Sass (CSS preprocessor)
- Leaflet (interactive maps JS library)

##### Backend
- Docker (Containerization of everything)
- Flask (Python based microframework)
- Celery (Asyncronous task queue)
- Rabbitqa (Message broker)
- MongoDB (storing JSON data)
- Nginx (Serving application and statics)
- Gunicorn (wsgi)

#### Build via Docker Compose

Install Docker and Docker Compose (or simply install Docker Toolkit i you are on a Mac).

When you are ready, change your current location to the root folder of Uberalles project and run:

`docker-compose up -d`

This will do all the magic by pulling needed images from Docker Hub as well as building projects web and task images locally and in the end run everything. The Compose file is designed to glue all these technologies together.

You may verify if all 5 containers are running by typing `docker ps`.


#### Todo
- Testing automation (via Mocha)
- Mobile friendlyness (mostly done, missing handling of the control panel)
- Improve ReactJS builder for native JS.
