
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Roland Mechler' });
};

exports.home = function(req, res){
  res.render('home', { title: 'Home Page' });
};

exports.page = function(req, res){
  console.log(req.params);
  res.render('page', { title: 'Test Page', links: [{label: 'Yahoo!', url: 'http://www.yahoo.com'}, {label: 'Facebook', url: 'http://www.facebook.com'}] });
};
