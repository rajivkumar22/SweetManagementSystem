const express = require('express');
const router = express.Router();
const { authenticate, isAdmin } = require('../middleware/auth');
const {
  createSweet,
  getAllSweets,
  searchSweets,
  getSweetById,
  updateSweet,
  deleteSweet
} = require('../controllers/sweetController');
const {
  purchaseSweet,
  restockSweet
} = require('../controllers/inventoryController');

// @route   POST /api/sweets
// @desc    Create a new sweet
// @access  Admin
router.post('/', authenticate, isAdmin, createSweet);

// @route   GET /api/sweets
// @desc    Get all sweets
// @access  Protected
router.get('/', authenticate, getAllSweets);

// @route   GET /api/sweets/search
// @desc    Search sweets
// @access  Protected
router.get('/search', authenticate, searchSweets);

// @route   POST /api/sweets/:id/purchase
// @desc    Purchase a sweet
// @access  Protected
router.post('/:id/purchase', authenticate, purchaseSweet);

// @route   POST /api/sweets/:id/restock
// @desc    Restock a sweet
// @access  Admin
router.post('/:id/restock', authenticate, isAdmin, restockSweet);

// @route   GET /api/sweets/:id
// @desc    Get single sweet
// @access  Protected
router.get('/:id', authenticate, getSweetById);

// @route   PUT /api/sweets/:id
// @desc    Update sweet
// @access  Admin
router.put('/:id', authenticate, isAdmin, updateSweet);

// @route   DELETE /api/sweets/:id
// @desc    Delete sweet
// @access  Admin
router.delete('/:id', authenticate, isAdmin, deleteSweet);

module.exports = router;
