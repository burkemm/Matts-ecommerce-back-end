const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// This route creates a new product.
router.post('/', async (req, res) => {
  Product.create(req.body)
    .then((product) => {
      // If there's products tags, then create in bulk on the ProductTag Model and return the product id and tag id.
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        // This returns a bulk create of ProductTag.
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if there's no product tags, then respond with product.
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});
// This route updates the product.
router.put('/:id', async (req, res) => {
  // This updates the product data and specifies what location to find. It filters by id.
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // This finds all associalted tags from the ProductTag using the product id as the filter.
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // this retrieves a current list of new tag_ids.
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // this makes a filtered list based on tag_ids.
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            // This returns product_id and tag_id.
            product_id: req.params.id,
            tag_id,
          };
        });
      // This filters by tag_id to remove ProductTags.
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // This is promise to destroy or create ProductTags.
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
// This route gets one product.
router.get('/:id', async (req, res) => {
  // This finds a product by a single ID and includes the Category and Tag.
  try {
		const productData = await Product.findByPk(req.params.id, {
			include: [{ model: Category }, { model: Tag }],
		});
		res.status(200).json(productData);
	} catch (err) {
		res.status(500).json(err);
	}
});

// This route gets all products.
router.get('/', async (req, res) => {
  // This finds all products and includes the Category and Tag.
  try {
		const productData = await Product.findAll({
			include: [{ model: Category }, { model: Tag }],
		});
		res.status(200).json(productData);
	} catch (err) {
		res.status(500).json(err);
	}
});

// This route deletes any products as desired.
router.delete('/:id', async (req, res) => {
  // This deletes a product using the id filter.
  try {
    const productData = await Product.destroy({
      where: {
        id: req.params.id
      }
    });
    // This if statement looks for productData. If there is none the user sees a message.
    if (!productData) {
      res.status(404).json({ message: 'Could not find product with this ID!' });
      return;
    }

    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
