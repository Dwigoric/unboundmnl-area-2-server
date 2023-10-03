import express from 'express';
const router = express.Router();

import Loanee from '../models/loanee.js';

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/**
 * Add a new user to the users listing.
 */
router.post('/add', async function(req, res, next) {
  try {
    const username = req.body.username;
    const existingLoanee = await Loanee.findOne({ username: username });
    if (existingLoanee) {
      return res.status(400).json({message: "Username already taken"});
    }
    const newLoanee = await Loanee.create(req.body);
    return res.json(newLoanee);
  } catch (e) {
    return next(e)
  }
})

/**
 * Edit the information of a user in the users listing.
 */
router.patch('/edit', async function(req, res, next) {
  try {
    const username = req.body.username;
    const loanee = await Loanee.findOne({ username: req.body.username });
    if (!loanee) {
      return res.status(400).json({message: "Username does not exist"})
    }
    const updatedLoanee = await Loanee.updateOne({username: username}, req.body)
    return res.json(updatedLoanee);
  } catch(e) {
    return next(e);
  }
})

export default router;
