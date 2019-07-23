class Assets {
    getData() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: 'json/assets.json',
                method: 'get',
                dataType: 'json'
            }).done(
                resolve
            ).fail(
                reject
            );
        });
    }
}