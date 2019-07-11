const nemoAr = new NemoAr({
    baseUrl: './',
    arToolkitBaseUrl: './lib/nemoar/data',
    rootElement: $('#ar-view').get(0),
    width: window.innerWidth,
    height: window.innerHeight,
    onInit: function () {
        const cards = new Cards();
        const assets = new Assets();

        cards.info().then(function (cardArr) {
            gameManager.setCardInfoArr(cardArr);
        });

        assets.info().then(function (assetArr) {
            const promiseArr = [];

            for (let i = 0; i < assetArr.length; i++) {
                promiseArr.push(nemoAr.import(assetArr[i]));
            }

            Promise.all(promiseArr).then(function () {
                gameManager.decideWinLose();
            });
        });

    },
    onShowAsset: function (asset) {
        // 캐릭터가 보여지면 매니저에 등록한다.
        gameManager.addAsset(asset);
        gameManager.decideWinLose();

    },
    onHideAsset: function (asset) {
        // 캐릭터가 숨겨지면 매니저에서 제거한다.
        gameManager.removeAsset(asset);
        gameManager.decideWinLose();

    },
    onError: function () {
        console.log('onError');

    },
    onPopup: function () {
        console.log('onPopup');

    },
    onClick: function (assetItem) {
        console.log('onClick : ' + assetItem.name);
    }
});

const gameManager = new GameManager(nemoAr);

let resizeTimeout;

function resize() {
    clearTimeout(resizeTimeout);

    nemoAr.hideSource();
    nemoAr.stop();

    resizeTimeout = setTimeout(function () {
        const $window = $(window);

        // iOS 사파리 가로 모드로 전환시 주소 표시줄을 숨기기 위해 기본 크기보다 1 크게 한다.
        nemoAr.resize($window.width(), $window.height() + 1);

        nemoAr.showSource();
        nemoAr.start();
    }, 300);
}

$(window).on('resize', function () {
    resize();
}).trigger('resize');