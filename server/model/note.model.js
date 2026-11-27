import pool from '../config/db.js'

export async function findAllByUser(userId) {
    const results = await pool.query(`
        SELECT * FROM notes WHERE user_id = $1 ORDER BY updated_at DESC`, [userId])
    return results.rows


}
export async function createNote(userId, title, content) {
    const results = await pool.query(`
    INSERT INTO notes (user_id, title, content) VALUES ($1, $2, $3) RETURNING *`, [userId, title, content])
    return results.rows[0]
}
export async function updateNote(id, userId, title, content) {
    const results = await pool.query(`
        UPDATE notes set title= $1 ,content = $2 , updated_at = NOW() WHERE id = $3 AND user_id= $4 RETURNING *`, [title, content, id, userId])
    return results.rows[0]
}
export async function deleteNote(id, userId) {
    const results = await pool.query(
        ` DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING id`, [id, userId]
    )
    return results.rows[0]
}