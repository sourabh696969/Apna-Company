const express = require('express');
const { createTermCondition, deleteTermCondition, updateTermCondition, getTermConditionById, getTermCondition } = require('../controllers/term&conditionController');

const router = express.Router();

router.post('/create', createTermCondition);
router.get('/all', getTermCondition);
router.get('/:id', getTermConditionById);
router.put('/:id', updateTermCondition);
router.delete('/:id', deleteTermCondition);