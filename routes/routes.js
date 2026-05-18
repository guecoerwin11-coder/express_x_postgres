const express = require('express')
const router = express.Router()
const { register, login } = require('../controller/usersController')
const { getPost, getOne, addPost, updatePost, delPost} = require('../controller/postsController')
const validate = require('../middleware/validate')
const protect = require('../middleware/protect')
const {createPostSchema, updatePostSchema} = require('../schema/postSchema')
const {registerSchema, loginSchema} = require('../schema/userSchema')


router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)


router.get('/posts', protect, getPost)
router.get('/posts/:id', protect, getOne)
router.post('/posts', protect, validate(createPostSchema), addPost)
router.put('/posts/:id', protect, validate(updatePostSchema), updatePost)
router.delete('/posts/:id', protect, delPost)


module.exports = router