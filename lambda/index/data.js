
const data      = require('./data/cities.json');

module.exports = {

    'getCityList': function (country) {

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
        let code = `unknown`;

        data.forEach(function (item) {
            if (city.toUpperCase() === item.city.toUpperCase()  ) {
                code = `${item.code}`;
            }
        });

        return code;
    },
    'getDescription': function (city) {

        //let urlBase = `https://s3.amazonaws.com/skill-images-789/travel/`;
        let description = `unknown`;

        data.forEach(function (item) {
            if (city.toUpperCase() === item.city.toUpperCase()  ) {
                description = `${item.description}`;
            }
        });

        return description;
    }
};
