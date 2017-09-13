import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export Reaction, { schema } from './model'

const router = new Router()
const { feedId, likes } = schema.tree

/**
 * @api {post} /reactions Create reaction
 * @apiName CreateReaction
 * @apiGroup Reaction
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam feedId Reaction's feedId.
 * @apiParam likes Reaction's likes.
 * @apiSuccess {Object} reaction Reaction's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Reaction not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  body({ feedId, likes }),
  create)

/**
 * @api {get} /reactions Retrieve reactions
 * @apiName RetrieveReactions
 * @apiGroup Reaction
 * @apiUse listParams
 * @apiSuccess {Object[]} reactions List of reactions.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index)

/**
 * @api {get} /reactions/:id Retrieve reaction
 * @apiName RetrieveReaction
 * @apiGroup Reaction
 * @apiSuccess {Object} reaction Reaction's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Reaction not found.
 */
router.get('/:id',
  show)

/**
 * @api {put} /reactions/:id Update reaction
 * @apiName UpdateReaction
 * @apiGroup Reaction
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam feedId Reaction's feedId.
 * @apiParam likes Reaction's likes.
 * @apiSuccess {Object} reaction Reaction's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Reaction not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  token({ required: true }),
  body({ feedId, likes }),
  update)

/**
 * @api {delete} /reactions/:id Delete reaction
 * @apiName DeleteReaction
 * @apiGroup Reaction
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Reaction not found.
 * @apiError 401 user access only.
 */
router.delete('/:id',
  token({ required: true }),
  destroy)

export default router
