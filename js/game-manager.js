class GameManager {
    static STATE_WITE = 'wait';
    static STATE_WIN = 'win';
    static STATE_LOSE = 'lose';

    constructor (nemoAr) {
        this.nemoAr = nemoAr || null;
        this.assetItemArr = []
        this.cards = {};
        this.showAssets = {};
    }

    witeCard(cardArr) {
        const me = this;

        for (let i = 0; i < cardArr.length; i++) {
            me.cards[cardArr[i].name] = cardArr[i];
        }
    }

    addAsset(asset) {
        const me = this;

        me.showAssets[asset.id] = asset;
    }

    removeAsset(asset) {
        const me = this;

        delete me.showAssets[asset.id];
    }

    decideWinLose() {
        const me = this;

        // 기본 형태가 보이도록 설정.
        me.__changeState(me.nemoAr.getItemArray(), GameManager.STATE_WITE);

        // 같은 모양의 카드가 동시에 잡히는 경우를 생각해서 보여지고 있는 에셋을 이름별로 구분한다.
        const showAssetArr = Object.values(me.showAssets);
        const assetGroups = {};

        let i = 0;

        for (i = 0; i < showAssetArr.length; i++) {
            if (!assetGroups[showAssetArr[i].name]) {
                assetGroups[showAssetArr[i].name] = [];
            }

            assetGroups[showAssetArr[i].name].push(showAssetArr[i]);
        }

        // 두 종류의 카드가 화면에 표시되어 있는 경우 승패를 처리한다.
        const nameArr = Object.keys(assetGroups);

        if (nameArr.length == 2) {
            const card1 = me.cards[nameArr[0]];
            const card2 = me.cards[nameArr[1]];

            const groupArr1 = assetGroups[card1.name];
            const groupArr2 = assetGroups[card2.name];

            // 상태변환을 쉽게 하기 위해 같은 이름을 가진 에셋의 아이템을 하나의 배열로 만든다.
            let itemArr1 = [];
            let itemArr2 = [];

            for (i = 0; i < groupArr1.length; i++) {
                itemArr1 = itemArr1.concat(groupArr1[i].itemArr);
            }

            for (i = 0; i < groupArr2.length; i++) {
                itemArr2 = itemArr2.concat(groupArr2[i].itemArr);
            }

            // 카드 정보로 승패를 구분한다.
            if (card1.attack > card2.attack) {
                me.__changeState(itemArr1, GameManager.STATE_WIN);
                me.__changeState(itemArr2, GameManager.STATE_LOSE);

            } else if (card1.attack < card2.attack) {
                me.__changeState(itemArr2, GameManager.STATE_WIN);
                me.__changeState(itemArr1, GameManager.STATE_LOSE);
            }
        }
    }

    __changeState(assetItemArr, state) {
        for (let i = 0; i < assetItemArr.length; i++) {
            const item = assetItemArr[i];

            if (item.name.indexOf(state) > -1) {
                item.show();

            } else {
                item.hide();
            }
        }
    }
}