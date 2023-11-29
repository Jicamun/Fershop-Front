const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const requireAuth = async (req, res, next) => {
    // Verify Authentication
    const { authorization } = req.headers

    const token = extractTokenFromHeader(authorization)

    if( !authorization ) {
        return res.status(401).json({error: 'Authorization token Required'})
    }

    try {
        const {values} = jwt.verify(token, process.env.SECRET)

        req.user = await User.findOne({_id: values.user}).select('_id')
        next()
    } catch (error) {
        console.log(error.message)
        res.status(401).json({error: 'Request is not Authorized'})
    }

}

function extractTokenFromHeader(authorization) {
    let response = ""   

    if(authorization){
        response = authorization.split(' ')[1]
    }

    return response
}

module.exports = requireAuth