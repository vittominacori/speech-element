module.exports = function(grunt) {

    grunt.initConfig({
        jshint: {
            files: [
                //'Gruntfile.js',
                'src/*.js'
            ]
        },
        less: {
            dev:{
                options: {
                    cleancss: true
                },
                files: {
                    "src/speech-element.css": "src/speech-element.less"
                }
            }
        },
        copy: {
            main: {
                expand: true,
                cwd: 'src/',
                src: ['*.html','*.js','*.css'],
                dest: 'dist/'
            }
        },
        watch: {
            less: {
                files: ['src/*.less'],
                tasks: ['less'],
                options: {
                    livereload: true
                }
            },
            js: {
                files: [
                    'src/*.js'
                ],
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['jshint','less']);
    grunt.registerTask('build', ['jshint','less','copy']);

};