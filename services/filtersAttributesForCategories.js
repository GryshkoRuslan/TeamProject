const categoriesArrWithId = [
    {
        name: 'smartphones',
        ids: [2,7],
    },
    {
        name: 'tablets',
        ids: [4,23],
    },
    {
        name: 'laptop',
        ids: [3,8,9],
    },
    {
        name: 'PC',
        ids: [8,10],
    },
    {
        name: 'watches',
        ids: [5,22],
    },
];

//возвращает атрибуты товаров, которые будут использоваться в фильтрах
const filtersAttributesForCategories = (categoryID) => {
    let categoryName = categoriesArrWithId.map(c => {
        let arr = c.ids.filter(id => id==categoryID);
        if (arr.length>0) {
            return c.name
        }
    }).filter(name=> name!==undefined);

    if (categoryName == 'smartphones') {
        return [1,2,3,5,6,7,9,10,11,13,15,18]
    } else if (categoryName == 'tablets') {
        return [1,2,3,5,6,9,10,11,13,15]
    } else if (categoryName == 'laptop') {
        return [1,2,3,5,6,9,15,17,22,29,30,31,32,33,34,40,41]
    } else if (categoryName == 'PC') {
        return [5,6,9,17,22,29,30,31,32,33,34,39,40,41]
    } else if (categoryName == 'watches') {
        return [1,2,3,5,6,7,14,15,18,19,20,21,35,36]
    } else {
        return false
    }
};
module.exports.filtersAttributesForCategories = filtersAttributesForCategories;
