const browserify =   require('browserify');           // Собирает весь проект (все зависимости) в один файл
const source =       require('vinyl-source-stream');  // Виртуальная файловая система для чтения/записи файлов (нужна для api browserify)
const gulp =         require('gulp');                 // Таск-менеджер
const uglify =       require('gulp-uglify');          // Минифицироует js код
const sass =         require('gulp-sass');            // Sass компиляция
const size =         require('gulp-size');            // Показывает сколько весит проект
const environments = require('gulp-environments');    // Создает среду (prod , dev)
const buffer =       require('vinyl-buffer');         // Создает поток для файлов
const babelify =     require('babelify');             // Преобразует jsx код в js и конвертирует его в es5 стандарт
const path =         require('path');                 // Встроенный модуль в ноду для определиня пути
const cleanCSS =     require('gulp-clean-css');       // Minify css
const concat =       require("gulp-concat");          // Собирает файлы в один

const PATH_CLIENT = './client/public';

const CSS_DIR = './client/src/styles/css/*.css';
const SCSS_DIR = './client/src/styles/scss/app.scss';
const JS_DIR = './client/src/js/app.js';
const JS_LIB_DIR = './client/src/js/lib/*.js';
const JS_LIB_RESOURCES = './client/src/js/lib/resources/*.js';
const RESOURCES_DIR = './client/src/resources/**/*';

var production = environments.make('production');
var tinylr;


gulp.task('css', () => {
    return gulp.src(CSS_DIR)
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(size())
        .pipe(concat('lib.css'))
        .pipe(gulp.dest(PATH_CLIENT + '/css'));
});

gulp.task('sass', () => {     // создаем задачу для сбоки css кода из sass
    gulp.src(SCSS_DIR)
        .pipe(sass({includePaths: ['./node_modules/sass-list-maps'], errLogToConsole: true}))
        .pipe(sass({outputStyle: 'compressed'}))    // минифицируем код
        .pipe(size())
        .pipe(gulp.dest(PATH_CLIENT + '/css'));
});


gulp.task('babel', () => {    // создаем задачу для сбоки js кода
    return browserify(JS_DIR)
        .transform(babelify.configure({presets: ["es2015"]}))
        .bundle()
        .on('error', (err) => { console.error(err); })
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(production(uglify({output: {ascii_only: true}})))
        .pipe(size())
        .pipe(gulp.dest(PATH_CLIENT + '/js'));
});


gulp.task('js-lib', () => {
    gulp.src(JS_LIB_RESOURCES)
        .pipe(concat('lib.js'))
        .pipe(buffer())
        .pipe(production(uglify({output: {ascii_only: true}})))
        .pipe(size())
        .pipe(gulp.dest(PATH_CLIENT + '/js'));
});

gulp.task('livereload', () => {
    tinylr = require('tiny-lr')();
    tinylr.listen(35729);
});


gulp.task('copy-resources', () => {    // переносим ресурсы клиента
    gulp.src(RESOURCES_DIR)
        .pipe(gulp.dest(PATH_CLIENT));
});


function notifyLiveReload(event) {   // если файлы поменялисья, сообщаем это livereload
    var fileName = path.relative(__dirname, event.path);
    tinylr.changed({body: {files: [fileName]}});
}


gulp.task('watch', () => {     // следим за изменениями в проекте
    gulp.watch(CSS_DIR, ['css']);
    gulp.watch(SCSS_DIR, ['sass']);
    gulp.watch([JS_DIR, JS_LIB_DIR], ['babel']);
    gulp.watch(JS_LIB_RESOURCES, ['js-lib']);

    gulp.watch(`${PATH_CLIENT}/css/app.css`, notifyLiveReload);
    gulp.watch(`${PATH_CLIENT}/js/app.js`, notifyLiveReload);
});



gulp.task('web', ['babel', 'js-lib', 'sass', 'css', 'copy-resources']); // задачи для сборки продакшена "NODE_ENV=production gulp web"

gulp.task('default', ['babel', 'js-lib', 'sass', 'css', 'copy-resources', 'livereload', 'watch']);
