const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', (req, res) => {
  // find all categories
  // be sure to include its associated Products
  // Find all that include the model, product, and the attributes of id, product_name, price, stock, category_id.
  Category.findAll({
    include: [{ model: Product, attributes: ['id', 'product_name', 'price', 'stock', 'category_id']}]
  })
    .then(dbCategoryData => res.json(dbCategoryData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  Category.findOne({
    // Find one id that includes the model, product, and category_id.
    where: {id: req.params.id},
    include: {model: Product, attributes: ['id', 'product_name', 'price', 'stock', 'category_id']}
  })
    .then(categoryData => res.json(categoryData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
  // create a new category
  // This creates a new category_name
  Category.create({category_name: req.body.category_name})
    .then(categoryData => res.json(categoryData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
  // This updates the category name at the id. 
  Category.update({category_name: req.body.category_name},
    {
      where: {id: req.params.id}
    })
    // If there's no categoryData then the user gets a message.
    .then(categoryData => {
      if (!categoryData) {
        res.status(404).json({ message: 'No Category found with that ID.' });
        return;
      }
      // If there is categoryData then proceed.
      res.json(categoryData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
  // The id is destroyed.
  Category.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(categoryData => {
      // if the categoryData isn't found the user sees a message.
      if (!categoryData) {
        res.status(404).json({ message: 'No Category found with that ID.' });
        return;
      }
      // If the categoryData does exists then proceed.
      res.json(categoryData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;