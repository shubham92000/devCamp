const express = require('express');
const { 
  getReviews ,
  getReview ,
  addReview , 
  UpdateReview ,
  deleteReview
} = require('../controllers/reviews');

const Review = require('../models/Review');

const router = express.Router({ mergeParams : true });

const advancedResults = require('../middleware/advancedResults');
const { protect , authorize } = require('../middleware/auth');

router
  .route('/')
  .get(advancedResults(Review , {
      path : 'bootcamp' ,
      description : 'name description'
    }) ,
    getReviews
  )
  .post(protect , authorize('user' , 'admin'), addReview)
  ;

router
  .route('/:id')
  .get(getReview)
  .put(protect , authorize('user' , 'admin') , UpdateReview)
  .delete(protect , authorize ('user' , 'admin') , deleteReview)
  ;

module.exports = router;