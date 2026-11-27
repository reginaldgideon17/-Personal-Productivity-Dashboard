import { createUser, findByEmail } from '../model/user.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export async function register(req, res) {
    try {
        const { name, email, password } = req.body
        if (typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({ error: 'Name is required' })
        }
        if (typeof email !== 'string' || !email.includes('@')) {
            return res.status(400).json({ error: 'A valid email is required' })
        }
        if (typeof password !== 'string' || password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters' })
        }
        const existing = await findByEmail(email.trim().toLowerCase())

        if (existing) {
            return res.status(409).json({
                error: 'Email already registered'
            })
        }
        const passwordHash = await bcrypt.hash(password, 10)
        const user = await createUser(name.trim(), email.trim().toLowerCase(), passwordHash)
        res.status(201).json(user)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: 'Failed to create user'
        })
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body
        if (typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).json({
                error: 'Email and password are required'
            })
        }

        const user = await findByEmail(email.trim().toLowerCase())
        if (!user) {
            return res.status(401).json({
                error: 'Invalid email or password'
            })
        }

        const ok = await bcrypt.compare(password, user.password_hash)
        if (!ok) {
            return res.status(401).json({
                error: 'Invalid email or password'
            })
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: 'Failed to log in'
        })
    }
}