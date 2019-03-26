const { Appointment, User } = require('../models')
const { Op } = require('sequelize')
const moment = require('moment')

class ScheduleController {
  async index (req, res) {
    const provider = await User.findByPk(req.session.user.id)
    return res.render('schedules/index', { provider })
  }

  async detail (req, res) {
    const date = moment(parseInt(req.query.date))

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.session.user.id,
        date: {
          [Op.between]: [
            date.startOf('day').format(),
            date.endOf('day').format()
          ]
        }
      }
    })

    const schedules = await Promise.all(
      appointments.map(async a => {
        const user = await User.findByPk(a.user_id)
        return {
          date: moment(a.date).format('DD/MM/YYYY HH:mm'),
          user
        }
      })
    )

    return res.render('schedules/list', { schedules })
  }
}

module.exports = new ScheduleController()
