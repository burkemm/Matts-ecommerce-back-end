const router = require('express').Router();
const { Category, Product } = require('../../models');

// This route creates a new category.
router.post('/', async (req, res) => {
  // create a new category
  try {
		const categoryData = await Category.create(req.body);
		res.status(200).json(categoryData);
	} catch (err) {
		res.status(500).json(err);
	}
});

// This route updates a category
router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  // This will update a category by its id.
  try {
		const categoryData = await Category.update(req.body, {
			where: {
				id: req.params.id,
			},
		});
    // This if statement looks for categoryData and returns a message if there is none.
		if (!categoryData[0]) {
			res.status(404).json({ message: 'Could not find category with this id!' });
			return;
		}
		res.status(200).json(categoryData);
	} catch (err) {
		res.status(500).json(err);
	}
});

// This route gets one category.
router.get('/:id', async (req, res) => {
  // This finds one category by its id and includes its associate Products.
  try {
		const categoryData = await Category.findByPk(req.params.id, {
			include: [{ model: Product }],
		});
		res.status(200).json(categoryData);
	} catch (err) {
		res.status(500).json(err);
	}
});

// This route gets all categories.
router.get('/', async (req, res) => {
  // This finds all categories and includes its associated Products.
  try {
		const categoryData = await Category.findAll({
			include: [{ model: Product }],
		});
		res.status(200).json(categoryData);
	} catch (err) {
		res.status(500).json(err);
	}
});

// This route deletes a category.
router.delete('/:id', async (req, res) => {
  // This deletes a category by its id.
  try {
		const categoryData = await Category.destroy({
			where: {
				id: req.params.id,
			},
		});
    // This if statement looks for category data. If there is none the user sees a message.
		if (!categoryData) {
			res.status(404).json({ message: 'Could not fine Category with this id!' });
			return;
		}
		res.status(200).json(categoryData);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
