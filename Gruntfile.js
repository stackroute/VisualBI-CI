var path = require('path');

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		env: {
			dev: {
				NODE_ENV: 'development'
			},
			test: {
				NODE_ENV: 'test'
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
					src: ['bin/**', 'config/**', 'lib/**', 'models/**', 'routes/**', 'views/**'],
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
			server: {
				options: {
					port: 9000,
					server: path.resolve(__dirname, 'app.js')
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-express');

	grunt.loadNpmTasks('grunt-env');

	grunt.registerTask('build', ['clean:build','jshint','copy:build']);
	grunt.registerTask('default', ['build']);

	grunt.registerTask('serve', ['env:dev', 'express', 'express-keepalive']);
	grunt.registerTask('serve:dist', ['env:test', 'express', 'express-keepalive']);
};