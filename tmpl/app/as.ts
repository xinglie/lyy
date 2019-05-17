//#snippet;
'ref@./layout.sass';
import ICONS from './icons';
import Base from './fd';
'ref@./layout.sass';
let N_LIST = [10, 20, 30, 50, 100];
let GetExpr = n => {
    let operate, answers = [], answer;
    let left, right, n_max = N_LIST[n];
    do {
        left = Math.floor(Math.random() * n_max);
        right = Math.floor(Math.random() * n_max);
    } while (left === 0 || right === 0);
    if (left + right <= n_max && Math.random() < 0.9) {
        answer = left + right;
        operate = '+';
        let start = Math.min(n_max, answer + 2);
        if (start < 3) start = 3;
        do {
            answers.push(start--);
        } while (answers.length != 4 && start >= 0);
    } else {
        let max = Math.max(left, right);
        if (max == right) {
            right = left;
            left = max;
        }
        operate = '-';
        answer = left - right;
        let start = Math.max(0, answer - 2);
        do {
            answers.push(start++);
        } while (answers.length != 4 && start <= n_max);
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
    let locker = {};
    let i = 0, e, key;
    let left, right;
    let minCount = 0, zeroCount = 0;
    while (i < count) {
        e = GetExpr(n);
        left = Math.min(e.left, e.right);
        right = Math.max(e.left, e.right);
        key = `${left}\x1e${right}\x1e${e.operate}`;
        if (Math.abs(left - right) < 4) {
            if (minCount > 2) {
                locker[key] = 1;
            }
            minCount++;
        }
        if (e.operate == '-' && left == right) {
            if (zeroCount) {
                locker[key] = 1;
            }
            zeroCount++;
        }
        if (!locker[key]) {
            locker[key] = 1;
            i++;
            group.push(e);
        } else {
            console.log('warn: same' + key);
        }
    }
    return group;
};
module.exports = Base.extend({
    tmpl: '@as.html',
    ctor() {
        this.set({
            n: 1
        });
    },
    render() {
        let group = GetGroup(20, this.get('n'));
        this.digest({
            nList: N_LIST,
            group,
            current: 0
        });
    }
});