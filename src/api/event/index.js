import { Router } from "express";
import multer from "multer";
import { middleware as query } from "querymen";
import { middleware as body } from "bodymen";
import { token } from "../../services/passport";
import {
  create,
  index,
  show,
  update,
  destroy,
  addReward,
  addBacker,
  updateReward,
  addBackerAdmin,
  updatePhoto
} from "./controller";
import { schema } from "./model";
export Event, { schema   } from "./model";
const { check, validationResult } = require("express-validator/check");
const { matchedData, sanitize } = require("express-validator/filter");
const router = new Router();
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
} = schema.tree;

const upload = multer({
  limits: {
    fileSize: 10 * Math.pow(1024, 2) // 20MB
  }
});
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
  "/",
  token({ required: true, roles: ["admin"] }),
  body({
    name,
    descriptionShort,
    descriptionLong: [Object],
    descriptionHeading,
    pledgedAmount,
    images,
    time,
    goalRequirement,
    slug,
    location: [Object],
    backers: [Object],
    rewards: [Object]
  }),
  [
    check("name")
      .isLength({ min: 2, max: 150 })
      .withMessage("Name Must Be Atleast 2 Characters"),
    check("descriptionHeading")
      .isLength({ min: 2, max: 150 })
      .withMessage("Must Be Valid Heading"),
    check("descriptionShort")
      .isLength({ min: 2, max: 150 })
      .withMessage("Must Be Valid Description"),
    check("descriptionLong")
      .exists()
      .withMessage("Please Enter A Valid Description Detail"),
    check("pledgedAmount")
      .isLength({ min: 2 })
      .matches(/\d/)
      .withMessage("Please Enter A Valid Pledged Amount"),
    check("time")
      .isAfter()
      .withMessage("Please Enter A Valid Date"),
    check("location.place")
      .isLength({ min: 2, max: 100 })
      .withMessage("Place Name Is Not Valid"),
    check("location.address")
      .isLength({ min: 2, max: 100 })
      .withMessage("Address Is Not Valid"),
    check("location.lat")
      .matches(/^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/)
      .withMessage("Enter Valid Latitude-longitude"),
    check("location.long")
      .matches(/^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/)
      .withMessage("Enter Valid Latitude-longitude"),
    check("goalRequirement")
      .isLength({ min: 5, max: 100 })
      .withMessage("Goal Requirement Must Be Atleast 5 Characters"),
    check("rewards.*.description")
      .isLength({ min: 5, max: 100 })
      .withMessage("Reward Description Must Be Atleast 5 Characters"),
    check("rewards.*.amount")
      .isLength({ min: 1 })
      .matches(/\d/)
      .withMessage("Enter A Valid Reward Amount")
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    console.log(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
      console.log(req);
      console.log(errors);
    }
    next();
  },
  create
);
/**
 * @api {get} /events Retrieve events
 * @apiName RetrieveEvents
 * @apiGroup Event
 * @apiUse listParams
 * @apiSuccess {Object[]} events List of events.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get("/", query(), index);

/**
 * @api {get} /events/:id Retrieve event
 * @apiName RetrieveEvent
 * @apiGroup Event
 * @apiSuccess {Object} event Event's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Event not found.
 */
router.get("/:id", show);

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
router.put(
  "/:id",
  body({
    name,
    descriptionShort,
    descriptionLong,
    descriptionHeading,
    pledgedAmount,
    images,
    time,
    location: [Object],
    slug,
    goalCompleted,
    goalRequirement,
    rewards: [Object]
  }),
  [
    check("name")
      .isLength({ min: 2, max: 150 })
      .withMessage("Must Be Valid Name"),
    check("descriptionHeading")
      .isLength({ min: 2, max: 150 })
      .withMessage("Must Be Valid Heading"),
    check("descriptionShort")
      .isLength({ min: 2, max: 150 })
      .withMessage("Must Be Valid Description"),
    check("descriptionLong")
      .exists()
      .withMessage("Please Enter A Valid Description Detail"),
    check("pledgedAmount")
      .isLength({ min: 2 })
      .matches(/\d/)
      .withMessage("Please Enter A Valid Pledged Amount"),
    check("time")
      .isAfter()
      .withMessage("Please Enter A Valid Date")
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    console.log(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
      console.log(req);
      console.log(errors);
    }
    next();
  },
  update
);
/*
* @api {put} /events/:id/backer add backers event
* @apiName addBacker
* @apiGroup Event
*/
router.put("/:id/backer", body({ amount, user }), addBacker);
/*
* @api {put} /events/:id/reward add backers event
* @apiName addReward
* @apiGroup Event
*/
// router.put('/:id/backer/admin', body({ backers:[Object] }), addBackerAdmin)
router.put("/admin/backer/:id", body({ user, amount, method }), addBackerAdmin);

router.put("/:id/reward", body({ amount, description }), addReward);

/*
* @api {put} /events/:id/reward/edit add backers event
* @apiName update rewards
* @apiGroup Event
*/
router.put("/:id/reward/edit", body({ amount, description }), updateReward);

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
router.delete("/:id", token({ required: true, roles: ["admin"] }), destroy);

/**
 * image upload
 */
router.put(
  "/:id/image",
  //token({ required: true }),
  upload.single("data"),
  updatePhoto
);

export default router;
