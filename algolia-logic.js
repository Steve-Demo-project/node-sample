const {
    algolia,minio
} = require('../env')
const algoliasearch = require('algoliasearch');
const client = algoliasearch(algolia.APPLICATIONID, algolia.ADMINAPIKEY);

exports.importProducts = (data, stores, callBack) => {
    try {
        const products = JSON.parse(data);
        if (products && products.length > 0) {
            const importProduct = []
            products.forEach(x => {
                let obj = {
                    inventoryInStock: 0,
                    price: {
                        min: 0,
                        max: 0
                    }
                };
                if (x._id) {
                    obj.objectID = x._id
                    obj._id = x._id
                }
                if(x.slug){
                    obj.slug = x.slug;
                }
                if (x.description) {
                    obj.description = x.description
                }
                if (x.productPictures && x.productPictures.length > 0) {
                    //obj.productPictures = `${minio.MINIO_URL}:${minio.MINIO_PORT}/${x.productPictures[0]}`
                    obj.productPictures = x.productPictures[0]
                }
                let tagIDs = []
                if (x.categories) {
                    let categories = x.categories;
                    let ischild = true
                    while (ischild) {
                        let categoryObj = {
                            _id: categories._id,
                            name: categories.name
                        }
                        let index = tagIDs.findIndex(t => t._id == categories._id)
                        if (!(index > -1)) {
                            tagIDs.push(categoryObj)
                        }
                        if (!categories.child) {
                            ischild = false
                        } else {
                            categories = categories.child
                        }
                    }
                }

                if (x.brand) {
                    //obj.name = x.brand.name
                    let index = tagIDs.findIndex(t => t._id == x.brand._id);
                    if (!(index > -1)) {
                        tagIDs.push({
                            _id: x.brand._id,
                            name: x.brand.name
                        })
                    }
                }

                if (x.hashtags && x.hashtags.length > 0) {
                    x.hashtags.forEach(x => {
                        let index = tagIDs.findIndex(t => t._id == x.id);
                        if (!(index > -1)) {
                            tagIDs.push({
                                _id: x.id,
                                name: x.text
                            })
                        }
                    })
                }

                if (x.variants && x.variants.length > 0) {
                    let attributes = {
                        size: [],
                        color: []
                    }
                    x.variants.forEach(v => {
                        if (v.color) {
                            const index = attributes.color.findIndex(c => c.toLocaleLowerCase() === v.color.toLocaleLowerCase());
                            if (!(index > -1)) {
                                attributes.color.push(v.color)
                            }
                        }
                        if (v.size) {
                            const index = attributes.size.findIndex(s => s.toLocaleLowerCase() === v.size.toLocaleLowerCase());
                            if (!(index > -1)) {
                                attributes.size.push(v.size)
                            }
                        }
                        if (v.price) {
                            if (obj.price.max < 1 && obj.price.min < 1) {
                                obj.price.max = v.price;
                                obj.price.min = v.price;
                            }
                            if (v.price > obj.price.max) {
                                obj.price.max = v.price
                            }
                            if (v.price < obj.price.min) {
                                obj.price.min = v.price
                            }
                        }
                        if (v.options && v.options.length > 0) {
                            v.options.forEach(o => {
                                if (o.color) {
                                    const index = attributes.color.findIndex(c => c.toLocaleLowerCase() === o.color.toLocaleLowerCase());
                                    if (!(index > -1)) {
                                        attributes.color.push(o.color)
                                    }
                                }
                                if (o.size) {
                                    const index = attributes.size.findIndex(s => s.toLocaleLowerCase() === o.size.toLocaleLowerCase());
                                    if (!(index > -1)) {
                                        attributes.size.push(o.size)
                                    }
                                }
                                if (o.price) {
                                    if (obj.price.max < 1 && obj.price.min < 1) {
                                        obj.price.max = o.price;
                                        obj.price.min = o.price;
                                    }
                                    if (o.price > obj.price.max) {
                                        obj.price.max = o.price
                                    }
                                    if (v.price < obj.price.min) {
                                        obj.price.min = o.price
                                    }
                                }
                            })
                        }
                    })
                    if (obj.price.min == obj.price.max) {
                        obj.price.range = obj.price.max.toString();
                    } else {
                        obj.price.range = `${obj.price.max} - ${obj.price.min}`
                    }
                    obj.attributes = attributes;
                    obj.tagIDs = tagIDs
                }
                importProduct.push(obj);
            })
            if (importProduct && importProduct.length) {
                stores.forEach(async x=>{
                    const index = await client.initIndex(`${x.name}_ALL`);
                    await index
                    .addObjects(importProduct)
                        .then(({
                            objectIDs
                        }) => {
                            callBack(null);
                        })
                        .catch(err => {
                            callBack(error);
                            throw new Error(err);
                        });
                })
            }
        }
    } catch (error) {
        callBack(error);
        throw new Error(error);
    }
};