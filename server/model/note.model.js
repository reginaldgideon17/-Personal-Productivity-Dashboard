import { db } from '../config/db.js'

export async function fetchUsers() {
    try {
        const fetchUsersResults = await db.query(`
            SELECT * FROM users
            `)
        return fetchUsersResults;
        
    } catch (error) {
        console.error(`There was an error in note.model.js - dbTest`)
        console.error(error.name)
        console.error(error.message)
        throw error
    }

}