module.exports = function (grunt) {

    var api = grunt.file.readJSON('api.json');

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        replace: {
            default: {
                options: {
                    variables: {
                        apikey: api.key,
                        apisecret: api.secret
                    },
                    prefix: "##"
                },
                files: [
                    {expand: true, cwd: 'app/', src: '**/*', dest: 'build/', filter: 'isFile'}
                ]
            }
        },
        copy:  {
            default:{
                files:[
                    //Images
                    {expand: true, cwd: 'app', src: 'img/icons/*', dest: 'build', filter: 'isFile'},
                    //Javascript
                    {expand: true, cwd: 'app', src: 'js/**/*', dest: 'build', filter: 'isFile'},
                    //Pages
                    {expand: true, cwd: 'app', src: 'pages/*', dest: 'build', filter: 'isFile'},
                    //Other
                    {expand: true, cwd: 'app', 'src': '*', dest: 'build', filter:'isFile'}
                ]
            }
        },
        clean: ["build/"]
    });

    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('versionBump', 'Bump the version of the app', function (type) {
        if (!type) {
            grunt.log.warn("No version type given");
            return;
        }

        var manifestPath = 'app/manifest.json';
        var packagePath = 'oackage.json';
        var manifest = grunt.file.readJSON(manifestPath);
        var versionParts = manifest.version.split('.');
        switch (type.toLowerCase()) {
            case "major":
                var newV = parseInt(versionParts[0], 10) + 1;
                versionParts = [newV, 0, 0];
                break;
            case "minor":
                versionParts[1] = parseInt(versionParts[1], 10) + 1;
                versionParts[2] = 0;
                break;
            case "bug":
                versionParts[2] = parseInt(versionParts[2], 10) + 1;
                break;
            default:
                return;
        }
        manifest.version = versionParts.join('.');
        grunt.file.write(manifestPath, JSON.stringify(manifest));
        var pack = grunt.file.readJSON(packagePath);
        pack.version = manifest.json;
        grunt.file.write(pack, JSON.stringify(pack));
    })

    grunt.registerTask('default', ['clean', 'copy', 'replace']);
}