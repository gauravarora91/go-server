import _ from "lodash";
import Promise from "bluebird";
import {
    success,
    notFound
} from "../../services/response/";
import {
    uid
} from "rand-token";
import * as s3 from "../../services/s3";
import Image from "../../services/image";
import {
    Event
} from ".";

export const create = ({
    user,
    bodymen: {
        body
    }
}, res, next) => {
    let createdBy = user;
    console.log(...body);
    Event.create({ ...body,
            createdBy
        })
        .then(event => event.view(true))
        .then(success(res, 201))
        .catch(next);
};

export const index = ({
        querymen: {
            query,
            select,
            cursor
        }
    }, res, next) =>
    Event.find(query, select, cursor)
    .populate("createdBy")
    .then(events => events.map(event => event.view(true)))
    .then(success(res))
    .catch(next);

export const show = ({
        params
    }, res, next) =>
    Event.findById(params.id)
    .populate("createdBy")
    .then(notFound(res))
    .then(event => (event ? event.view() : null))
    .then(success(res))
    .catch(next);

export const addBacker = ({
    user,
    bodymen: {
        body
    },
    params
}, res, next) => {
    body.backer = {
        user: body.user,
        amount: body.amount
    };

    Event.findById(params.id)
        .then(notFound(res))
        .then(event => {
            if (event.backers.length > 0) {
                /*
                  if user already backed an event then
                  the amount entered by user
                  will be added to previous amount
                */
                let backers = _.filter(event.backers, function(backer) {
                    return backer.user == body.user;
                });

                if (backers.length > 0) {
                    let amount = parseInt(backers[0].amount) + parseInt(body.amount);
                    backers[0].amount = amount;
                    event.save();

                } else {
                    event.backers.push(body.backer);
                    event.save();
                }
                return event;
            } else {
                event.backers.push(body.backer);
                event.save();
                return event;
            }
        })
        .then(event => (event ? event.view(true) : null))
        .then(success(res))
        .catch(next);
};
export const addBackerAdmin = ({
    bodymen: {
        body
    },
    params
}, res, next) => {
    Event.findOneAndUpdate({
            _id: params.id
        }, {
            $push: {
                backers: {
                    amount: body.amount,
                    method: body.method,
                    user: body.user
                }
            }
        }, {
            new: true
        })
        .then(success(res))
        .catch(next);
};

export const addReward = ({
    bodymen: {
        body
    },
    params
}, res, next) => {
    Event.findOneAndUpdate({
            _id: params.id
        }, {
            $push: {
                rewards: {
                    amount: body.amount,
                    description: body.description
                }
            }
        })
        .then(success(res))
        .catch(next);
};

export const updateReward = ({
    bodymen: {
        body
    },
    params,
    user
}, res, next) => {
    Event.findOne({
            "rewards._id": params.id
        }, (err, event) => {
            if (err) {
                return next(err);
            }
            if (event) {
                console.log(event);

                event.rewards.push({
                    amount: body.amount,
                    description: body.description
                });
                event.save(function(err) {
                    if (err) {
                        return next(err);
                    } else {
                        Event.findOneAndUpdate({
                                "rewards._id": params.id
                            }, {
                                $pull: {
                                    rewards: {
                                        _id: params.id
                                    }
                                }
                            },
                            function(err, done) {
                                console.log("success");
                            }
                        );
                    }
                });
            }
        })
        .then(success(res))
        .catch(next);
};

export const update = ({
    bodymen: {
        body
    },
    params
}, res, next) => {
    Event.findById(params.id)
        .then(notFound(res))
        .then(event => (event ? _.merge(event, body).save() : null))
        .then(event => (event ? event.view(true) : null))
        .then(success(res))
        .catch(next);
};
export const destroy = ({
        params
    }, res, next) =>
    Event.findById(params.id)
    .then(notFound(res))
    .then(event => (event ? event.remove() : null))
    .then(success(res, 204))
    .catch(next);

const removeCurrentPhotos = event => {
    if (event.image) {
        const sizes = Object.keys(event.image.toObject());
        const promises = [];
        if (sizes.length) {
            promises.push(sizes.map(size => s3.remove(event.image[size])));
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

export const updatePhoto = ({
    user,
    params,
    file
}, res, next) => {
    console.log(user);
    Event.findById(params.id)
        // .then(notFound(res))
        // .then(authorOrAdmin(res, user, 'user'))
        .then(event => {
            console.log(event);
            if (!event) return null;
            removeCurrentPhotos(event);
            return Image.read(file.buffer)
                .then(image => {
                    event.color = image.getPredominantColorHex();
                    return uploadResizedPhotos(image);
                })
                .then(image => {
                    // console.log(image);
                    event.images = image;
                    return event.save();
                });
        })
        .then(event => (event ? event.view(true) : null))
        .then(success(res))
        .catch(next);
};