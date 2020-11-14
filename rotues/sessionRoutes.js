const router = require('express').Router()


router.get("/getsessionname", (req, res) => {
    username = req.session.username
    return res.send({data: username})

})

module.exports = router