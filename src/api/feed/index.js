import multer from 'multer'
import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, show, update, destroy, updatePhoto, reaction } from './controller'
import { schema } from './model'
export Feed, { schema } from './model'
const { check, validationResult } = require("express-validator/check");
const router = new Router()
const upload = multer({
  limits: {
    fileSize: 10 * Math.pow(1024, 2) // 20MB
  }
})
const { type, url, category, text, image, slug } = schema.tree

/**
 * @api {post} /feeds Create feed
 * @apiName CreateFeed
 * @apiGroup Feed
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam type Feed's type.
 * @apiParam url Feed's url.
 * @apiParam category Feed's category.
 * @apiParam text Feed's text.
 * @apiParam image Feed's image.
 * @apiParam slug Feed's slug.
 * @apiSuccess {Object} feed Feed's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Feed not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  body({ type, url, category, text, image, slug }),
  [
    check('type')
      .exists()
      .withMessage('Type Of The Feed Is Required'),

    check('text')
      .exists()
      .withMessage('The Feed Required Some Text')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }
    next()
  },
  create)

/**
 * @api {get} /feeds Retrieve feeds
 * @apiName RetrieveFeeds
 * @apiGroup Feed
 * @apiUse listParams
 * @apiSuccess {Object[]} feeds List of feeds.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index)

/**
 * @api {get} /feeds/:id Retrieve feed
 * @apiName RetrieveFeed
 * @apiGroup Feed
 * @apiSuccess {Object} feed Feed's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Feed not found.
 */
router.get('/:id',
  show)

/**
 * @api {put} /feeds/:id/image Update feed photo
 * @apiName UpdateFeedPhoto
 * @apiGroup Feed
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam data The file.
 * @apiSuccess {Object} feed Feed's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Feed not found.
 * @apiError 401 user access only.
 */
router.put('/:id/image',
  //token({ required: true }),
  upload.single('data'),
  updatePhoto)


/**
 * @api {put} /feeds/:id Update feed
 * @apiName UpdateFeed
 * @apiGroup Feed
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam type Feed's type.
 * @apiParam url Feed's url.
 * @apiParam category Feed's category.
 * @apiParam text Feed's text.
 * @apiParam image Feed's image.
 * @apiParam slug Feed's slug.
 * @apiSuccess {Object} feed Feed's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Feed not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  token({ required: true }),
  body({ type, url, category, text, image, slug }),
  update)

/**
 * @api {delete} /feeds/:id Delete feed
 * @apiName DeleteFeed
 * @apiGroup Feed
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Feed not found.
 * @apiError 401 user access only.
 */
router.delete('/:id',
  token({ required: true }),
  destroy)

router.put('/:id/reaction',
  token({ required: true }),
  reaction)

export default router
