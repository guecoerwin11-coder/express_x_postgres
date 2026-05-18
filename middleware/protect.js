const jwt = require('jsonwebtoken')


const protect = (req, res, next) => {
    try{
        const auth = req.headers.authorization

        if(!auth || !auth.startsWith('Bearer ')){
            return res.status(401).json({message: 'access denied, inavlid password'})
        }

        const ver = auth.split(' ')[1]
        const decode = jwt.verify(ver, process.env.JWT_SECRET)

        req.user = decode
        next()
    
    }catch(err){
        res.status(500).json({message: err.message})
    }
}

module.exports = protect