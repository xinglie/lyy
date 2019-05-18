/*
    author:xinglie.lkf@alibaba-inc.com
*/
//#snippet;
import Base from './fd';
import ICONS from './icons';
'ref@./layout.sass';
let Fillers = {
    user: ['教授', '司机', '工人', '农民', '老师', '化学家', '海员', '经纪人', '建筑师', '建筑工人', '牧师', '农民', '泥瓦匠', '牛仔'],
    name: ['小花', '小黑', '白求恩', '张艺谋', '李春光', '杨小涛', '小双', '鑫鑫', '大鹏', '蒙蒙', '琪琪', '欢欢', '小辰', '紫菜', '鲁鲁', '小小', '小聪', '壮壮', '小龙', '珂珂', '闹闹', '蓝蓝', '雪儿', '小灵', '小冲', '绵羊', '健康', '欧文', '小赖', '小蔓', '小琪', '小林', '逸轩', '小萍', '芋头', '恬恬', '番薯', '菜菜', '媚媚', '诺诺', '曼曼', '霜儿', '燕子', '乖乖', '双双', '小鹿', '晶晶', '瑞瑞', '小雪', '大喜', '小鱼', '安安', '奕奕', '晋哥', '盈盈', '小淇', '小关', '以南', '小洋', '巍巍', '小竹', '小马', '啾啾', '婷婷', '小森', '智智', '跳跳', '婧婧', '小童', '娃娃', '宁宁', '小毛', '梓坤', '鱼脆', '呱呱', '成成', '小暑', '小致', '俏俏', '杉杉', '虎虎', '泡芙', '小鑫', '都都', '耀耀', '小潇', '元元', '苹苹', '三宝', '米儿', '小笨', '土土', '小煜', '坨坨', '小风', '小段', '暖暖', '逗逗', '城城', '小雅', '淙淙', '小雨', '妙妙', '楠楠', '小敏', '小宜', '赟赟', '小天', '图图', '叮当', '灏灏', '红豆', '卡比', '小武', '小叶', '杰哥', '娟娟', '优优', '蓝天', '小澈', '小青', '阿静', '雯雯', '依依', '北北', '猫猫', '琤琤', '鼹鼠', '阿迪', '轩轩', '龙儿', '小欣', '阿杰', '勇勇', '松露', '峥峥', '阿齐', '小猪', '姗姗', '小巫', '冠冠', '甜甜', '超超', '宝儿', '包包', '凡凡', '球球', '磊磊'],
    place: ['操场', '教室', '海边', '公园', '河边', '篮球场', '足球场', '马路边', '健身馆', '校园', '学校'],
    job: ['跳绳', '做操', '写作业', '打太极', '吃饭'],
    plant: ["风信子", "紫罗兰", "长寿花", "牡丹", "向日葵", "菊花", "郁金香", "荷花", "水仙", "石蒜", "鹤望兰", "大花蕙兰", "番红花", "绿巨人", "吊兰", "勿忘我", "滴水观音", "君子兰", "文竹", "蝴蝶兰", "丹参", "肉苁蓉", "三色堇", "红掌", "龟背竹", "白花蛇舌草", "仙客来", "锁阳", "天竺葵", "白掌", "金心吊兰", "豆瓣绿", "虞美人", "野草莓", "雪绒花", "地黄", '桧柏', '白皮松', '杉木', '侧柏', '臭椿', '樟树', '雪松', '银桦', '柞树', '稠李', '椴树', '冷杉', '银桦', '滇杨', '拐枣', '油茶', '蓝按', '桑树', '垂柳', '刺槐', '银桦', '树柳', '桑树', '松树', '檀树', '桃树', '橡树', '杏树', '杨树', '棷树', '榆树', '樟树', '柞树'],
    i1: ['金币', '糖果', '香蕉', '苹果', '沙果', '海棠', '野樱莓', '枇杷', '欧楂', '山楂', '香梨', '雪梨', '温柏', '蔷薇果', '花楸', '哈密瓜', '香瓜', '白兰瓜', '刺角瓜', '金铃子', '火龙果', '黄龙果'].concat(ICONS),
    i2: ['小狗', '小鸡', '小猫', '小兔', '小熊', '熊猫', '啄木鸟'],
    color: ['红', '橙', '黄', '绿', '青', '蓝', '紫'],
    action: [{
        key: '种',
        value: '{f-plant<item>}'
    }, {
        key: '分到',
        value: '{f-i1<item>}'
    }]
};
let NumWithoutZero = max => {
    let n;
    do {
        n = Math.floor(Math.random() * max);
    } while (n === 0);
    return n;
};
let Templates = {
    '+': [{
        fn(max) {
            let left = NumWithoutZero(max),
                right = NumWithoutZero(max);
            return {
                right,
                left,
                answer: right + left
            };
        },
        templates: [
            '{f-user<u1>}{f-action<a1>-key}了{n-left}个{ref-a1-value}，{f-name<u2>}{ref-a1-key}{n-right}个{ref-item}，{ref-u1}和{ref-u2}一共{ref-a1-key}了多少个{ref-item}？',
            '{f-place<p1>}有{n-left}只{f-i2<a1>}，又来了{n-right}只{ref-a1}，{ref-p1}一共有多少只{ref-a1}？',
            '{f-color<c2>}花比{f-color<c1>}花多{n-right}朵，{ref-c1}花有{n-left}朵，{ref-c2}花有多少朵？',
            '{f-place}有{n-left}只{f-i2<a1>}，{f-i2<a2>}比{ref-a1}多{n-right}只，{ref-a2}有多少只？',
            '{f-place<p1>}{n-left}只{f-i2<a1>}回家了，此时还有{n-right}只{ref-a1}，{ref-p1}原来有几只{ref-a1}？',
            '{f-name<a1>}已经浇了{n-left}颗树，还有{n-right}颗没有浇，{ref-a1}一共要浇多少树？'
        ]
    }, {
        fn(max) {
            let a1 = NumWithoutZero(max),
                a2 = NumWithoutZero(max),
                a3 = NumWithoutZero(max);
            return {
                a1,
                a2,
                a3,
                answer: a1 + a2 + a3
            };
        },
        templates: [
            '{f-user<u1>}{f-action<a1>-key}了{n-a1}个{ref-a1-value}后又{ref-a1-key}{n-a2}个{ref-item}，{f-name<u2>}{ref-a1-key}{n-a3}个{ref-item}，{ref-u1}和{ref-u2}一共{ref-a1-key}了多少个{ref-item}？'
        ]
    }, {
        fn(max) {
            let a1 = NumWithoutZero(max),
                a2 = NumWithoutZero(max);
            return {
                total: a1 + a2,
                a1,
                answer: a1 + a2 + a2
            };
        },
        templates: [
            '一张课桌{n-total}元，比一张椅子贵{n-a1}元，一套课桌椅多少元？',
            '{f-name<u1>}家养{f-i2<a1>}{n-total}只，养的{f-i2<a2>}比{ref-a1}少{n-a1}只，{ref-u1}家一共养{ref-a1}和{ref-a2}多少只？'
        ]
    }, {
        fn(max) {
            let a1 = NumWithoutZero(max),
                a2 = NumWithoutZero(max);
            return {
                width: Math.max(a1, a2),
                height: Math.min(a1, a2),
                answer: 2 * (a1 + a2)
            };
        },
        templates: [
            '要给一幅长{n-width}厘米，宽{n-height}厘米的画做画框。画框的周长至少是多少厘米？'
        ]
    }],
    '-': [{
        fn(max) {
            let left = NumWithoutZero(max),
                right = NumWithoutZero(max);
            return {
                count: left + right,
                left,
                answer: right
            };
        },
        templates: [
            '{f-user<u1>}{f-action<a1>-key}了{n-count}个{ref-a1-value}，{f-name<u2>}比{ref-u1}少{ref-a1-key}{n-left}个{ref-item}，{ref-u2}{ref-a1-key}了多少个{ref-item}？',
            '{f-place<p1>}一共有{n-count}只{f-i2<a1>}，走了{n-left}只{ref-a1}后，{ref-p1}还有多少只{ref-a1}？',
            '{f-name<u1>}借了{n-count}本书，今天还了{n-left}本后，{ref-u1}还有多少本书？',
            '{f-name<u1>}有{n-count}张画，送给{f-name<u2>}一些后，还有{n-left}张，{ref-u1}送给{ref-u2}多少张？',
            '{f-place<p1>}一共有{n-count}只{f-i2<a1>}和{f-i2<a2>}，{ref-a1}有{n-left}只，{ref-a2}有多少只？',
            '商场运回{n-count}台电视，卖出一些后还有{n-left}台，卖出多少台电视？',
            '一共有{n-count}颗树，{f-name<a1>}已经浇了{n-left}棵，{ref-a1}还要浇多少树？'
        ]
    }],
    '*': [{
        fn(max) {
            let left = NumWithoutZero(max),
                right = NumWithoutZero(max);
            return {
                right,
                left,
                answer: right * left
            };
        },
        templates: [
            '{f-user<u1>}{f-action<a1>-key}了{n-left}个{ref-a1-value}，{f-name<u2>}{ref-a1-key}的是它的{n-right}倍，{ref-u2}{ref-a1-key}了多少个{ref-item}？'
        ]
    }, {
        fn(max) {
            let left = NumWithoutZero(max),
                right = NumWithoutZero(max),
                count = NumWithoutZero(max);
            return {
                right,
                left,
                count,
                answer: right * left * count
            };
        },
        templates: [
            '一头牛一天要吃{n-left}千克草。{n-right}头牛{n-count}天要吃多少千克草?',
            '{f-name<u1>}一天要吃{n-left}顿饭。{n-right}个{ref-u1}{n-count}天要吃多少顿饭?',
            '每辆卡车一次可装{n-left}吨货物。用{n-right}辆这样的卡车运{n-count}次，一共可运货物多少吨？',
            '每人每天可装配自行车{n-left}辆，照这样计算，{n-right}人工作{n-count}天，一共装配自行车多少辆？',
            '一台拖拉机每小时可以运货{n-left}吨。照这样计算，{n-right}台这样的拖拉机{n-count}小时可以运货多少吨？'
        ]
    }],
    '/': [{
        fn(max) {
            let left = NumWithoutZero(max),
                right = NumWithoutZero(max);
            let count = left * right;
            return {
                count,
                left,
                answer: right
            };
        },
        templates: [
            '{n-count}个{f-user}在{f-place}{f-job}，{n-left}人一组，可以分成多少组？',
            '{n-count}个{f-user}{f-job}，每{n-left}人分一组，可以分成多少组?',
            '{f-user}有{n-count}个{f-i1<item>}，他决定将这些{ref-item}分给{n-left}个小朋友，每个小朋友分多少个{ref-item}？'
        ]
    }]
};
let List = [10, 20, 30, 40, 50, 60, 80, 100];
let NumFillerReg = /\{n-([^}]+)\}/g;
let FillerReg = /\{f-([^}\-<>]+)(?:<([^>]+)>)?(?:\-([^}\-<>]+))?\}/g;
let RefFillerReg = /\{ref\-([^-}]+)(?:\-([^}]+))?\}/g;
let GetExpr = (index) => {
    let operates;
    if (index % 2) {
        operates = ['*', '/'];
    } else {
        operates = ['+', '-'];
    }
    let o = '',
        nums,
        desc = '';
    do {
        o = operates[Math.floor(Math.random() * operates.length)];
        let list = Templates[o];
        if (list) {
            let g = list[Math.floor(Math.random() * list.length)];
            nums = g.fn(List[Math.floor(index / 2)]);
            desc = g.templates[Math.floor(Math.random() * g.templates.length)];
            break;
        }
    } while (!Templates[o]);
    let fillers = {}, locker = {};
    desc = desc.replace(NumFillerReg, (_, key) => {
        return nums[key];
    });
    while (FillerReg.test(desc)) {
        FillerReg.lastIndex = 0;
        desc = desc.replace(FillerReg, (_, key, refName, sub) => {
            let list = Fillers[key];
            let i, o;
            do {
                i = Math.floor(Math.random() * list.length)
                o = list[Math.floor(Math.random() * list.length)];
                if (DEBUG && locker[key + '\x1f' + i]) {
                    console.log('exist', i, key, locker, desc);
                }
            } while (locker[key + '\x1f' + i]);
            locker[key + '\x1f' + i] = 1;
            if (refName) {
                fillers[refName] = o;
            }
            if (sub) {
                o = o[sub];
            }
            return o;
        }).replace(RefFillerReg, (_, key, sub) => {
            let o = fillers[key];
            if (o) {
                return sub ? o[sub] : o;
            }
            return _;
        });
    }
    return {
        desc,
        userAnswer: -1,
        answer: nums.answer
    };
};
let GetGroup = (count, index) => {
    let group = [];
    let i = 0, e;
    while (i < count) {
        e = GetExpr(index);
        i++;
        group.push(e);
    }
    return group;
};
export default Base.extend({
    tmpl: '@ap.html',
    ctor() {
        this.set({
            n: 0
        });
    },
    render() {
        let group = GetGroup(12, this.get('n'));
        this.digest({
            nList: List,
            group,
            current: 0
        });
    },
    '@{save.value}<input>'(e) {
        let { expr } = e.params;
        expr.temp = e.eventTarget.value;
    },
    '@{save}<click>'(e) {
        let { expr } = e.params;
        expr.correct = expr.temp == expr.answer;
        expr.userAnswer = expr.temp;
        this.digest({
            group: this.get('group')
        });
    }
});