import _ from "lodash";
import { success, notFound, authorOrAdmin } from "../../services/response/";
import { Reaction } from ".";
import { Feed } from "../feed";

export const create = ({ user, bodymen: { body } }, res, next) => {
  Reaction.create({ ...body, user: user })
    .then(reaction => {
      Feed.findById(body.feedId, function(err, result) {
        result.reactionId.push(reaction._id);
        result.save();
      });
      return reaction;
    })
    .then(reaction => reaction.view(true))
    .then(success(res, 201))
    .catch(next);
};

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Reaction.find(query, select, cursor)
    .populate("user", ["name", "id", "picture"])
    .then(reactions => reactions.map(reaction => reaction.view()))
    .then(success(res))
    .catch(next);

export const show = ({ params }, res, next) =>
  Reaction.findById(params.id)
    .populate("user", ["name", "id", "picture"])
    .then(notFound(res))
    .then(reaction => (reaction ? reaction.view() : null))
    .then(success(res))
    .catch(next);

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Reaction.findById(params.id)
    .populate("user")
    .then(notFound(res))
    .then(authorOrAdmin(res, user, "user"))
    .then(reaction => (reaction ? _.merge(reaction, body).save() : null))
    .then(reaction => (reaction ? reaction.view(true) : null))
    .then(success(res))
    .catch(next);

export const destroy = ({ user, params }, res, next) =>
  Reaction.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, "userId"))
    .then(reaction => (reaction ? reaction.remove() : null))
    .then(success(res, 204))
    .catch(next);
