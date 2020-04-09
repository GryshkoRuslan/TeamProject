const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

let dateConversion = (date) => {
    if (isNaN(Date.parse(date))) {
        return date
    } else {
        return dayjs.utc(date, 'YYYY-MM-DD').local().format();
    }
};
module.exports.dateConversion = dateConversion;
