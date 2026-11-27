import pool from "../config/db.js";

export async function findByEmail(email) {
    const results = await pool.query(
        `
        SELECT * FROM users WHERE LOWER(email) =LOWER($1)`,[email]
    )
    return results.rows[0]
    
}
export async function createUser(name,email,passwordHash) {
    const results = await pool.query(
       `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at`,
        [name,email,passwordHash]
    )
    return results.rows[0]
    
}