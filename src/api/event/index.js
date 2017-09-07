import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, show, update, destroy, addReward, addBacker } from './controller'
import { schema } from './model'
export Event, { schema } from './model'

const router = new Router()
const {
  name,
  descriptionShort,
  descriptionLong,
  pledgedAmount,
  images,
  time,
  backer,
  rewards,
  amount,
  description
} = schema.tree

/**
 * @api {post} /events Create event
 * @apiName CreateEvent
 * @apiGroup Event
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiParam name Event's name.
 * @apiParam descriptionShort Event's descriptionShort.
 * @apiParam descriptionLong Event's descriptionLong.
 * @apiParam pledgedAmount Event's pledgedAmount.
 * @apiParam images Event's images.
 * @apiParam time Event's time.
 * @apiSuccess {Object} event Event's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Event not found.
 * @apiError 401 admin access only.
 */
router.post(
  '/',
  token({ required: true, roles: ['admin'] }),
  body({ name, descriptionShort, descriptionLong, pledgedAmount, images, time, backer, rewards }),
  create
)

/**
 * @api {get} /events Retrieve events
 * @apiName RetrieveEvents
 * @apiGroup Event
 * @apiUse listParams
 * @apiSuccess {Object[]} events List of events.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/', query(), index)

/**
 * @api {get} /events/:id Retrieve event
 * @apiName RetrieveEvent
 * @apiGroup Event
 * @apiSuccess {Object} event Event's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Event not found.
 */
router.get('/:id', show)

/**
 * @api {put} /events/:id Update event
 * @apiName UpdateEvent
 * @apiGroup Event
 * @apiParam name Event's name.
 * @apiParam descriptionShort Event's descriptionShort.
 * @apiParam descriptionLong Event's descriptionLong.
 * @apiParam pledgedAmount Event's pledgedAmount.
 * @apiParam images Event's images.
 * @apiParam time Event's time.
 * @apiSuccess {Object} event Event's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Event not found.
 */
router.put('/:id', body({ name, descriptionShort, descriptionLong, pledgedAmount, images }), update)
/*
* @api {put} /events/:id/backer add backers event
* @apiName UpdateEvent
* @apiGroup Event
*/
router.put('/:id/backer', token({ required: true }), body({ amount }), addBacker)
// router.put('/:id/editBacker', token({ required: true }), body({ amount }), editBacker)

router.put('/:id/reward', body({ amount, description }), addReward)

/**
 * @api {delete} /events/:id Delete event
 * @apiName DeleteEvent
 * @apiGroup Event
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Event not found.
 * @apiError 401 admin access only.
 */
router.delete('/:id', token({ required: true, roles: ['admin'] }), destroy)

export default router
