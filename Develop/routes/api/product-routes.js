const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  // Find a product and include the model, category, and tag.
  Product.findAll({
    include: [
      {
        model: Category, attributes: ['id', 'category_name']
      },
      {
        model: Tag, attributes: ['id', 'tag_name']
      }
    ]
  })
  // take the productData and plug it into JSON.
    .then(ProductData => res.json(ProductData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// get one product
router.get('/:id', (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  // find one product that includes category and tag.
  Product.findOne({
    where: {id: req.params.id},
    include: [
      {
        model: Category, attributes: ['id', 'category_name']
      },
      {
        model: Tag, attributes: ['id', 'tag_name']
      }
    ]
  })
    .then(ProductData => {
      // If there's no productData then the user sees a message.
      if (!ProductData) {
        res.status(404).json({ message: 'No product found with this id'}); 
        return; 
      }
      // If there is productData then proceed.
      res.json(ProductData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// create new product
router.post('/', (req, res) => {
  // create a product with product_name, price, stock, category_id, and tagIds.
  Product.create({
    product_name: req.body.product_name,
    price: req.body.price,
    stock: req.body.stock,
    category_id: req.body.category_id,
    tagIds: req.body.tag_id
  })

 .then((product) => {
      // If there's product tags, then return the product_id and tag_id and create pairings to bulk create in the ProductTag model.
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // Just respond if there's no productTags.
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data by id.
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag by using the product_id.
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', (req, res) => {
  // delete one product by its `id` value
  // Destroy the id.
  Product.destroy({
    where: {
        id: req.params.id
    }
  })
  // If there's no productData then the user sees a message.
    .then(ProductData => {
        if (!ProductData) {
            res.status(404).json({ message: 'No product found with this id'});
            return;
        }
        // If there is ProductData then proceed.
        res.json(ProductData);
  })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
  });
});

module.exports = router;
