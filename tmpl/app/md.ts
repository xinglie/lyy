/*
    author:xinglie.lkf@alibaba-inc.com
*/
//#snippet;
import ICONS from './icons';
import Base from './fd';
'ref@./layout.sass';
let E_List = [10, 20, 30, 50, 100];
let GetExpr = n => {
    let operate, answers = [], answer;
    let left, right, n_max = E_List[n];
    do {
        left = Math.floor(Math.random() * n_max);
        right = Math.floor(Math.random() * n_max);
    } while (right === 0);
    if (Math.random() < 0.5) {
        answer = left * right;
        operate = '×';
        let start = answer + 2;
        if (start < 3) start = 3;
        do {
            answers.push(start--);
        } while (answers.length != 4);
    } else {
        answer = left * right;
        left = answer;
        answer = left / right;
        operate = '÷';
        let start = answer + 2;
        if (start < 3) start = 3;
        do {
            answers.push(start--);
        } while (answers.length != 4);
    }
    answers = answers.sort(() => Math.random() < 0.5 ? 1 : -1);
    return {
        left,
        right,
        operate,
        answers,
        answer,
        icon: ICONS[Math.floor(Math.random() * ICONS.length)],
        userAnswer: -1
    }
};
let GetGroup = (count, n) => {
    let group = [];
    let i = 0, e;
    while (i < count) {
        e = GetExpr(n);
        i++;
        group.push(e);
    }
    return group;
};
export default Base.extend({
    tmpl: '@md.html',
    ctor() {
        this.set({
            n: 0
        });
    },
    render() {
        let group = GetGroup(20, this.get('n'));
        this.digest({
            nList: E_List,
            group,
            current: 0
        });
    }
});