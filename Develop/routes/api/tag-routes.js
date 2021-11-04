const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  // Use the tag to find all that include product and attributes of id, product_name, price, stock, and category_id.
  Tag.findAll({
    include: [
      {
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
      }
    ]
  })
    .then(TagData => res.json(TagData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  // Find one tag that includes Product, id, product_name, price, stock, or category_id.
  Tag.findOne({
    where: { id: req.params.id },
    include: [
      {
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
      }
    ]
  })
    .then(TagData => {
      // if no TagData is found then the user sees a message.
      if (!TagData) {
        res.status(404).json({ message: 'No tag found with this id'});
        return;
      }
      // If there is TagData then proceed.
      res.json(TagData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
  // create a new tag with tag_name
  Tag.create({
    tag_name: req.body.tag_name
  })
    .then(dbTagData => res.json(dbTagData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
  });
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  // Update by id
  Tag.update(req.body, {
    where: {
        id: req.params.id
    }
  })

    .then(TagData => {
      // If there's no TagData then the user sees a message.
        if (!TagData[0]) {
            res.status(404).json({ message: 'No tag found with this id'});
            return;
        }
        // If there's TagData then proceed.
        res.json(TagData);
  })
    .catch(err => {
        console.log(err); 
        res.status(500).json(err);
  });
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
  Tag.destroy({
    where: {
        id: req.params.id
    }
  })
    .then(dbTagData => {
      // If there's no dbTagData then the user sees a message.
        if (!dbTagData) {
            res.status(404).json({ message: 'No tag found with this id'});
            return;
        }
        // If there's dbTagData then proceed.
        res.json(dbTagData);
  })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
  });
});

module.exports = router;
