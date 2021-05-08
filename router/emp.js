const router = require('express').Router();
const { Login } = require('../models/registration');
const { Order } = require('../models/order');
const { District } = require('../models/district');




router.get('/',  async(req, res) => {
    role = await Login.findById(req.session.userid)
    if (role){
        console.log(role)
        if(role.roleId!=3){
            console.log("gotcha")
            return res.redirect('/login');``
        }
    }
    if (!req.session.userid ) {
        return res.redirect('/login');
    }
    res.render('emp/emp'); // rendering index.ejs file
})
router.get('/works', async (req, res) => {
    if (!req.session.userid &&  await Login.findById(req.session.userid).roleId !=3) {
        return res.redirect('/login');
    }
    try {
        works = await Order.find({ workers:req.session.userid})
        res.render('emp/pending', { work:works })
    }
    catch (err) {
        res.status(500).send({ message: err.message || "Error Occurred while retriving Item information" })
    }
})

router.get('/confirm', async (req, res) => {
    const order_id = req.query.id;

    Order.findByIdAndUpdate(order_id, {status:"confirmed"}, {}, function (err, doc) {
        if (err) {
            res.status(500).send({ message: "Cannot update" })
        }
        res.redirect('/emp/')
    })
})
router.get('/reject', async (req, res) => {
    const order_id = req.query.id;

    Order.findByIdAndUpdate(order_id, { workers: "",status:"empreject", selected_date:""}, {}, function (err, doc) {
        if (err) {
            res.status(500).send({ message: "Cannot update" })
        }
        res.redirect('/emp/works')
    })
})



router.get('/edit', async (req, res) => {
    if (!req.session.userid) {
        return res.redirect('/login');
    }
    sp = await Login.findById(req.session.userid)
    district = await District.find()
    res.render('emp/edit_profile',{sp:sp ,dist:district})
})

router.post('/update', async (req, res) => {
    if (!req.session.userid) {
        return res.redirect('/login');
    }
    Login.findByIdAndUpdate(req.session.userid, { phone: req.body.phone,address:req.body.address, name :req.body.name,dist:req.body.dist}, {}, function (err, doc) {
        if (err) {
            res.status(500).send({ message: "Cannot update" })
        }
        res.redirect('/emp/')
    })
})

module.exports = router;