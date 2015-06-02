var Period = require('./models/period');
var Wish = require('./models/wish');

module.exports = function(app) {

    // server routes ===========================================================
    app.get('/api/periods', function(req, res) {
        Period.find(function(err, periods) {
            if (err) { res.send(err); }
            res.json(periods);
        });
    });

    app.get('/api/wishes/:id/activities', function (req, res) {
        Wish.find({ parent: req.params.id }).exec(function (err, activities) {
            if (err) { res.send(err); }
            res.json(activities);
        });
    });

    app.get('/api/purposes/:year?/:quarter?/:month?/:week?/:day?', function(req, res) {
        var year = req.params.year || null;
        var quarter = req.params.quarter || null;
        var month = req.params.month || null;
        var week = req.params.week || null;
        var day = req.params.day || null;
        var dateObj = { year: year };
        if (!quarter || quarter !== 'any') { dateObj.quarter = quarter; }
        if (!month || month !== 'any') { dateObj.month = month; }
        if (!week || week !== 'any') { dateObj.week = week; }
        if (!day || day !== 'any') { dateObj.day = day; }
        dateObj.status = { $ne: 'closed' };
        Wish.find(dateObj).exec(function(err, wishes) {
            if (err) { res.send(err); }
            res.json(wishes);
        });
    });

    app.post('/api/wishes', function (req, res) {
        var wish = new Wish(req.body);
        wish.save(function (err) {
            if (err) { res.send(err); }
            res.send(wish);
        });
    });

    app.put('/api/wishes/:id', function (req, res) {
        Wish.findById(req.params.id, function (err, wish) {
            wish.year = req.body.year;
            wish.quarter = req.body.quarter;
            wish.month = req.body.month;
            wish.week = req.body.week;
            wish.day = req.body.day;
            if (req.body.category) { wish.category = req.body.category; }
            if (req.body.status) { wish.status  = req.body.status; }
            if (req.body.description) { wish.description  = req.body.description; }
            if (req.body.label) { wish.label  = req.body.label; }
            wish.save(function (err) {
                if (err) { res.send(err); }
                res.send(wish);
            });
        });
    });

    app.delete('/api/wishes/:id', function (req, res) {
        Wish.remove({ _id: req.params.id }, function (err) {
            if (err) { res.send(false); }
            res.send(true);
        });
    });

    // frontend routes =========================================================
    // route to handle all angular requests
    app.get('*', function(req, res) {
        res.sendfile('./public/index.html');
    });
};
