const Sweet = require('../models/Sweet');

/**
 * Purchase a sweet
 * POST /api/sweets/:id/purchase
 * @access Protected
 */
const purchaseSweet = async (req, res) => {
  try {
    const { quantity = 1 } = req.body;

    // Validate quantity
    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid quantity'
      });
    }

    // Find the sweet
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: 'Sweet not found'
      });
    }

    // Check if sweet is in stock
    if (sweet.quantity === 0) {
      return res.status(400).json({
        success: false,
        message: 'This sweet is out of stock'
      });
    }

    // Check if sufficient stock available
    if (sweet.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `insufficient stock. Only ${sweet.quantity} items available`
      });
    }

    // Decrease quantity
    sweet.quantity -= quantity;
    await sweet.save();

    res.status(200).json({
      success: true,
      message: `${quantity} ${sweet.name}(s) purchased successfully`,
      data: sweet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while purchasing sweet'
    });
  }
};

/**
 * Restock a sweet
 * POST /api/sweets/:id/restock
 * @access Admin
 */
const restockSweet = async (req, res) => {
  try {
    const { quantity } = req.body;

    // Validate quantity
    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid quantity to restock'
      });
    }

    // Find the sweet
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({
        success: false,
        message: 'Sweet not found'
      });
    }

    // Increase quantity
    sweet.quantity += quantity;
    await sweet.save();

    res.status(200).json({
      success: true,
      message: `${sweet.name} restocked successfully with ${quantity} items`,
      data: sweet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while restocking sweet'
    });
  }
};

module.exports = {
  purchaseSweet,
  restockSweet
};
