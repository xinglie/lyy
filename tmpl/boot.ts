//#exclude=define;
'@./libs/sea.js';
'@./libs/magix.js';
'@./app/index.ts';

(() => {
    let Magix = require('magix');
    Magix.boot({
        defaultView: 'app/index'
    });
})();