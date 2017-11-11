import {
    Router
} from "express";
import Payment from "./model";
import Razorpay from "razorpay";
import {
    success,
    notFound
} from "../../services/response/";
const router = new Router();

const instance = new Razorpay({
    key_id: "rzp_test_3iHWxibF26godR",
    key_secret: "3rgH7M8xqh0u3avP6wQc3dmZ"
});

router.get("/:id/:user/:event", function(req, res) {
    const user = req.params.user;
    const event = req.params.event;
    const paymentId = req.params.id;
    instance.payments.fetch(req.params.id).then(json => {
        Payment.create({
            paymentResponse: json,
            user: user,
            event: event
        }, function(err, response) {
            if (err) {
                console.log(err);
            } else {
                res.status(200).json(response);
            }
        });
    });
});
export default router;