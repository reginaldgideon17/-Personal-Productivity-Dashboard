// const dbTest = require('../model/note.model.js')
import { fetchUsers } from '../model/note.model.js'
import bcrypt from 'bcrypt'

export async function health(req, res) {
    try {
        const { email, password } = req.body
        console.log(`email: ${email}, password: ${password}`)
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            })
        }

        const dbTestResult = await dbTest()
        console.log(dbTestResult)



    } catch (error) {
        console.error(`There was an error in system.controller.js-health`)
        console.error(error.name)
        console.error(error.message)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}