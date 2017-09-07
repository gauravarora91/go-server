import _ from 'lodash'
import { success, notFound } from '../../services/response/'
import { Event } from '.'

export const create = ({ user, bodymen: { body } }, res, next) => {
  let createdBy = user
  console.log(...body)
  Event.create({ ...body, createdBy })
    .then(event => event.view(true))
    .then(success(res, 201))
    .catch(next)
}

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Event.find(query, select, cursor)
    .populate('createdBy')
    .then(events => events.map(event => event.view(true)))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Event.findById(params.id)
    .populate('createdBy')
    .then(notFound(res))
    .then(event => (event ? event.view() : null))
    .then(success(res))
    .catch(next)

export const addBacker = ({ user, bodymen: { body }, params }, res, next) => {
  body.backer = { user: user, amount: body.amount }
  console.log(body)
  Event.findById(params.id)
    .then(notFound(res))
    .then(event => {
      if (event.backer.length > 0) {
        /*
          if user already backed an event then
          the amount entered by user
          will be added to previous amount
        */
        let backers = _.filter(event.backer, function (backer) {
          return backer.user == user.id
        })
        console.log(backers)
        if (backers.length > 0) {
          let amount = parseInt(backers[0].amount) + parseInt(body.amount)
          backers[0].amount = amount
          event.save()
          console.log(amount)
        } else {
          event.backer.push({ user: user, amount: body.amount })
          event.save()
        }
        return event
      } else {
        event.backer.push({ user: user, amount: body.amount })
        event.save()
        return event
      }
    })
    .then(event => (event ? event.view(true) : null))
    .then(success(res))
    .catch(next)
}

// exports.editBacker = ({ user, bodymen: { body }, params }, res) => {
//   Event.findOne({ _id: params.id }, (err, event) => {
//     if (err) {
//       return next(err)
//     }
//     if (event) {
//       event.backer.push({
//         amount: body.amount,
//         user: user
//       })
//
//       event.save(function (err) {
//         if (err) {
//           console.log(err)
//         } else {
//           console.log('success')
//         }
//       })
//     }
//   }).then(success(res))
// }
// export const editBacker = ({ user, bodymen: { body }, params }, res, next) => {
//   Event.findById(params.id)
//     .then(notFound(res))
//     .then(event => {
//       // event.backer.push({ user: user, amount: body.amount })
//       // event.save()
//       console.log('---------here-------')
//       console.log(
//         _.filter(event.backer, function (backer) {
//           return backer.user == user.id
//         })
//       )
//     })
// .then(event => (event ? event.view(true) : null))
// .then(success(res))
// .catch(next)
// }

export const addReward = ({ bodymen: { body }, params }, res, next) => {
  Event.findOne({ _id: params.id }, (err, event) => {
    if (err) {
      return next(err)
    }
    if (event) {
      console.log(event)
      event.rewards.push({
        amount: body.amount,
        description: body.description
      })

      event.save(function (err) {
        if (err) {
          return next(err)
        } else {
          console.log('success')
        }
      })
    }
  })
    .then(success(res))
    .catch(next)
}

export const update = ({ bodymen: { body }, params }, res, next) => {
  Event.findById(params.id)
    .then(notFound(res))
    .then(event => (event ? _.merge(event, body).save() : null))
    .then(event => (event ? event.view(true) : null))
    .then(success(res))
    .catch(next)
}
export const destroy = ({ params }, res, next) =>
  Event.findById(params.id)
    .then(notFound(res))
    .then(event => (event ? event.remove() : null))
    .then(success(res, 204))
    .catch(next)
