const Sweet = require('../models/Sweet');

/**
 * Create a new sweet
 * POST /api/sweets
 * @access Admin
 */
const createSweet = async (req, res) => {
  try {
    const { name, category, price, quantity, description } = req.body;

    const sweet = await Sweet.create({
      name,
      category,
      price,
      quantity,
      description
    });

    res.status(201).json({
      success: true,
      data: sweet
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating sweet'
    });
  }
};

/**
 * Get all sweets
 * GET /api/sweets
 * @access Protected
 */
const getAllSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: sweets.length,
      data: sweets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching sweets'
    });
  }
};

/**
 * Search sweets by name, category, or price range
 * GET /api/sweets/search
 * @access Protected
 */
const searchSweets = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;

    let query = {};

    // Search by name (case-insensitive)
    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    // Search by category
    if (category) {
      query.category = category;
    }

    // Search by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const sweets = await Sweet.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: sweets.length,
      data: sweets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while searching sweets'
    });
  }
};

/**
 * Get single sweet by ID
 * GET /api/sweets/:id
 * @access Protected
 */
const getSweetById = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: 'Sweet not found'
      });
    }

    res.status(200).json({
      success: true,
      data: sweet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching sweet'
    });
  }
};

/**
 * Update sweet
 * PUT /api/sweets/:id
 * @access Admin
 */
const updateSweet = async (req, res) => {
  try {
    const { name, category, price, quantity, description } = req.body;

    let sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: 'Sweet not found'
      });
    }

    // Update fields
    if (name !== undefined) sweet.name = name;
    if (category !== undefined) sweet.category = category;
    if (price !== undefined) sweet.price = price;
    if (quantity !== undefined) sweet.quantity = quantity;
    if (description !== undefined) sweet.description = description;

    await sweet.save();

    res.status(200).json({
      success: true,
      data: sweet
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating sweet'
    });
  }
};

/**
 * Delete sweet
 * DELETE /api/sweets/:id
 * @access Admin
 */
const deleteSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: 'Sweet not found'
      });
    }

    await sweet.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Sweet deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while deleting sweet'
    });
  }
};

module.exports = {
  createSweet,
  getAllSweets,
  searchSweets,
  getSweetById,
  updateSweet,
  deleteSweet
};
