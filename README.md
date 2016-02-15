# VISUAL-BI

Visual-BI is an open source business intelligence tool with easy to use interface.

### Version
0.0.1

### Technologies used

Visual-BI uses a number of open source technologies to work properly:

* [jQuery] - A write-less-do-more Javascript library
* [Twitter Bootstrap] - great UI boilerplate for modern web apps
* [AngularJS] - Front end web framework
* [node.js] - evented I/O for the backend
* [Express] - fast node.js network app framework
* [MongoDB] - NOSQL database

### Build Instructions

VisualBI provides grunt tasks to build and run the project during development.

For running the project for testing, MongoDB needs to be running on the default port 27017 on localhost.

```sh
$ git clone [git-repo-url] VisualBI
$ cd VisualBI
$ npm install
$ grunt
```

This will delete the `dist` folder if it exists, runs [jshint] on the project, and builds the project. The build project is available in the `dist` folder after the build is complete.

#### For running the project during development

```sh
$ grunt serve
```

#### For testing the build distribution

Note that the following command will clean and build the project before running.

```sh
$ grunt serve:dist
```

The command will clean and re-build the project before running. If jshint is failing, you may use the `--force` option to serve the project.

### Configuration
Configuration for this project is provided in the `config/environment` directory. The project will look up the name of the configuration file to load from the `NODE_ENV` environment variable. Consider setting the environment variable to `production` on production environments, and create the production configuration in `config/environment/production.js`

### Installation

You need supervisor installed globally:

```sh
$ npm i -g supervisor
```

```sh
$ git clone [git-repo-url] VisualBI
$ cd VisualBI
$ npm install
$ npm start
```

### Todos

 - Write Tests

License
----

Apache

   [node.js]: <http://nodejs.org>
   [Twitter Bootstrap]: <http://twitter.github.com/bootstrap/>
   [keymaster.js]: <https://github.com/madrobby/keymaster>
   [jQuery]: <http://jquery.com>
   [@tjholowaychuk]: <http://twitter.com/tjholowaychuk>
   [express]: <http://expressjs.com>
   [AngularJS]: <http://angularjs.org>
   [Gulp]: <http://gulpjs.com>
   [MongoDB]: <https://www.mongodb.org/>
