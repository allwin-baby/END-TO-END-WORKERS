const router = require('express').Router();
const { Login } = require('../models/registration');
router.get('/sp/',  (req, res) => {
    const id = req.query.id;
    console.log(id)
    Login.findById(id)
        .then(data =>{
            if(!data){
                res.status(404).send({ message : "Not found Item with id "+ id})
            }else{
                res.render('regw3cust',{sp:data})
            }
        })
        .catch(err =>{
            res.status(500).send({ message: "Erro retrieving Item with id " + id})
        })
    //res.render('regw3cust'); // rendering index.ejs file
})
module.exports = router;

router.get('/',  (req, res) => {
    
    res.render('regw3cust'); // rendering index.ejs file
})
module.exports = router;