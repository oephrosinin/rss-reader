Rss reader application
---------


----------


###Используемые технологии, зависимости:

 1. Git
 2. NodeJS ( > 4, использую 6.2 )
 3. Jade
 4. MongoDB ( > 2.4, использую 3.26)
 5. Gulp (npm i gulp -g)
----------

###Настройки приложения:

Настройки хранятся в файле config.js:

----------

###Запуск приложения

    npm run start

**Внимание!** перед запуском убедитесь , что запущен:

    mongodb


----------
###Сборка приложения

    npm run build

Выполняется команда npm i, а затем собирается проект NODE_ENV=production gulp web ;)

Чтобы выполнить простую сборку, достаточно выполнить команду:

    npm run prod

Также есть возможность установить нужное ПО для работы приложением глобально, если не установлено и сразу собрать проект:

    sudo npm run full-build

Тоже самое, что поочередно выполнить команды:

    1. apt-get install nodejs // установка node.js
    2. apt-get install npm    // устaновка npm
    3. npm run gulp-i         // установка gulp

----------
###Структура проекта

    |- client/
      |- src/
        |- js/
        |- styles/
          |- css/
          |- scss/
        |- resources/
          |- fonts/
          |- images/
      |- public/
    |- server/
        |- models/
        |- routes/
        |- util/
    |- templates/
    |- node_modules/
    |- app.js
    |- config.js
    |- gulpfile.js
    |- package.json
    |- README.md


####Папка "client"

Логика и все ресурсы клиента находятся в src. При сборке, gulp создает папку public и собирает файлы css и js копирует в нее ресурсы

####Папка "server"

Содержит логику сервера. Краткое описание содержимого:

- models - содержит так называемые модули (в ней рассположен модуль Rss, который обеспечивает редактирование/удаление/добавление каналов)

- routes - обрабатывает наши роуты и подключаем необходимые параметры

- util - нужные функции, методы для связи с БД и тд.

####Папка "templates"

Здесь хранятся шаблоны в формате .jade

---------

###Основные используемые плагины

- **Сборка**: gulp и его дополнительные модули
- **Получение и обработка rss**: jQuery-rss (https://github.com/sdepold/jquery-rss), поддерживающий, также и atom
- **Модуль для построение диагрмм**: Chart.js (http://www.chartjs.org/)
- **DB middleware**: Mongojs (https://github.com/mafintosh/mongojs)