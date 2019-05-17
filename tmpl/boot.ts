//#exclude=define;
'@./libs/sea.js';
'@./libs/magix.js';
'@./app/layout.ts';
'@./app/icons.ts';
'@./app/fd.ts';
'@./app/as.ts';
'@./app/md.ts';
'@./app/ap.ts';

(() => {
    let Magix = require('magix5');
    Magix.boot({
        defaultView: 'app/layout'
    });
})();