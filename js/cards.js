class ActionTime {
    constructor (obj = {}) {
        this.start = obj.start || 0;
        this.end = obj.end || 0;
        this.loop = (typeof obj.loop === 'boolean') ? obj.loop : true;
    }
}

class ActionTimes {
    constructor (obj) {
        this.cursor = 0;
        this.cycle = 0;
        this.timeArr = [];

        const arr = obj.timeArr || [];

        for (let i = 0; i < arr.length; i++) {
            this.timeArr.push(new ActionTime(arr[i]));
        }
    }

    reset() {
        const me = this;

        me.cursor = 0;
        me.cycle = 0;
    }

    actionTime() {
        const me = this;

        let time = null;

        if (me.timeArr.length) {
            time = me.timeArr[me.cursor];

            me.cursor++;

            if (me.cursor == me.timeArr.length) {
                me.cursor = 0;
                me.cycle++;
            }
        }

        return time;
    }
}

class ActionInfo {
    constructor (obj = {}) {
        this.wait = new ActionTimes(obj.wait || []);
        this.win = new ActionTimes(obj.win || []);
        this.lose = new ActionTimes(obj.lose || []);
    }

    reset() {
        const me = this;

        me.wait.reset();
        me.win.reset();
        me.lose.reset();
    }
}

class Card {
    constructor (obj = {}) {
        this.name = obj.name;
        this.attack = obj.attack;
        this.actionInfo = new ActionInfo(obj.actionInfo || {});
    }
}

class Cards {
    getData() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: 'json/cards2.json',
                method: 'get',
                dataType: 'json'

            }).done(function (cardArr) {
                const arr = [];

                for (let i = 0; i < cardArr.length; i++) {
                    arr.push(new Card(cardArr[i]));
                }

                resolve(arr);

            }).fail(
                reject
            );
        });
    }
}