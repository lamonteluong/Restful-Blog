const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

mongoose.connect("mongodb://localhost/restful-blog", {useNewUrlParser: true});
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
})
var Blog = mongoose.model('Blog', blogSchema)

// RESTFUL ROUTES

app.get('/', (req, res) => {
    res.redirect('/blogs')
})

app.get('/blogs', (req, res) => {
    Blog.find({}, (err, allBlogs) => {
        if (err) {
            console.log(err)
        } else {
            console.log('Retrieving All Blogs: ', allBlogs)
            res.render('index', {blogs: allBlogs})
        }
    })
})

app.listen(3000);
console.log('Server running on port 3000')
