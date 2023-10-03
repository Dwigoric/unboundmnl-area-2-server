import express from 'express';
const router = express.Router();

import Loanee from '../models/loanee.js';

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/**
 * Add a new user to the users listing.
 * 
 * Expected req.params:
 * 
 * username (unique)
 * name_given
 * name_middle (can be null)
 * name_last
 * birthday (Date)
 * birthplace 
 * gender (M or F)
 * civil_status (Single or Married)
 * tin_no
 * contact_no
 * monthly_income
 * address
 * occupation
 * spouse (boolean)
 *  if spouse is true:
 *    spouse_name_given
 *    spouse_name_middle (can be null)
 *    spouse_name_last
 *    spouse_birthday (Date)
 *    spouse_birthplace
 *    spouse_contact_no
 */
router.post('/add', async function(req, res, next) {
  try {
    const username = req.body.username;
    const existingLoanee = await Loanee.findOne({ username });
    if (existingLoanee) {
      return res.status(400).json({message: "Username already taken"});
    }

    let spouse = null;

    if (req.body.spouse) {
      spouse = {
        name: {
          given: req.body.spouse_name_given,
          middle: req.body.spouse_name_middle,
          last: req.body.spouse_name_last
        },
        birthday: req.body.spouse_birthday,
        birthplace: req.body.spouse_birthplace,
        contact_no: req.body.contact_no
      }
    } 

    const newLoanee = await Loanee.create({
      username: req.body.username,
      name: {
        given: req.body.name_given,
        middle: req.body.name_middle,
        last: req.body.name_last
      },
      birthday: req.body.birthday,
      birthplace: req.body.birthplace,
      gender: req.body.gender,
      civil_status: req.body.civil_status,
      tin_no: req.body.tin_no,
      contact_no: req.body.contact_no,
      monthly_income: req.body.monthly_income,
      address: req.body.address,
      occupation: req.body.occupation,
      spouse: spouse
    });
    return res.json(newLoanee);
  } catch (e) {
    return next(e)
  }
})

/* Edit the information of a user in the users listing. */
router.patch('/edit', function(req, res, next) {

})

export default router;
