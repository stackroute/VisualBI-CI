var path = require('path');

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		env: {
			dev: {
				NODE_ENV: 'development'
			},
			dist: {
				NODE_ENV: 'dist'
			}
		},
		clean: {
			build: ['dist']
		},
		jshint: {
			server: ['Gruntfile.js', 'bin/www', 'config/**/*.js', 'models/**/*.js'],
			client: ['public/{controllers,directives,services}/**/*.js']
		},
		copy: {
			build: {
				files: [{
					expand: true,
					cwd: '.',
					src: ['bin/**', 'config/**', 'lib/**', 'models/**', 'routes/**', 'views/**', 'app.js'],
					dest: 'dist/server'
				}, {
					expand: true,
					cwd: 'public',
					src: ['**'],
					dest: 'dist/public'
				}, {
					expand: true,
					cwd: '.',
					dest: 'dist',
					src: ['package.json']
				}]
			}
		},
		express: {
			dev: {
				options: {
					port: 9000,
					server: path.resolve(__dirname, 'app.js')
				}
			},
			dist: {
				options: {
					port: 9000,
					server: path.resolve(__dirname, 'dist/server/app.js')
				}
			}
		},
		open: {
			dev: {
				path: 'http://localhost:9000/'
			}
		},
		bumpup: 'package.json',
		compress: {
			main: {
				options: {
					archive: 'dist/<%= pkg.name %>-<%= pkg.version %>.tgz'
				},
				files: [
					{expand: true, cwd: './dist', src: ['package.json','public/**/*','server/**/*']}
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-express');
	grunt.loadNpmTasks('grunt-env');
	grunt.loadNpmTasks('grunt-open');
	grunt.loadNpmTasks('grunt-bumpup');
	grunt.loadNpmTasks('grunt-contrib-compress');

	grunt.registerTask('test', ['jshint']);
	grunt.registerTask('package-only', ['clean:build', 'copy:build']);

	grunt.registerTask('build', ['clean:build','jshint','copy:build']);
	grunt.registerTask('default', ['build']);

	grunt.registerTask('serve', ['env:dev', 'express:dev', 'open:dev', 'express-keepalive']);
	grunt.registerTask('serve:dist', ['env:dist', 'build', 'express:dist', 'open:dev', 'express-keepalive']);
};