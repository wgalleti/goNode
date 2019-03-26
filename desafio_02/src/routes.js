const express = require('express')
const multerConfig = require('./config/multer')
const upload = require('multer')(multerConfig)
const authMiddleare = require('./app/middlewares/auth')
const guestMiddleare = require('./app/middlewares/guest')
const routes = express.Router()

const UserController = require('./app/controllers/UserController')
const SessionController = require('./app/controllers/SessionController')
const DashboardController = require('./app/controllers/DashboardController')
const FilesController = require('./app/controllers/FilesController')
const AppointmentController = require('./app/controllers/AppointmentController')
const AvailableController = require('./app/controllers/AvailableController')
const ScheduleController = require('./app/controllers/ScheduleController')

routes.use((req, res, next) => {
  res.locals.flashSuccess = req.flash('success')
  res.locals.flashError = req.flash('error')

  next()
})

routes.get('/files/:file', FilesController.show)

routes.get('/', guestMiddleare, SessionController.create)
routes.post('/signin', SessionController.store)

routes.get('/signup', guestMiddleare, UserController.create)
routes.post('/signup', upload.single('avatar'), UserController.store)

// Apply default auth middleare for routes with start app
routes.use('/app', authMiddleare)

routes.get('/app/logout', SessionController.destroy)
routes.get('/app/dashboard', DashboardController.index)

routes.get('/app/appointments/new/:provider', AppointmentController.create)
routes.get('/app/availables/:provider', AvailableController.index)
routes.post('/app/appointments/new/:provider', AppointmentController.store)
routes.get('/app/schedules', ScheduleController.index)
routes.get('/app/schedules/:provider', ScheduleController.detail)

module.exports = routes
