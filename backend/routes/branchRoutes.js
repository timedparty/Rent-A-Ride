const express = require('express')
const {createBranch, getBranches, updateBranch, deleteBranch} = require('../controllers/branchController.js')
const {protect, adminOnly} = require('../middleware/authMiddleware.js')

const router = express.Router()

router.post('/', protect, adminOnly, createBranch)
router.patch('/:id', protect, adminOnly, updateBranch)
router.get('/', getBranches)
router.delete('/:id', protect, adminOnly, deleteBranch)

module.exports = router