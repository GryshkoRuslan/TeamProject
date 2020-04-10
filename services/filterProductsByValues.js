//массив с вложенными массивами преобразует в массив с id продуктов
const concatProductsId = (productsId) => {
    return productsId.reduce((res,arr)=> {
        return res.concat(arr);
    }, []);
};

const filterProductsByValues = (data, filters) => {
    let ids = filters.map(filter=> {
        let attributesId = +filter[0];
        let someData = data.filter(data=>data.id_product_attributes===attributesId);

        let filterValues = filter[1].split(",");
        let forFilterTypeDefinitions = filterValues[0].split("-");

        if (forFilterTypeDefinitions.length===1) {
            let productsId = filterValues.map(value=> {
                let filteredData =  someData.filter(data=>+data.value.split(" ")[0]===+value);
                return filteredData.map(data=>data.id_products);
            });

            return concatProductsId(productsId);

        } else {
            let productsId = filterValues.map(value=> {
                let values = value.split("-");
                let filteredData =  someData.filter(data=> {
                    if (!+values[0]) {
                        return +data.value.split(" ")[0]<+values[1]
                    } else if (!+values[1]) {
                        return +data.value.split(" ")[0]>+values[0]
                    } else {
                        return +data.value.split(" ")[0]<+values[1] && +data.value.split(" ")[0]>+values[0]
                    }
                });
                return filteredData.map(data=>data.id_products);
            });

            return concatProductsId(productsId);
        }
    });

    let result = ids.reduce((res,arr)=> {
        if (!res.length) {
            return arr;
        }
        return res.filter(function(obj) { return arr.indexOf(obj) >= 0; });
    },[]);
    return result
};

module.exports.filterProductsByValues = filterProductsByValues;
