import express from "express"
// import users from "./MOCK_DATA.json" assert {type: 'json'}/
import fs from "fs"
const data = fs.readFileSync("./MOCK_DATA.json", "utf-8");
const users = JSON.parse(data);

const app = express();
app.use(express.json())
const PORT = 2026;

app.get('/health', (req, res) => {
    return res.send('Everything is working fine')
})

// GET - all users
app.get('/api/v1/users', (req, res) => {
    return res.status(200).json({
        message: 'All users data retrieved successfully',
        users
    })
})

// GET - user by id
app.get('/api/v1/users/:id', (req, res) => {
    let { id } = req.params // destructing syntax
    id = parseInt(id)
    console.log('ID dikhau----', id)

    const userIndex = users.findIndex(user => user.id === id)

    if (userIndex === -1) { //user not found
        return res.status(404).json({ message: 'User not found - get user by id API' })
    }

    const userData = users[userIndex]

    return res.status(200).json({
        message: 'User by id retrieved successfully',
        userData
    })

})

// POST - create a new user
app.post('/api/v1/users', (req, res) => {
    const body = req.body
    users.push({ ...body, id: users.length + 1 })

    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err) => {
        if (err) return res.status(500).json({ message: 'Some error occured while creating a new user' })

        return res.status(201).json({
            message: 'User created successfully',
            id: users.length
        })
    })

})

// PATCH - update any user field
app.patch('/api/v1/users/:id', (req, res) => {

    let { id } = req.params
    id = parseInt(id)

    const userIndex = users.findIndex(user => user.id === id)

    if (userIndex === -1) {
        return res.status(404).json({ message: 'user not found in patch request' })
    }

    const dataToUpdate = req.body

    const userData = users[userIndex]
    console.log('Data to update----', dataToUpdate)
    console.log('User data----', userData)

    users[userIndex] = { ...userData, ...dataToUpdate }

    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err) => {
        if (err) return res.status(500).json({ message: 'Some error occured while performing a patch request' })

        return res.status(200).json({
            message: 'User details patched successfully',
            user: users[userIndex]
        })
    })
})

// PUT - update all fields
app.put('/api/v1/users/:id', (req, res) => {
    let { id } = req.params
    id = parseInt(id)

    const userIndex = users.findIndex(user => user.id === id)

    if (userIndex === -1) {
        return res.status(404).json({ message: 'user not found in put request' })
    }

    const dataToUpdate = req.body

    users[userIndex] = { ...dataToUpdate, id }

    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err) => {
        if (err) return res.status(500).json({ message: 'Some error occured while performing a put request' })

        return res.status(200).json({
            message: 'User details put successfully',
            user: users[userIndex]
        })
    })
})

// DELETE - delete a user
app.delete('/api/v1/users/:id', (req, res) => {
    let { id } = req.params
    id = parseInt(id)

    const userIndex = users.findIndex(user => user.id === id)

    if (userIndex === -1) {
        return res.status(404).json({ message: 'user not found in delete request' })
    }

    const deletedUser = users[userIndex]
    const availableUsers = users.filter(user => user.id !== id)

    fs.writeFile('./MOCK_DATA.json', JSON.stringify(availableUsers), (err) => {
        if (err) return res.status(500).json({ message: 'Some error occured while performing a delete request' })

        return res.status(200).json({
            message: 'User deleted successfully',
            user: deletedUser
        })
    })

})

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`))