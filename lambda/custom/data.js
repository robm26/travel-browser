
const data      = require('./data/cities.json');

module.exports = {

    'getCityList': function (country) {

        const listMock = [
            {"city":"Dublin",        "country":"Ireland", "fileName":"city-dublin._TTH_.jpg", "date":"2018-11-21"},
            {"city":"Philadelphia",  "country":"USA",     "fileName":"city-philadelphia._TTH_.jpg", "date":"2017-12-12"},
            {"city":"Portland",      "country":"USA",     "fileName":"city-portland._TTH_.jpg", "date":"2017-12-19"},
            {"city":"Boston",        "country":"USA",     "fileName":"city-boston._TTH_.jpg", "date":"2018-03-22"},
            {"city":"Denver",        "country":"USA",     "fileName":"city-denver._TTH_.jpg", "date":"2018-04-11"},
            {"city":"London",        "country":"UK",      "fileName":"city-london._TTH_.jpg", "date":"2018-05-03"}
        ];

        const list = data;
        let filteredList = [];

        list.forEach(function (item) {
            if (country.toUpperCase() === item.country.toUpperCase() || country === '' ) {
                filteredList.push(item.city);
            }
        });

        return filteredList;
    },
    'getCountryList': function () {

        const list = data;
        let filteredList = [];

        list.forEach(function (item) {
            if (filteredList.indexOf(item.country) === -1) {
                filteredList.push(item.country);
            }
        });

        return filteredList;
    },
    'getImgUrl': function (city) {

        let urlBase = `https://s3.amazonaws.com/skill-images-789/travel/`;
        let url = `${urlBase}Toronto.jpg`;

        data.forEach(function (item) {
            if (city.toUpperCase() === item.city.toUpperCase()  ) {
                url = `${urlBase}${item.fileName}`;
            }
        });

        return url;
    },
    'getAirportCode': function (city) {

        //let urlBase = `https://s3.amazonaws.com/skill-images-789/travel/`;
        let code = `${city} is an amazing city`;

        data.forEach(function (item) {
            if (city.toUpperCase() === item.city.toUpperCase()  ) {
                code = `${item.code}`;
            }
        });

        return code;
    }
};
