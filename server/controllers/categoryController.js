const Category = require('../models/Category');
const Quiz = require('../models/Quiz');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const filter = req.user && req.user.role === 'admin' ? {} : { status: 'active' };
    const categories = await Category.find(filter).sort({ name: 1 }).lean();

    // Attach quiz count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Quiz.countDocuments({
          category: cat._id,
          published: true,
        });
        return {
          ...cat,
          quizCount: count,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: categoriesWithCount.length,
      data: categoriesWithCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Admin
exports.createCategory = async (req, res, next) => {
  try {
    const { name, description, icon, status } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const category = await Category.create({
      name: name.trim(),
      description: description ? description.trim() : '',
      icon: icon || 'BookOpen',
      status: status || 'active',
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Admin
exports.updateCategory = async (req, res, next) => {
  try {
    const { name, description, icon, status } = req.body;

    let category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    if (name) category.name = name.trim();
    if (description !== undefined) category.description = description.trim();
    if (icon) category.icon = icon;
    if (status) category.status = status;

    await category.save();

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Admin
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Check if quizzes belong to this category
    const quizCount = await Quiz.countDocuments({ category: category._id });
    if (quizCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category because ${quizCount} quiz(zes) are associated with it. Please reassign or delete the quizzes first.`,
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
