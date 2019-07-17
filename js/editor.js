const gui = new dat.GUI();
const guiAsset = gui.addFolder('Asset');
const guiItem = gui.addFolder('Item');
const assets = new Assets();

const control = {
    open: -1,
    name: '',
    itemName: '',
    scale: 0.01,
    positionX: 0.01,
    positionY: 0.01,
    positionZ: 0.01,
    rotationX: 0.01,
    rotationY: 0.01,
    rotationZ: 0.01,
    animationStartTime: 0,
    animationEndTime: 0,
    animationLoop: true,
    itemHide: false,
    importFbx: () => {
        const path = prompt('경로입력', 'ar/files/');

        if (path) {
            nemoArEditor.import({
                type: 'fbx',
                itemUrl: path
            });
        }
    },
    copyToClipboard: () => {
        const textEl = document.createElement('textarea');
        document.body.appendChild(textEl);
        textEl.value = nemoArEditor.exportJson();
        textEl.select();
        document.execCommand('copy');
        document.body.removeChild(textEl);
    },
    remove: () => {
        nemoArEditor.remove();
    },
    removeAll: () => {
        nemoArEditor.removeAll();
    }
};

const nemoArEditor = new NemoArEditor({
    baseUrl: './',
    rootElement: $('#ar-editor').get(0),
    width: 800,
    height: 600,
    onSelect: onSelect,
    onDeselect: onDeselect,
    onMove: (arr) => {}
});

assets.getData().then((assetArr) => {
    guiAsset.open();
    guiItem.open();

    guiAsset.add(control, 'open', {'test': 0}).onChange((index) => {
        nemoArEditor.open(assetArr[index]);
    });
    guiAsset.add(control, 'name').onFinishChange(onItemInfoChange);
    guiAsset.add(control, 'importFbx');
    guiAsset.add(control, 'copyToClipboard');
    guiAsset.add(control, 'remove');
    guiAsset.add(control, 'removeAll');

    guiItem.add(control, 'itemName').onFinishChange(onItemInfoChange);
    guiItem.add(control, 'scale').onFinishChange(onItemInfoChange);
    guiItem.add(control, 'positionX').onFinishChange(onItemInfoChange);
    guiItem.add(control, 'positionY').onFinishChange(onItemInfoChange);
    guiItem.add(control, 'positionZ').onFinishChange(onItemInfoChange);
    guiItem.add(control, 'rotationX', -180, 180).onFinishChange(onItemInfoChange);
    guiItem.add(control, 'rotationY', -180, 180).onFinishChange(onItemInfoChange);
    guiItem.add(control, 'rotationZ', -180, 180).onFinishChange(onItemInfoChange);
    guiItem.add(control, 'animationStartTime').onFinishChange(onItemInfoChange);
    guiItem.add(control, 'animationEndTime').onFinishChange(onItemInfoChange);
    guiItem.add(control, 'animationLoop').onFinishChange(onItemInfoChange);
    guiItem.add(control, 'itemHide').onFinishChange(onItemHideChange);
});

function onSelect(itemInfo) {
    control.name = itemInfo.parentAsset.name;
    control.itemName = itemInfo.name;
    control.scale = itemInfo.scale.x;
    control.positionX = itemInfo.position.x;
    control.positionY = itemInfo.position.y;
    control.positionZ = itemInfo.position.z;
    control.rotationX = itemInfo.rotation.x * (180 / Math.PI);
    control.rotationY = itemInfo.rotation.y * (180 / Math.PI);
    control.rotationZ = itemInfo.rotation.z * (180 / Math.PI);
    control.animationStartTime = itemInfo.animationStartTime;
    control.animationEndTime = itemInfo.animationEndTime;
    control.animationLoop = itemInfo.animationLoop;
    control.itemHide = !itemInfo.isVisible;

    for (let key in gui.__folders) {
        for (let i = 0; i < gui.__folders[key].__controllers.length; i++) {
            gui.__folders[key].__controllers[i].updateDisplay();
        }
    }
}

function onDeselect() {
    control.name = '';
    control.itemName = '';
    control.scale = 1;
    control.positionX = 0;
    control.positionY = 0;
    control.positionZ = 0;
    control.rotationX = 0;
    control.rotationY = 0;
    control.rotationZ = 0;
    control.itemHide = false;

    updateUi();
}

function onItemInfoChange() {
    const asset = nemoArEditor.openAsset;
    const item = nemoArEditor.selectedItem;

    if (item) {
        asset.name = control.name;
        item.name = control.itemName;

        nemoArEditor.setScale(control.scale, control.scale, control.scale);
        nemoArEditor.setPosition(control.positionX, control.positionY, control.positionZ);
        nemoArEditor.setRotation(control.rotationX * (Math.PI / 180), control.rotationY * (Math.PI / 180), control.rotationZ * (Math.PI / 180));
        nemoArEditor.setAnimationTime(control.animationStartTime, control.animationEndTime, control.animationLoop);
    }
}

function onItemHideChange(bool) {
    const item = nemoArEditor.selectedItem;

    if (item && bool) {
        item.hide();

    } else if (item && !bool) {
        item.show();
    }
}

function updateUi() {
    for (let key in gui.__folders) {
        for (let i = 0; i < gui.__folders[key].__controllers.length; i++) {
            gui.__folders[key].__controllers[i].updateDisplay();
        }
    }
}