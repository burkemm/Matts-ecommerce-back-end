// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// The product belongs to a category.
Product.belongsTo(Category, {
  foreignKey: 'category_id',
});

// Categories contain multiple products.
Category.hasMany(Product, {
  foreignKey: 'category_id',
});

// Product belongs to many tags and have a tag through ProductTag.
Product.belongsToMany(Tag, {
  through: ProductTag,
  foreignKey: 'product_id'
});

// Tag belongs to many Products through the ProductTag.
Tag.belongsToMany(Product, {
  through: ProductTag,
  foreignKey: 'tag_id'
});



module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};