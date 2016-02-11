module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
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
				}]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('build', ['clean:build','jshint','copy:build']);

	grunt.registerTask('default', ['build']);
};