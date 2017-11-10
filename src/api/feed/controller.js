import Promise from "bluebird";
import _ from "lodash";
import { success, notFound, authorOrAdmin } from "../../services/response/";
import { uid } from "rand-token";
import * as s3 from "../../services/s3";
import Image from "../../services/image";
import { Feed } from ".";

export const create = ({ user, bodymen: { body } }, res, next) => {
  console.log(body);
  let regex = /(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/;
  let watchUrl = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/;
  if (typeof body.text !== "undefined") {
    if (body.text.match(regex)) {
      if (body.text.match(watchUrl)) {
        console.log("in");
        let url = regex.exec(body.text)[0];
        body.text = body.text.replace(regex, "");
        body.type = "video";
        body.url = url;
      }
    }
  }
  let promise = Promise.resolve();
  promise.then(() =>
    Feed.create({ ...body, user })
      .then(feed => feed.view(true))
      .then(success(res, 201))
      .catch(next)
  );
};
export const index = ({ querymen: { query, select, cursor } }, res, next) => {
  Feed.find(query, select, cursor)
    .populate("user")
    .populate("commentsId")
    .populate({
      path: "commentsId",
      populate: {
        path: "user",
        model: "User"
      }
    })
    .then(feeds => feeds.map(feed => feed.view()))
    .then(feeds => _.sortBy(feeds, ["-createdAt"]))
    .then(success(res))
    .catch(next);
};

export const show = ({ params }, res, next) =>
  Feed.findById(params.id)
    .populate("user")
    .then(notFound(res))
    .then(feed => (feed ? feed.view() : null))
    .then(success(res))
    .catch(next);

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Feed.findById(params.id)
    .populate("user")
    .then(notFound(res))
    .then(authorOrAdmin(res, user, "user"))
    .then(feed => (feed ? _.merge(feed, body).save() : null))
    .then(feed => (feed ? feed.view(true) : null))
    .then(success(res))
    .catch(next);

export const reaction = ({ user, params }, res, next) =>
  Feed.findById(params.id)
    .then(notFound(res))
    .then(feed => {
      const reactionId = feed.reactionId;
      const index = reactionId.indexOf(user.id);
      if (index > -1) {
        reactionId.splice(index, 1);
        feed.save();
        return feed;
      } else {
        feed.reactionId.push(user.id);
        feed.save();
        return feed;
      }
    })
    .then(feed => (feed ? feed.view(true) : null))
    .then(success(res))
    .catch(next);

export const destroy = ({ user, params }, res, next) =>
  Feed.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, "user"))
    .then(feed => (feed ? feed.remove() : null))
    .then(success(res, 204))
    .catch(next);

const removeCurrentPhotos = feed => {
  if (feed.image) {
    const sizes = Object.keys(feed.image.toObject());
    const promises = [];
    if (sizes.length) {
      promises.push(sizes.map(size => s3.remove(feed.image[size])));
    }
    return Promise.all(promises);
  }
};

const uploadResizedPhotos = image => {
  const uniqueId = uid(24);
  const getFileName = size => `${uniqueId}_${size}.jpg`;
  const sizes = {
    large: [1024, 768],
    medium: [640, 480],
    small: [320, 240]
  };
  const promises = Object.keys(sizes).reduce((object, size) => {
    object[size] = image
      .clone()
      .quality(100)
      .scaleToFit(...sizes[size])
      .getBuffer();
    return object;
  }, {});
  return Promise.props(promises).then(buffers =>
    Promise.props(
      Object.keys(buffers).reduce((object, size) => {
        object[size] = s3.upload(buffers[size], getFileName(size), "image/jpeg");
        return object;
      }, {})
    )
  );
};

export const updatePhoto = ({ user, params, file }, res, next) => {
  console.log(user);
  Feed.findById(params.id)
    // .then(notFound(res))
    // .then(authorOrAdmin(res, user, 'user'))
    .then(feed => {
      console.log(feed);
      if (!feed) return null;
      removeCurrentPhotos(feed);
      return Image.read(file.buffer)
        .then(image => {
          feed.color = image.getPredominantColorHex();
          return uploadResizedPhotos(image);
        })
        .then(image => {
          // console.log(image);
          feed.type = "image";
          feed.image = image;
          return feed.save();
        });
    })
    .then(feed => (feed ? feed.view(true) : null))
    .then(success(res))
    .catch(next);
};
