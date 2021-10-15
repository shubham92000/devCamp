const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');

// @desc      Get all courses
// @route     GET /api/v1/courses
// @route     GET /api/v1/bootcamps/:bootcampId/courses
// @access    Public
exports.getCourses = asyncHandler (async (req,res,next) => {

  if(req.params.bootcampId){
    const courses = await Course.find({ bootcamp : req.params.bootcampId });

    return res.status(200).json({
      success : true ,
      count : courses.length ,
      data : courses
    })
  }else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc      Get single course
// @route     GET /api/v1/courses/:id
// @access    Public
exports.getCourse = asyncHandler (async (req,res,next) => {
  const course = await Course.findById(req.params.id).populate({
    path : 'bootcamp' ,           // -> populate which field of courses
    select : 'name description'   // -> populate what fields of Bootcamp
  });

  if(!course){
    return next(new ErrorResponse(`No course with id of ${req.params.id}`), 400);
  }

  res.status(200).json({
    success : true ,
    data : course
  });

});

// @desc      Add a course
// @route     POST /api/v1/bootcamps/:bootcamp/courses
// @access    Private
exports.addCourse = asyncHandler (async (req,res,next) => {

  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if(!bootcamp){
    return next(new ErrorResponse(`No Bootcamp with id of ${req.params.bootcampId}`), 400);
  }

  // make sure user is the owner of bootcamp
  if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to add a course to the bootcamp with id ${bootcamp._id}` , 401));
  }

  const course = await Course.create(req.body);

  res.status(200).json({
    success : true ,
    data : course
  });

});

// @desc      Update a course
// @route     PUT /api/v1/courses/:id (params)
// @access    Private
exports.updateCourse = asyncHandler (async (req,res,next) => {

  let course = await Course.findById(req.params.id);  // this id is course id

  if(!course){
    return next(new ErrorResponse(`No course with id of ${req.params.id}`), 400);
  }

  // make sure user is the owner of course
  if(course.user.toString() !== req.user.id && req.user.role !== 'admin'){
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update the course ${course._id}` , 401));
  }

  course = await Course.findByIdAndUpdate(req.params.id , req.body , {
    new : true ,
    runValidators : true
  });

  res.status(200).json({
    success : true ,
    data : course
  });

});

// @desc      Delete a course
// @route     DELETE /api/v1/courses/:id
// @access    Private
exports.deleteCourse = asyncHandler (async (req,res,next) => {

  const course = await Course.findById(req.params.id);

  if(!course){
    return next(new ErrorResponse(`No course with id of ${req.params.id}`), 400);
  }

  // make sure user is the owner of course
  if(course.user.toString() !== req.user.id && req.user.role !== 'admin'){
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete the course ${course._id}` , 401));
  }

  await course.remove();

  res.status(200).json({
    success : true ,
    data : {}
  });

});