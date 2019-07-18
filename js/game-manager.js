class GameManager {
    static get STATE_WITE() {
        return 'wait';
    };

    static get STATE_WIN() {
        return 'win';
    }

    static get STATE_LOSE() {
        return 'lose';
    }

    constructor () {
        this.cardInfos = {};
        this.actionInfos = {};
        this.showAssets = {};

        this.isReady = false;

        this.__init();
    }

    setShowAsset(asset) {
        const me = this;

        if (me.isReady) {
            me.showAssets[asset.id] = asset;

            const itemArr = asset.itemArr;

            for (let i = 0; i < itemArr.length; i++) {
                const item = itemArr[i];

                if (me.cardInfos[item.name] && !me.actionInfos[item.id]) {
                    me.actionInfos[item.id] = new ActionInfo(me.cardInfos[item.name].actionInfo);
                }
            }

            // 화면의 상태가 변경되었기 때문에 모든 애니메이션 시간을 초기화 한다.
            for (let key in me.actionInfos) {
                if(me.actionInfos.hasOwnProperty(key)) {
                    me.actionInfos[key].reset();
                }
            }
        }
    }

    setHideAsset(asset) {
        const me = this;

        delete me.showAssets[asset.id];
    }

    decideWinLose(nemoAr) {
        const me = this;

        // 기본 형태가 보이도록 설정.
        me.changeState(nemoAr.getItemArray(), GameManager.STATE_WITE);

        // 같은 이름을 가진 에셋을 묶어서 처리한다.
        const showAssetArr = Object.values(me.showAssets);

        let itemArr = [];

        for (let i = 0; i < showAssetArr.length; i++) {
            itemArr = itemArr.concat(showAssetArr[i].itemArr);
        }

        const assetGroups = {};

        for (let i = 0; i < itemArr.length; i++) {
            if (!assetGroups[itemArr[i].name]) {
                assetGroups[itemArr[i].name] = [];
            }

            assetGroups[itemArr[i].name].push(itemArr[i]);
        }

        const nameArr = Object.keys(assetGroups);
        
        // 서로 다른 두 종류가 있어야 (각각의 개수는 무시) 승패를 계산한다.
        if (me.isReady && nameArr.length == 2) {
            const card1 = me.cardInfos[nameArr[0]];
            const card2 = me.cardInfos[nameArr[1]];

            const groupArr1 = assetGroups[card1.name];
            const groupArr2 = assetGroups[card2.name];

            // 카드 정보로 승패를 구분한다.
            if (card1.attack > card2.attack) {
                me.changeState(groupArr1, GameManager.STATE_WIN);
                me.changeState(groupArr2, GameManager.STATE_LOSE);

            } else if (card1.attack < card2.attack) {
                me.changeState(groupArr2, GameManager.STATE_WIN);
                me.changeState(groupArr1, GameManager.STATE_LOSE);
            }
        }
    }

    changeState(assetItemArr, state) {
        const me = this;

        const settingNextTime = function (item, actionTimes) {
            // 아이템 애니메이션 끝 이벤트에 등록.
            item.onAnimationEnd = function () {
                item.animationStop();

                const cycle = actionTimes.cycle;
                const actionTime = actionTimes.actionTime();
                
                // 처음 재생은 모든 항목을 실행한다.
                if (cycle == 0) {
                    item.setAnimationTime(actionTime.start, actionTime.end, actionTime.loop);

                    setTimeout(function () {
                        item.animationPlay();
                    }, 1);

                // 처음 재생이 아닌 경우에는 마지막 요소값의 반복 옵션을 확인하여 처리한다.
                } else {
                    const lastActionTime = actionTimes.timeArr[actionTimes.timeArr.length - 1];

                    if (lastActionTime && lastActionTime.loop) {
                        item.setAnimationTime(actionTime.start, actionTime.end, lastActionTime.loop);

                        setTimeout(function () {
                            item.animationPlay();
                        }, 1);
                    }
                }
            };
        };

        for (let i = 0; i < assetItemArr.length; i++) {
            const item = assetItemArr[i];

            if (me.actionInfos[item.id]) {
                item.animationStop();

                // 등록되어 있는 첫 번째 플레이 영역을 실행한다.
                const actionTimes = me.actionInfos[item.id][state];

                const actionTime = actionTimes.actionTime();
                item.setAnimationTime(actionTime.start, actionTime.end, actionTime.loop);

                item.animationPlay();

                // 첫 번째 플레이 영역이 실행된 후 이어서 실행될 정보를 등록한다.
                settingNextTime(item, actionTimes);
            }
        }
    }

    __init() {
        const me = this;

        const cards = new Cards();

        cards.getData().then(function (cardArr) {
            me.isReady = true;

            for (let i = 0; i < cardArr.length; i++) {
                me.cardInfos[cardArr[i].name] = cardArr[i];
            }
        });
    }
}