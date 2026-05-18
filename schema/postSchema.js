// validation/postValidation.js
const { z } = require('zod');

// Schema for CREATING a post
const createPostSchema = z.object({
    title: z.string()
        .min(3, { message: "Title must be at least 3 characters long" })
        .max(255, { message: "Title cannot exceed 255 characters" }),
    content: z.string()
        .min(10, { message: "Content must be at least 10 characters long" }),
    // user_id is optional here if your middleware automatically extracts it from the JWT token
});

// Schema for UPDATING a post (Allows modifying just the title or just the content)
const updatePostSchema = createPostSchema.partial();

module.exports = { createPostSchema, updatePostSchema };
