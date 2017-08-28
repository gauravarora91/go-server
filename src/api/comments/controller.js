import _ from 'lodash'
import { success, notFound, authorOrAdmin } from '../../services/response/'
import { Comments } from '.'

export const create = ({ user, bodymen: { body } }, res, next) =>
  Comments.create({ ...body, user })
    .then((comments) => comments.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Comments.find(query, select, cursor)
    .populate('user')
    .then((comments) => comments.map((comments) => comments.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Comments.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then((comments) => comments ? comments.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Comments.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((comments) => comments ? _.merge(comments, body).save() : null)
    .then((comments) => comments ? comments.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ user, params }, res, next) =>
  Comments.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((comments) => comments ? comments.remove() : null)
    .then(success(res, 204))
    .catch(next)
