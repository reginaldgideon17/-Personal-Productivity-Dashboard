import { createNote, deleteNote, findAllByUser, updateNote } from "../model/note.model.js";

//const req.userId = 1

export async function list(req, res) {
    try {
        const data = await findAllByUser(req.userId)
        res.json({
            success: true,
            data
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to find user"
        })
        console.log(error.message)

    }
}
//create a new note
export async function create(req, res) {
    try {
        // console.log('BODY', req.body, typeof req.body?.title)
        const { title, content = '' } = req.body

        if (typeof title !== 'string' || !title.trim()) {
            return res.status(400).json({
                error: "Title is required"
            })
        }
        const note = await createNote(req.userId, title.trim(), content)
        res.status(201).json(note)

    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            error: 'Failed to create note'
        })
    }


}

//Update notes
export async function update(req, res) {
    const id = Number(req.params.id)
    if (!Number.isInteger(id)) {
        return res.status(400).json({
            error: "Id is invalid"
        })
    }
    const { title, content = "" } = req.body
    if (typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({
            error: "Title is required"
        })
    }
    const note = await updateNote(id, req.userId, title.trim(), content)
    if (!note) {
        return res.status(404).json({
            error: "Note not found"
        })
    }
    return res.json(note)
}
//Deleting a note

export async function remove(req, res) {

    try {
        const id = Number(req.params.id)
        if (!Number.isInteger(id)) {
            return res.status(400).json({
                error: "Id is valid"
            })

        }
        const note = await deleteNote(id, req.userId)
        if (!note) {
            return res.status(404).json({
                error: "Note not found"
            })
        }
        return res.status(204).end()

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error:'Failed to delete'
        })

    }
}