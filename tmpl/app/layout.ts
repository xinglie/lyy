/*
    author:xinglie.lkf@alibaba-inc.com
*/
//#snippet;
import Magix from 'magix5';
Magix.applyStyle('@layout.sass');
let Views = [{
    text: '加减',
    view: '@./as'
}, {
    text: '乘除',
    view: '@./md'
}, {
    text: '应用题',
    view: '@./ap'
}];
export default Magix.View.extend({
    tmpl: '@layout.html',
    render() {
        this.digest({
            active: 0,
            views: Views
        });
    },
    '@{active}<click>'(e) {
        this.digest({
            active: e.params.i
        });
    }
});