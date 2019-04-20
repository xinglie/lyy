//#exclude=define;
'@./libs/sea.js';
'@./libs/magix.js';
'@./app/index.ts';

(() => {
    let Magix = require('magix5');
    Magix.boot({
        defaultView: 'app/index'
    });
})();