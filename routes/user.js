

exports.getLogin = function(req, res){
  res.render('login', { title: 'Please Log In' });
};

exports.postLogin = function (req, res) {
  var post = req.body;
  if (post.email == 'rmechler@gmail.com' && post.password == 'temp12') {
    req.session.userId = 1;  // TODO we really want to look up a user id here
    res.redirect('/pages/home'); // TODO can we preserve the page user was originally trying to see?
  } else {
    res.send('Bad user/pass');
  }
};

exports.logout = function (req, res) {
  delete req.session.userId;
  res.redirect('/login');
};