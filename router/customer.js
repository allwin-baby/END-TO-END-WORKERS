const router = require('express').Router()
const { Login } = require('../models/registration')
const { District } = require('../models/district')
const { Order } = require('../models/order')
const { Category } = require('../models/category')
const stripe = require('stripe')('sk_test_51IUrDnLiquPRio9QmRVACCjxT5oeEUTMo1twQd6KNVI71IOLHpirU8NTgr5rdGFyLNZPlNmkJuiVC3i4QGzcvXt800nf9sKFCF');


router.get('/', async (req, res) => {
    role = await Login.findById(req.session.userid)
    if (role){
        console.log(role)
        if(role.roleId!=4){
            console.log("gotcha")
            return res.redirect('/login');``
        }
    }
    if (!req.session.userid) {
        return res.redirect('/login');
    }
    res.render('customer/cust_home');
})


router.get('/booking', async (req, res) => {
    if (!req.session.userid) {
        return res.redirect('/login');
    }
    dist = await District.find()
    category = await Category.find()
    res.render('customer/book', { dist: dist, category: category });

})
router.post('/booking', async (req, res) => {
    if (!req.session.userid) {
        return res.redirect('/login');
    }
    console.log("here comes")
    console.log(req.body)
    price = req.body.book_days.length * 1000
    const orderobj = new Order({
        userid: req.session.userid,
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        dist: req.body.dist,
        category: req.body.category,
        date: req.body.book_days,
        price: price,
        description: req.body.description,
        workers: "",
        status: "pending",
        selected_date: ""
    });
    await orderobj.save(); // saving data to databse

    try{
        const session =  await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: 'inr',
                product_data: {
                  name: req.body.category,
                },
                unit_amount: price,
              },
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: `http://localhost:3000/customer/booking/callback?status=success&id=` + orderobj._id,
          cancel_url: `http://localhost:3000/customer/booking/callback?status=failure&id=` + orderobj._id,
        })
        console.log("session")
        console.log(session)
        await Order.findByIdAndUpdate(orderobj._id,{session_id:session._id})
        res.json({ id: session.id });
      } catch(e){
        console.log(e)
        res.status(500).send(e)
      }

    //res.redirect('/customer/orders');
    //const logData = await Login.findById({ _id: req.session.userid });
    //res.status(400).json({ error: orderobj });
})

router.get('/booking/callback',async(req,res)=>{

    status = req.query.status
    id = req.query.id
    console.log("hererererewrwerwerwerwerwerwerwerwerwerwe")
    console.log( await Order.findById(id).userid)
    if(status=="success"){
        /* try {
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
                from:  await Order.findById(id).userid, // sender address
                to: email, // list of receivers
                subject: "Hello ✔", // Subject line
                text: "This is your OTP   " + otp, // plain text body
        
            });
        
            console.log("Message sent: %s", info.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        
            // Preview only available when sending through an Ethereal account
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
               
           } catch (error) {
               res.send('error')
           } */

        await Order.findByIdAndUpdate(id,{payment_status:"sucess"})
        res.redirect('/customer/orders')
    }
    else{
        await Order.findByIdAndDelete(id)
        res.send("fail")
    }
})

router.get('/orders', async (req, res) => {
    worker = []
    order = []
    if (!req.session.userid) {
        return res.redirect('/login');
    }

    order = await Order.find({ userid: req.session.userid,payment_status:"sucess" })
    worker = []
   try {
       for(i=0;i<order.length;i++){
        emp = await Login.findById(order[i].workers)
        worker.push(emp)
       }
   } catch (error) {
       console.log(error)
   }
   
    res.render('customer/orders', { orders: order ,worker : worker })
      
})

router.get('/edit', async (req, res) => {
    if (!req.session.userid) {
        return res.redirect('/login');
    }
    sp = await Login.findById(req.session.userid)
    district = await District.find()
    res.render('customer/edit_profile',{sp:sp ,dist:district})
})

router.post('/update', async (req, res) => {
    if (!req.session.userid) {
        return res.redirect('/login');
    }
    Login.findByIdAndUpdate(req.session.userid, { phone: req.body.phone,address:req.body.address, name :req.body.name,dist:req.body.dist}, {}, function (err, doc) {
        if (err) {
            res.status(500).send({ message: "Cannot update" })
        }
        res.redirect('/customer/')
    })
})
module.exports = router