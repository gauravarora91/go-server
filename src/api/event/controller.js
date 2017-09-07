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
    .then(events => events.map(event => event.view(true)))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Event.findById(params.id)
    .then(notFound(res))
    .then(event => (event ? event.view() : null))
    .then(success(res))
    .catch(next)

export const addBacker = ({ user, bodymen: { body }, params }, res, next) => {
  Event.findById(params.id)
    .then(notFound(res))
    .then(event => (event ? event.backer.push({ user: user, amount: body.amount }) : null))
    .then(event => (event ? console.log(event) : null))
    .then(success(res))
    .catch(next)
}

export const addReward = ({ bodymen: { body }, params }, res, next) => {
  Event.findById(params.id)
    .then(notFound(res))
    .then(event => (event ? event.rewards.push({ description: body.description, amount: body.amount }) : null))
    .then(event => (event ? console.log(event) : null))
    .then(success(res))
    .catch(next)
}

export const update = ({ bodymen: { body }, params }, res, next) => {
  /*  for rewards */
  let rewardAmount = body.rewardAmount
  let description = body.description
  /*  for backers */
  let amount = body.amount

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
