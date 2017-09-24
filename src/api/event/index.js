import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, show, update, destroy, addReward, addBacker, updateReward, addBackerAdmin } from './controller'
import { schema } from './model'
export Event, { schema } from './model'

const router = new Router()
const {
  name,
  descriptionHeading,
  descriptionShort,
  descriptionLong,
  pledgedAmount,
  images,
  time,
  backers,
  rewards,
  amount,
  description,
  location,
  goalRequirement,
  slug,
  goalCompleted,
  method,
  user,
  type
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
  body({ name, descriptionShort, descriptionLong:[Object],descriptionHeading, pledgedAmount, images, time,goalRequirement,slug, location:[Object], backers:[Object], rewards:[Object] }),
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
router.put('/:id', body({ name, descriptionShort, descriptionLong,descriptionHeading, pledgedAmount, images,time, location:[Object],slug,goalCompleted, goalRequirement,rewards:[Object] }), update)
/*
* @api {put} /events/:id/backer add backers event
* @apiName addBacker
* @apiGroup Event
*/
router.put('/:id/backer', body({ amount }), addBacker)
/*
* @api {put} /events/:id/reward add backers event
* @apiName addReward
* @apiGroup Event
*/
// router.put('/:id/backer/admin', body({ backers:[Object] }), addBackerAdmin)
router.put('/admin/backer/:id', body({ user,amount,method }), addBackerAdmin)

router.put('/:id/reward', body({ amount, description }), addReward)

/*
* @api {put} /events/:id/reward/edit add backers event
* @apiName update rewards
* @apiGroup Event
*/
router.put('/:id/reward/edit', body({ amount, description }), updateReward)

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
