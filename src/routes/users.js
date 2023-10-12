import express from 'express';
const router = express.Router();

import Loanee from '../models/loanee.js';

/* GET users listing. */
router.get('/', async function(req, res, next) {
  try {
    const loanees = await Loanee.find().lean();
    return res.json(loanees);
  } catch (e) {
    return next(e);
  }
});

/**
 * Search the users listing by username
 */
router.get("/search", async function(req, res, next) {
    try {
      const loanees = await Loanee.find({
        username: {
          $regex: req.query.search
        }
      }).lean();
      return res.json(loanees);
    } catch (e) {
      return next(e);
    }
})

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
    if (e.name === 'ValidationError') {
      // console.error(e.stack);
      return res.status(400).json({message: "Invalid data format"});
    }
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
    if (e.name === 'ValidationError') {
      // console.error(e.stack);
      return res.status(400).json({message: "Invalid data format"});
    }
    return next(e);
  }
})


export default router;
