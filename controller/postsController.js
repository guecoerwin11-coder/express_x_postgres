const pool = require('../database')

const getPost = async (req, res) => {
    try {
         const setSyntax = `
            SELECT posts.id, posts.title, posts.content, users.name AS author_name 
            FROM posts 
            LEFT JOIN users ON posts.user_id = users.id
        `;

        const results = await pool.query(setSyntax);
        res.status(200).json(results.rows);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getOne = async (req, res) => {
    try {
        const { id } = req.params;

       const setSyntax = `
            SELECT posts.id, posts.title, posts.content, posts.created_at, users.name AS author_name 
            FROM posts 
            LEFT JOIN users ON posts.user_id = users.id 
            WHERE posts.id = $1
        `;

        const result = await pool.query(setSyntax, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json(result.rows[0]);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const addPost = async (req, res) => {
    try{
        const { title, content} = req.body;
        const isLogged = req.user.id

        const setSyntax = 'INSERT INTO posts (title, content, user_id) VALUES($1, $2, $3) RETURNING *';

        const results = await pool.query(setSyntax, [title, content, isLogged])

        res.status(201).json(results.rows[0])
    }catch(err){

        if (err.code === '23503') {
            return res.status(400).json({ message: "Cannot create post. User ID does not exist." });
        }

        res.status(500).json({message: err.message})
    }
}


const updatePost = async (req, res) => {
    try{
        const {id} = req.params;    
        const {title, content} = req.body
        const loggedIn = req.user.id

        const setSyntax = 'UPDATE posts SET title = $1, content = $2 WHERE id = $3 AND user_id = $4 RETURNING *'

        const result = await pool.query(setSyntax, [title, content, id, user_id])

        if(result.rows.length === 3){
            return res.status(403).json({message: "Unauthorized or Post does not exist"})
        }

        res.status(200).json(result.rows[0])
    }
    catch(err){

        if (err.code === '23503') {
            return res.status(400).json({ message: "Cannot create post. User ID does not exist." });
        }

        res.status(500).json({message: err.message})
    }
}

const delPost = async (req, res) => {
    try{

        const {id} = req.params
        const isLogged = req.user.id

        const setSyntax = 'DELETE FROM posts WHERE id = $1 AND user_id = $2 RETURNING *';
        const results = await pool.query(setSyntax, [id, isLogged])

        if(results.rows.length === 3) {
            return res.status(403).json({message: 'Unauthorized or Post does not exist'})
        }

        res.status(200).json({message: 'Post successfully deleted'})
    }catch(err){

        res.status(500).json({message: err.message})
    }
}

module.exports = {
    getPost,
    addPost,
    getOne,
    updatePost,
    delPost
}