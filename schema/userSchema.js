// validation/authValidation.js
const { z } = require('zod');

// This object mimics your PostgreSQL strict column rules
const registerSchema = z.object({
    name: z.string()
        .min(2, { message: "Name must be at least 2 characters long" })
        .max(100, { message: "Name cannot exceed 100 characters" }),
    email: z.string()
        .email({ message: "Invalid email structure pattern" }),
    password: z.string()
        .min(6, { message: "Password must contain at least 6 characters" })
});

const loginSchema = z.object({
    email: z.string()
        .email({ message: "Invalid email structure pattern" }),
    password: z.string()
        .min(6, { message: "Password must contain at least 6 characters" })
})

module.exports = { registerSchema, loginSchema };
