module.exports = {
    getHomePage: (req, res) => {
        let query = "SELECT * FROM `customers` ORDER BY id ASC"; 

        // execute query
        db.query(query, (err, result) => {
            if (err) {
                res.redirect('/');
            }
            res.render('index.ejs', {
                title: "Welcome to Contact Management | View Contacts"
                ,customers: result
            });
        });
    },
};