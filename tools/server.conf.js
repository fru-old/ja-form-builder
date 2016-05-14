module.exports = function init(app) {

  app.get('/hello', function (req, res) {
    res.json({
      a: 'Hello World',
      b: req.query.test
    });
  });

  return app;
};
