const express = require('express')
const app = express()
const port = 4000
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/User')
const Post = require('./models/Post')

const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10)

const jwt = require('jsonwebtoken')
const secret = 'sup3rS3cr3tPr!v@t3K3y'

const cookieParser = require('cookie-parser')
const multer = require('multer')
const upload = multer({ dest: '/tmp' })

const fs = require('fs')
require('dotenv').config()

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const bucket = 'rq-blog-bucket'


app.use(cors({
    credentials: true,
    origin: 'https://rq-blog-app.vercel.app'
}))
app.use(express.json())
app.use(cookieParser())
app.use('/uploads', express.static(__dirname + '/uploads'))

mongoose.connect(process.env.MONGO_URL)

const uploadToS3 = async (path, originalFilename, mimetype) => {

    const client = new S3Client({
        region: 'us-east-2',
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        },
    })

    const parts = originalFilename.split('.')
    const ext = parts[parts.length - 1]
    const newFilename = Date.now() + '.' + ext

    await client.send(new PutObjectCommand({
        Bucket: bucket,
        Body: fs.readFileSync(path),
        Key: newFilename,
        ContentType: mimetype,
        ACL: 'public-read',
    }))

    return `https://${bucket}.s3.amazonaws.com/${newFilename}`
}

app.post('/api/register', async (req, res) => {
    const { username, password } = req.body
    try {
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password, salt)
        })
        res.json(userDoc)
    } catch (error) {
        res.status(400).json(error)
    }
})

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body
    const userDoc = await User.findOne({ username })
    const isMatch = bcrypt.compareSync(password, userDoc.password)
    if (isMatch) {
        jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
            if (err) throw err
            res.cookie('jwtToken', token).json({
                id: userDoc._id,
                username,
            })
        })
    } else {
        res.status(400).json({ error: 'Wrong credentials' })
    }
})

app.get('/api/profile', (req, res) => {
    const { jwtToken } = req.cookies
    jwt.verify(jwtToken, secret, {}, (err, info) => {
        if (err) res.json(err)
        res.json(info)
    })
})

app.post('/api/logout', (req, res) => {
    res.cookie('jwtToken', '').json('ok')
})
app.post('/api/create', upload.single('file'), async (req, res) => {
    const { originalname, path, mimetype } = req.file
    const { title, summary, content } = req.body

    const url = await uploadToS3(path, originalname, mimetype)

    const { jwtToken } = req.cookies
    jwt.verify(jwtToken, secret, {}, async (err, info) => {
        if (err) res.json(err)
        const postDoc = await Post.create({ title, summary, content, cover: url, author: info.id })
        res.json({ info })
    })

})
app.get('/api/post', async (req, res) => {
    res.json(await Post.find().populate('author', ['username']).sort({ createdAt: -1 }).limit(20))
})
app.get('/api/post/:id', async (req, res) => {
    const { id } = req.params
    const postDoc = await Post.findById(id).populate('author', ['username'])
    res.json(postDoc)
})
app.put('/api/post', upload.single('file'), async (req, res) => {
    let newPath = null
    if (req.file) {
        const { originalname, path } = req.file
        const parts = originalname.split('.')
        const ext = parts[parts.length - 1]
        const newPath = path + '.' + ext
        fs.renameSync(path, newPath)
    }

    const { jwtToken } = req.cookies
    jwt.verify(jwtToken, secret, {}, async (err, info) => {
        if (err) res.json(err)
        const { id, title, summary, content } = req.body
        const postDoc = await Post.findById(id)
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info?.id)
        if (!isAuthor) {
            return res.status(400).json({ error: 'you are not the author' })
        }
        postDoc.title = title
        postDoc.summary = summary
        postDoc.content = content
        if (newPath) postDoc.cover = newPath
        await postDoc.save()
        res.json(postDoc)
    })
})
app.listen(port)