
const router = require('express').Router();
const { Login } = require('../models/registration');
const { Order } = require('../models/order');
const { District } = require('../models/district');

//---------------------------DASHBOARD---------------------------------

router.get('/', async (req, res) => {
    role = await Login.findById(req.session.userid)
    if (role){
        console.log(role)
        if(role.roleId!=2   ){
            console.log("gotcha")
            return res.redirect('/login');``
        }
    }
    if (!req.session.userid) {
        return res.redirect('/login');
    }
    const logData = await Login.findById({ _id: req.session.userid, });
    res.render('sp/sp_home');
})

router.get('/edit', async (req, res) => {
    if (!req.session.userid) {
        return res.redirect('/login');
    }
    sp = await Login.findById(req.session.userid)
    district = await District.find()
    res.render('sp/edit_profile',{sp:sp ,dist:district})
})
router.post('/update', async (req, res) => {
    if (!req.session.userid) {
        return res.redirect('/login');
    }
    Login.findByIdAndUpdate(req.session.userid, { phone: req.body.phone,address:req.body.address, name :req.body.name,dist:req.body.dist}, {}, function (err, doc) {
        if (err) {
            res.status(500).send({ message: "Cannot update" })
        }
        res.redirect('/sp/')
    })
})


router.get('/emp', async (req, res) => {
         if(!req.session.userid) {
         return res.redirect('/login');
        }   
    const logData = await Login.findById({_id: req.session.userid}); 
    Login.find({category:logData.category,roleId:3})
        .then(Item => {
       
            res.render('sp/sp_employe', { emp: Item })
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Error Occurred while retriving Item information" })
        })
})

router.get('/booking', async (req, res) => {
         if (!req.session.userid) {
            return res.redirect('/login');
        } 
        ///NEWWWWWWWW
        cat = await Login.findById(req.session.userid)
        cate = cat.category
    Order.find({payment_status:"sucess",category:cate})
        .then(Item => {
         
            res.render('sp/orders', { order: Item })
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Error Occurred while retriving Item information" })
        })

})
router.get('/assign', async (req, res) => {
    const order_id = req.query.id;
    console.log(order_id)
    try {
        order_  = await Order.findById(order_id)
        emp = await Login.find({ roleId: 3, category: order_.category, dist: order_.dist,approved:"true",isavailable:"yes"})

        res.render('sp/single_order', { order: order_, emp: emp })
    }
    catch (err) {
        res.status(500).send({ message: err.message || "Error Occurred while retriving Item information" })
    }
})

router.post('/confirm', async (req, res) => {
   
    Order.findByIdAndUpdate(req.body.order_id, { workers: req.body.worker,status:"assigned", selected_date:req.body.date}, {}, function (err, doc) {
        if (err) {
            res.status(500).send({ message: "Cannot update" })
        }
        res.redirect('/sp/booking')
    })
})
router.get('/reject', async (req, res) => {
    const order_id = req.query.id;
    console.log(order_id)
    Order.findByIdAndUpdate(order_id, { workers: "",status:"sprejected", selected_date:""}, {}, function (err, doc) {
        if (err) {
            res.status(500).send({ message: "Cannot update" })
        }
        res.redirect('/sp/booking')
    })
})
module.exports = router;