//#snippet;
/*
    author:xinglie.lkf@alibaba-inc.com
*/
import Magix from 'magix5';
export default Magix.View.extend({
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
            if (expr.correct) {
                let marker = this.getMarker();
                this['@{next.timer}'] = setTimeout(() => {
                    if (marker()) {
                        do {
                            expr = group[++current];
                        } while (expr && expr.userAnswer !== -1);
                        if (expr && expr.userAnswer === -1) {
                            this['@{changeExpr}'](current);
                        }
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