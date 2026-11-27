//Importing files needed

import getServerTime from "../model/system.model.js";
export function health(req, res) {
    res.json({
        success: true,
        message: "Running server"
    })
}

export async function dbTest(req, res) {
    try {
        const data = await getServerTime()
         res.json({
            success: true,
            data

        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message: "Database connection failed"
        })

    }
}

