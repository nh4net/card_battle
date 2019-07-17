const gameManager = new GameManager();

const nemoAr = new NemoAr({
    baseUrl: './',
    arToolkitBaseUrl: './lib/nemoar/data',
    rootElement: $('#ar-view').get(0),
    width: window.innerWidth,
    height: window.innerHeight,
    onInit: function () {
        const assets = new Assets();

        assets.getData().then(function (assetArr) {
            const promiseArr = [];

            for (let i = 0; i < assetArr.length; i++) {
                promiseArr.push(nemoAr.import(assetArr[i]));
            }

            Promise.all(promiseArr).then(function () {
                gameManager.decideWinLose(nemoAr);
            });
        });

    },
    onShowAsset: function (asset) {
        // 캐릭터가 보여지면 매니저에 등록한다.
        gameManager.setShowAsset(asset);
        gameManager.decideWinLose(nemoAr);

    },
    onHideAsset: function (asset) {
        // 캐릭터가 숨겨지면 매니저에서 제거한다.
        gameManager.setHideAsset(asset);
        gameManager.decideWinLose(nemoAr);

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

function resize() {
    const $window = $(window);

    // iOS 사파리 가로 모드로 전환시 주소 표시줄을 숨기기 위해 기본 크기보다 1 크게 한다.
    nemoAr.resize($window.width(), $window.height() + 1);
}

$(window).on('resize', function () {
    resize();
}).trigger('resize');