const pool = require('../database')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
    try{
        const {name, email, password } = req.body

        const salt = await bcrypt.genSalt(10)
        const hashPass = await bcrypt.hash(password, salt)

        const setSyntax = 'INSERT INTO users (name, email, password) VALUES($1, $2, $3) RETURNING id, name, email, created_at';

        const results = await pool.query(setSyntax, [name, email, hashPass])

        res.status(201).json(results.rows[0]);
    }catch(err){
        res.status(500).json({message: err.message})
    }
}

const login = async (req, res) => {
    try{
        const { email, password} = req.body;

        const setSyntax = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(setSyntax, [email])

        if(result.rows.length === 0){
            return res.status(401).json({message: 'invalid email or password'})
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch) return res.status(401).json({message: 'invalid password'})

        const token = jwt.sign(
            {id: user.id},
            process.env.JWT_SECRET,
            {expiresIn:'30m'}
        )

        res.status(200).json({
            message: "login successfully",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            }
        })

    }
    catch(err){
        res.status(500).json({message: err.message})
    }
}

module.exports = {
    register,
    login
}