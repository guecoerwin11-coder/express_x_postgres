const validate = (schema) => (req, res, next) => {
    try{
        const results = schema.safeParse(req.body)

        if(!results.success){
            return res.status(400).json({
                error: results.error.flatten().fieldError
            })
        }

        req.body = results.data
        next()
    }
    catch(err){
        return res.status(500).json({ message: "Internal Validation Error" });
    }
}

module.exports = validate