const router = require('express').Router()

router.get("/getsession", (req, res) => {
    return res.send({username: req.session.username, role: req.session.role})
})

module.exports = router