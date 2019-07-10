class Card {
    constructor (obj) {
        this.name = obj.name;
        this.attack = obj.attack;
    }
}

class Cards {
    info() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: 'json/cards.json',
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