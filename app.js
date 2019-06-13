const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const expressSanitizer = require('express-sanitizer')

mongoose.connect("mongodb://localhost/restful-blog", {useNewUrlParser: true})
mongoose.set('useFindAndModify', false)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')
app.use(methodOverride("_method"))
app.use(expressSanitizer())

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
})
var Blog = mongoose.model('Blog', blogSchema)

// RESTFUL ROUTES

// INDEX
app.get('/', (req, res) => {
    res.redirect('/blogs')
})

app.get('/blogs', (req, res) => {
    Blog.find({}, (err, allBlogs) => {
        if (err) {
            console.log(err)
        } else {
            allBlogs.reverse()
            console.log('Retrieving All Blogs: ', allBlogs)
            res.render('index', {blogs: allBlogs})
        }
    })
})

// CREATE
app.post('/blogs', (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body) // Changes text field to be pure HTML
    Blog.create(req.body.blog, (err, newBlog) => {
        if (err) {
            console.log(err)
        } else {
            console.log('New Blog Post: ', newBlog)
            res.redirect('/')
        }
    })
})

// NEW
app.get('/blogs/new', (req, res) => {
    res.render('new')
})

// SHOW
app.get('/blogs/:id', (req, res) => {
    // find blog post with provided ID
    Blog.findById(req.params.id, (err, foundBlog) => {
        if (err) {
            console.log(err)
        } else {
            res.render('show', {blog: foundBlog})
        }
    })
})

// EDIT
app.get('/blogs/:id/edit', (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if (err) {
            console.log(err)
        } else {
            res.render('edit', {blog: foundBlog})
        }
    })
})

// UPDATE
app.put('/blogs/:id', (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
        if (err) {
            console.log(err)
            res.redirect('/blogs')
        } else {
            console.log('UPDATED BLOG POST: ', updatedBlog)
            res.redirect('/blogs/' + req.params.id)
        }
    })
})

// DELETE
app.delete('/blogs/:id', (req, res) => {
    Blog.findByIdAndDelete(req.params.id, (err) => {
        if (err) console.log(err)
        res.redirect('/blogs')
    })
})

app.listen(3000);
console.log('Server running on port 3000')
