import pool from '../config/db.js'

export default async function getServerTime() {
   const results= await pool.query(`SELECT NOW()`)

    return results.rows[0]
}