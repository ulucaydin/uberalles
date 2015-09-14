# Uberalles
An experimental webapp to discover food trucks of San Francisco. It uses the SFgov.org API for spartial data fetching of trucks.  

#### Stack
- ReactJS (JS framework)
- Gulp (task manager)
- Bower (package manager)
- Yeoman (generator)
- Sass (CSS preprocessor)
- Leaflet (interactive maps JS library)


#### Install, Preview and Build
This repo uses [generator-gulp-webapp](https://github.com/yeoman/generator-gulp-webapp) hence you need to follow their guide for installing dependencies. Once it is ready, you can:
- Locally serve the project with `gulp serve`
- Build for production: `gulp`
- Preview the production build: `gulp serve:dist`

#### Build via Docker
Since this is a standalone webapp, it benefits the simplicity to be Dockerized and served with a Nginx based container.

##### Build yourself
Dockerfile at the root folder to build yourself (you need to build it via `gulp` to generate the `dist/` folder).

##### Pull from Docker Hub
Docker hub already has a pushed image at ulucaydin/uberalles. To run, simply run the following:
`docker run -d -p 80:80 ulucaydin/uberalles`

#### Todo
- Testing automation (via Mocha)
- Mobile friendlyness (mostly done, missing handling of the control panel)
