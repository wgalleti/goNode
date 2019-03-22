const express = require('express')

const app = express()

app.use(express.urlencoded({ extended: false }))

const nunjucks = require('nunjucks')

function ageMiddleware (res, req, next) {
  if (res.query.age) {
    return next()
  }

  return req.redirect('/')
}

nunjucks.configure('views', {
  autoescape: true,
  express: app,
  watch: true
})

app.set('view engine', 'njk')

app.get('/', (req, res) => {
  return res.render('age')
})

app.get('/minor', ageMiddleware, (req, res) => {
  return res.render('minor', { age: req.query.age })
})

app.get('/major', ageMiddleware, (req, res) => {
  return res.render('major', { age: req.query.age })
})

app.post('/check', (req, res) => {
  const age = req.body.age

  if (age < 18) {
    return res.redirect(`/minor/?age=${age}`)
  }

  return res.redirect(`/major/?age=${age}`)
})

app.listen(3000)
