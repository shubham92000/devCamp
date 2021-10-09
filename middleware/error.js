const error = (err,req,res,next) => {
  // log to console for dev
  console.log(err.stack.red);

  res.status(500);
}