// Importing necessary packages
const router = require('express').Router(); // router handles each redirections.
/* const multer = require('multer'); // multer is used to handle image or file uploads. */
/* const fs = require('fs'); // fs is used to acces file system. */
// Importing necessary models.
const { Login } = require('../models/registration');
const { District } = require('../models/district');
const { Category } = require('../models/category');
/* const { Product } = require('../models/addproduct');
const { Contact } = require('../models/contact'); */
/* const { type } = require('os'); */
// Configuring multer or middleware of multer.
// Creating multer storage
/* const multerStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/uploads');
    },
    filename: (req, file, callback) => {
        const ext = file.mimetype.split('/')[1];
        const filename = file.originalname.split('.')[0];
        callback(null, `product-${filename}-${Date.now()}.${ext}`)
    }
});
// Creating upload handler.
const upload = multer({
    storage: multerStorage,
    dest: 'public/uploads'
});
// creating multer middleware.
const uploadPhoto = upload.single('image');
 */



//---------------------------DASHBOARD---------------------------------

// GET endpoint. showing admin/dashboard.ejs file.

router.get('/createadmin', async (req, res) => {
    const adminAccount = await Login.findOne({ email: "admin" })
    if (adminAccount) {
        res.status(500).send({ message: "admin create error" })

    }
    const loginobj = new Login({
        password: "admin",
        roleId: 1,
        phone: 123,
        email: "admin",
        name: "admin",
        address: "admin",
        dist: "admin",
        category: "admin",
        approved: "false",
        isavailable: "yes"
    });
    await loginobj.save(); // saving data to databse
    res.status(200).send({ message: "success" })
})

router.get('/', async (req, res) => {
    role = await Login.findById(req.session.userid)
    if (role){
        console.log(role)
        if(role.roleId!=1){
            console.log("gotcha")
            return res.redirect('/login');``
        }
    }
    if (!req.session.userid ) {
        return res.redirect('/login');
    }
    console.log(req.session)
    const logData = await Login.findById({ _id: req.session.userid });
    res.render('admin/admin');
})

router.get('/sp', async (req, res) => {
    if (!req.session.userid) {
        return res.redirect('/login');
    }
    Login.find({ roleId: 2 })
        .then(Item => {
            res.render('admin/splist', { sp: Item })
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Error Occurred while retriving Item information" })
        })

})





///DISTRICT
router.get('/dist', async (req, res) => {
    if (!req.session.userid) {
        return res.redirect('/login');
    }
    District.find()
        .then(Item => {
          
            res.render('admin/district', { dist: Item })
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Error Occurred while retriving Item information" })
        })
})
router.post('/dist', async (req, res) => {
    if (!req.session.userid) {
        return res.redirect('/login');
    }
    const distExists = await District.findOne({ district: req.body.district });
    if (distExists) {
    }
    else {
        const distobj = new District({
            district: req.body.district,

        });
        await distobj.save(); // saving data to databse
        res.redirect('/admin/dist')
    }
})

router.get('/dist/delete',(req, res)=>{
    const id = req.query.id;
    console.log("delete")
    District.findByIdAndDelete(id)
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Delete with id ${id}. Maybe id is wrong`})
            }else{
                res.redirect('/admin/dist')
            }
        })
        .catch(err =>{
            res.status(500).send({
                message: "Could not delete Item with id=" + id
            });
        });
})


//CATEGORY
router.get('/category', async (req, res) => {
    if (!req.session.userid) {
        return res.redirect('/login');
    }
    Category.find()
        .then(Item => {
            res.render('admin/category', { category: Item })
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Error Occurred while retriving Item information" })
        })
})
router.post('/category', async (req, res) => {
    if (!req.session.userid) {
        return res.redirect('/login');
    }
    const distExists = await Category.findOne({ category: req.body.category });
    if (distExists) {
    }
    else {
        console.log(req.body)
        const categoryobj = new Category({
            category: req.body.category,

        });
        await categoryobj.save(); // saving data to databse
        res.redirect('/admin/category')
    }
})

router.get('/category/delete',(req, res)=>{
    const id = req.query.id;
    Category.findByIdAndDelete(id)
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Delete with id ${id}. Maybe id is wrong`})
            }else{
                res.redirect('/admin/category')
            }
        })
        .catch(err =>{
            res.status(500).send({
                message: "Could not delete Item with id=" + id
            });
        });
})






router.get('/sp', async (req, res) => {
    if (!req.session.userid) {
        return res.redirect('/login');
    }
    Login.find({ roleId: 2 })
        .then(Item => {
            console.log(Item)
            res.render('admin/splist', { sp: Item })
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Error Occurred while retriving Item information" })
        })
})
//removed async!!!
router.get('/emp',  (req, res) => {
    if (!req.session.userid) {
        return res.redirect('/login');
    }
    Login.find({ roleId: 3 })
        .then(Item => {
            console.log(Item)
            res.render('admin/emplist', { emp: Item })
        })
        .catch(err => { 
            res.status(500).send({ message: err.message || "Error Occurred while retriving Item information" })
        })
})
//removed async!!!
router.get('/customer', (req, res) => {
    if (!req.session.userid) {
        return res.redirect('/login');
    }
    Login.find({ roleId: 4 })
        .then(Item => {
            res.render('admin/custlist', { cust: Item })
        })
        .catch(err => { 
            res.status(500).send({ message: err.message || "Error Occurred while retriving Item information" })
        })
})



module.exports = router;
