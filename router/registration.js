const router = require('express').Router();
const bcryptjs = require('bcryptjs')
const { Login } = require('../models/registration');
const { District } = require('../models/district');
const { Category } = require('../models/category');
const nodemailer = require("nodemailer");


//LOGIN PAGE
router.get('/login', async (req, res) => {
    res.render('login');
});

//Customer registration page with otp
router.get('/register/customer', async (req, res) => {
    try {
        dist = await District.find()
        res.render('reg', { dist: dist });

    } catch (error) {
        res.status(500).send({ message: err.message || "Error Occurred while retriving Item information" })
    }

});
//Customer registration OTP SEND
router.post('/login/auth', async (req, res) => {
    email = req.body.email
    console.log(email);
   try {
    otp = Math.floor(Math.random() * Math.pow(10, 6))
    req.session.otp = otp;
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({  
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: email, // list of receivers
        subject: "Hello ✔", // Subject line
        text: "This is your OTP   " + otp, // plain text body

    });
    console.log("here");
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    res.send('login_auth');
       
   } catch (error) {
       res.send('error')
   }
    
});

//Customer registration OTP VARIFICATION AND SEND DATABASE
router.post('/register/customer', async (req, res) => {
    if (req.body.otp==req.session.otp) {
        console.log(req.body)
        console.log(req.session)
        
        const emailExists = await Login.findOne({ email: req.body.email, roleId: 4 });
        if (emailExists) {
            return res.status(400).json({ "error": "Customer account with the given email address already exists" });
        }

        const loginobj = new Login({

            password: req.body.password,
            roleId: 4,
            phone: req.body.phone,
            email: req.body.email,
            name: req.body.name,
            address: req.body.address,
            dist: req.body.dist,
            category: "",
            approved: "false",
            isavailable: "yes"
        });
        await loginobj.save(); // saving data to databse
        res.redirect('/login');
    }
    else {
        res.send('fail');
    }
});
//OLD CUTOMER REFISTARUION

/* router.get('/register/customer', async (req, res) => {
    try {
        dist = await District.find()
        category = await Category.find()
        res.render('registration/regw3cust',{ dist: dist ,category:category});
    }
    catch (err) {
        res.status(500).send({ message: err.message || "Error Occurred while retriving Item information" })
    }
    
}); */

//EMPLOYEE REGISTRATION
router.get('/register/employee', async (req, res) => {
    try {
        dist = await District.find()
        category = await Category.find()
        res.render('registration/emp_reg', { dist: dist, category: category });
    }
    catch (err) {
        res.status(500).send({ message: err.message || "Error Occurred while retriving Item information" })
    }
});

//SERICE PROVIDER REGISTRATION
router.get('/register/sp', async (req, res) => {
    try {
        dist = await District.find()
        category = await Category.find()
        res.render('registration/service_provider_reg', { dist: dist, category: category });
    }
    catch (err) {
        res.status(500).send({ message: err.message || "Error Occurred while retriving Item information" })
    }
});

//CUSTOMER REGISTRATIOON POST

/* router.post('/register/customer', async (req, res) => {

    const emailExists = await Login.findOne({ email: req.body.email, roleId: 4 });
    if (emailExists) {
        return res.status(400).json({ "error": "Customer account with the given email address already exists" });
    }

    const loginobj = new Login({
        username: req.body.username,
        password: req.body.password,
        roleId: 4,
        phone: req.body.phone,
        email: req.body.email,
        name: req.body.name,
        address: req.body.address,
        dist: req.body.dist,
        category: req.body.category,
        approved: "false",
        isavailable: "yes"
    });
    await loginobj.save(); // saving data to databse
    res.render('login');
}); */


router.post('/register/employee', async (req, res) => {
    const emailExists = await Login.findOne({ email: req.body.email, roleId: 3 });
    if (emailExists) {
        return res.status(400).json({ "error": "employee account with the given email address already exists" });
    }

    const loginobj = new Login({
        username: req.body.username,
        password: req.body.password,
        roleId: 3,
        phone: req.body.phone,
        email: req.body.email,
        name: req.body.name,
        address: req.body.address,
        dist: req.body.dist,
        category: req.body.category,
        approved: "false",
        isavailable: "yes"
    });
    await loginobj.save(); // saving data to databse
    res.render('login');
});
router.post('/register/sp', async (req, res) => {
    const emailExists = await Login.findOne({ email: req.body.email, roleId: 2 });
    if (emailExists) {
        return res.status(400).json({ "error": "service provider account with the given email address already exists" });
    }

    const loginobj = new Login({
        password: req.body.password,
        roleId: 2,
        phone: req.body.phone,
        email: req.body.email,
        name: req.body.name,
        address: req.body.address,
        dist: req.body.dist,
        category: req.body.category,
        approved: "false",
        isavailable: "yes"
    });
    await loginobj.save(); // saving data to databse
    res.render('login');
});


/////LOGIN PAGE 
router.post('/login', async (req, res) => {

    const emailExist = await Login.findOne({ email: req.body.email, roleId: req.body.roleid }); // finding whether the username exist or not.
    const redirectPath = {
        1: 'admin/admin',
        4: 'customer/cust_home',
        3: 'emp/emp',
        2: 'sp/sp_home'
    }
    if (emailExist) {
        if (emailExist.password == req.body.password) {
            if (!redirectPath[emailExist.roleId]) {
                return res.status(400).json({ "error": 'Interal Server Error' });
            }
            req.session.userid = emailExist._id;
            res.render(redirectPath[emailExist.roleId])

        } else {
            return res.status(400).json({ error: "Incorrect Password!" });
        }
    } else {
        return res.status(400).json({ error: "Incorrect Email or User type" });
    }

})

module.exports = router;