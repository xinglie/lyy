//#snippet;
let Magix = require('magix5');
Magix.applyStyle('@index.sass');
let N_LIST = [10, 20, 30, 50, 100];
let ICONS = ['🐶', '☘️', '🍁', '🌷', '🌞', '🌹', '🌺', '🌸', '🌼', '🌴', '🐓', '🐘', '🦕', '🦖', '🐟', '🦀', '🦐', '🐸', '🐤', '🐜', '🐌', '🦋', '🐯', '🐿', '🐥', '🐼', '🐻', '🐭', '🦉', '🐺', '🐞', '🐚', '🐌', '🐳', '🐋', '🦈', '🐊', '🐫', '🐪', '🦍', '🦓', '🦒', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🐐', '🦌', '🐕', '🐩', '🐈', '🦃', '🕊', '🐇', '🐁', '🦔', '⛄️', '🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🥝', '🍅', '🥥', '🥑', '🍆', '🥔', '🥕', '🌽', '🌶', '🥒', '🥦', '🍄', '🥜', '🌰', '🍞', '🥐', '🥖', '🥨', '🥞', '🧀', '🍖', '🍗', '🥩', '🥓', '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '🍳', '🍲', '🥣', '🥗', '🍿', '🥫', '🍱', '🍘', '🍙', '🍚', '🍛', '🍜', '🍝', '🍠', '🍢', '🍣', '🍤', '🍥', '🍡', '🥟', '🥠', '🥡', '🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🥧', '🍫', '🍬', '🍭', '🍮', '🖋', '🖊', '🖌', '🖍', '⚽', '⚾', '🏀', '🏐', '🏈', '🏉', '🎾', '🚌', '🚍', '🚎', '🚐', '🚑', '🚒', '🚓', '🚔', '🚕', '🚖', '🚗', '🚘', '🚚', '🚛', '🚜', '🚲', '🛴', '🛵'];
module.exports = Magix.View.extend({
    tmpl: '@index.html',
    ctor() {
        this.set({
            n: 1
        });
    },
    '@{getExpr}'() {
        let n = this.get('n');
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
    },
    '@{getGroup}'(count) {
        let group = [];
        let locker = {};
        let i = 0, e, key;
        let n = this.get('n');
        let n_max = N_LIST[n], left, right;
        let minCount = 0, zeroCount = 0;
        while (i < count) {
            e = this['@{getExpr}']();
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
    },
    render() {
        let group = this['@{getGroup}'](20);
        this.digest({
            nList: N_LIST,
            group,
            current: 0
        });
    },
    '@{changeExpr}'(index) {
        clearTimeout(this['@{next.timer}']);
        this.digest({
            current: index
        });
    },
    '@{do}<click>'(e) {
        let group = this.get('group');
        let current = this.get('current');
        let expr = group[current];
        if (expr.userAnswer == -1) {
            let index = e.params.index;
            expr.userAnswer = expr.answers[index];
            expr.correct = expr.userAnswer == expr.answer;
            this.digest({
                group
            });
            if (current < group.length + 1) {
                this['@{next.timer}'] = setTimeout(() => {
                    do {
                        expr = group[++current];
                    } while (expr && expr.userAnswer !== -1);
                    if (expr && expr.userAnswer === -1) {
                        this['@{changeExpr}'](current);
                    }
                }, 1e3);
            }
        }
    },
    '@{show}<click>'(e) {
        this['@{changeExpr}'](e.params.index);
    },
    '@{prev}<click>'() {
        let current = this.get('current');
        if (current > 0) {
            this['@{changeExpr}'](current - 1);
        }
    },
    '@{next}<click>'() {
        let group = this.get('group');
        let current = this.get('current');
        if (current < group.length - 1) {
            this['@{changeExpr}'](current + 1);
        }
    },
    '@{group}<click>'() {
        this.render();
    },
    '@{set.n.index}<change>'(e) {
        this.set({
            n: e.eventTarget.selectedIndex
        });
        this.render();
    }
});