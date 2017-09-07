import _ from "lodash";
import { success, notFound, authorOrAdmin } from "../../services/response/";
import { Comment } from ".";
import { Feed } from "../feed";

export const create = ({ user, bodymen: { body } }, res, next) =>
  Comment.create({ ...body, user })
    .then(comment => {
      Feed.findById(body.feedId, function(err, result) {
        result.commentsId.push(comment._id);
        result.save();
      });
      return comment;
    })
    .then(comment => comment.view(true))
    .then(success(res, 201))
    .catch(next);

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Comment.find(query, select, cursor)
    .populate("user")
    .then(comments => comments.map(comments => comments.view(true)))
    .then(success(res))
    .catch(next);

export const show = ({ params }, res, next) =>
  Comment.findById(params.id)
    .populate("user")
    .then(notFound(res))
    .then(comments => (comments ? comments.view() : null))
    .then(success(res))
    .catch(next);

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Comment.findById(params.id)
    .populate("user")
    .then(notFound(res))
    .then(authorOrAdmin(res, user, "user"))
    .then(comments => (comments ? _.merge(comments, body).save() : null))
    .then(comments => (comments ? comments.view(true) : null))
    .then(success(res))
    .catch(next);

export const destroy = ({ user, params }, res, next) =>
  Comment.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, "user"))
    .then(comments => (comments ? comments.remove() : null))
    .then(success(res, 204))
    .catch(next);
