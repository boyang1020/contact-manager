const fs = require('fs');

module.exports = {
    addCustomerPage: (req, res) => {
        res.render('add-contact.ejs', {
            title: "Welcome to Contact Managment | Add a new Customer"
            ,message: ''
        });
    },
    addCustomer: (req, res) => {
        if (!req.files) {
            return res.status(400).send("No files were uploaded.");
        }

        let message = '';
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let number = req.body.number;
        let username = req.body.username;
        let uploadedFile = req.files.image;
        let address = req.body.address
        let image_name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        image_name = username + '.' + fileExtension;

        let usernameQuery = "SELECT * FROM `customers` WHERE user_name = '" + username + "'";

        db.query(usernameQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                message = 'Username already exists';
                res.render('add-contact.ejs', {
                    message,
                    title: "Welcome to Contact Managment | Add a new customer"
                });
            } else {
                // check the filetype before uploading it
                if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
                    // upload the file to the /public/assets/img directory
                    uploadedFile.mv(`public/assets/img/${image_name}`, (err ) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        let query = "INSERT INTO `customers` (first_name, last_name, number, image, user_name, address) VALUES ('" +
                            first_name + "', '" + last_name + "', '" + number + "', '" + image_name + "', '" + username + "', '" + address + "')";
                        db.query(query, (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            res.redirect('/');
                        });
                    });
                } else {
                    message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
                    res.render('add-customer.ejs', {
                        message,
                        title: "Welcome to Contact Managment | Add a new customer"
                    });
                }
            }
        });
    },
    editCustomerPage: (req, res) => {
        let customerId = req.params.id;
        let query = "SELECT * FROM `customers` WHERE id = '" + customerId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('edit-contact.ejs', {
                title: "Edit customer"
                ,customer: result[0]
                ,message: ''
            });
        });
    },
    editCustomer: (req, res) => {
        let customerId = req.params.id;
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let number = req.body.number;

        let query = "UPDATE `customers` SET `first_name` = '" + first_name + "', `last_name` = '" + last_name + "', `number` = '" + number + "' WHERE `customers`.`id` = '" + customerId + "'";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });
    },
    deleteCustomer: (req, res) => {
        let customerId = req.params.id;
        let getImageQuery = 'SELECT image from `customers` WHERE id = "' + customerId + '"';
        let deleteUserQuery = 'DELETE FROM `customers` WHERE id = "' + customerId + '"';

        db.query(getImageQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }

            let image = result[0].image;

            fs.unlink(`public/assets/img/${image}`, (err) => {
                if (err) {
                    return res.status(500).send(err);
                }
                db.query(deleteUserQuery, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.redirect('/');
                });
            });
        });
    }
};
