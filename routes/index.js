
exports.index = function(req, res){
  res.render('index', { title: 'Roland Mechler' });
};

exports.home = function(req, res){
  res.render('home', { title: 'Home Page' });
};

