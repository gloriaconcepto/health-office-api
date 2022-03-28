const { validationResult } = require("express-validator");
const userDetailsModel = require("../../model/userAppModal/userRegisterModal");
const { sendSms } = require("../../utilities/sendSms");

function updateKids(userId, kidDetails, successMessage, errMessage, res) {
    userDetailsModel.findByIdAndUpdate(
        { _id: userId },
        {
            $addToSet: { kidDetails: { $each: kidDetails } },
        },
        function (err, result) {
            if (err) {
                console.log("i get error");
                return res.status(500).json({ error: errMessage });
            } else {
                console.log(result);
                res.status(201).json({
                    message: successMessage,
                });
            }
        }
    );
}

exports.addUsers = (req, res, next) => {
    const errors = validationResult(req);
    // console.log("req", errors);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const firstName = req.body.firstName;
    const telephone = req.body.telephone;
    const otherName = req.body.otherName;
    const kidNo = req.body.kidNo;
    const email = req.body.email;
    const kidDetails = req.body.kidDetails;
    const registerUser = new userDetailsModel({
        firstName: firstName,
        telephone: telephone,
        otherName: otherName,
        kidNo: kidNo,
        email: email,
        kidDetails: kidDetails,
    });

    try {
        userDetailsModel.find({ $and: [{ firstName: new RegExp(firstName, "i") }, { telephone: new RegExp(telephone, "i") }] }, function (err, result) {
            if (err) {
                console.log(err);
                next(err);
            } else {
                if (result && result.length > 0) {
                    console.log("result find just update the kiddetails");
                    //update only the kid data
                    let cloneKidsDetails = result[0].kidDetails;
                    let userId = result[0]._id.toString();
                    console.log({ userId });
                    console.log(kidDetails);

                    userDetailsModel.findByIdAndUpdate(
                        { _id: userId },
                        {
                            $addToSet: { kidDetails: { $each: kidDetails } },
                        },
                        function (err, result) {
                            if (err) {
                                return res.status(500).json({ error: "Cannot register the user at the moment please try again" });
                            } else {
                                console.log(result);
                                return res.status(201).json({
                                    message: "User register successfully,sms has been send to you!",
                                });
                            }
                        }
                    );
                    //console.log({ cloneKidsDetails });
                } else {
                    //create a new user and save..

                    registerUser
                        .save()
                        .then((data) => {
                            if (Object.entries(data).length > 0) {
                                smsWrapper(next);
                                sendSms(["+2348179081771"], "Thank you for registrating with us")
                                    .then((response) => {
                                        console.log("message don send ok o", response.SMSMessageData.Recipients);

                                        if (response && response.SMSMessageData && response.SMSMessageData.Recipients && response.SMSMessageData.Recipients[0].status === "Success") {
                                            res.status(201).json({
                                                message: "User register successfully,sms has been send to you!",
                                            });
                                        } else {
                                            res.status(500).json({
                                                message: "Sms has not been send successfully",
                                            });
                                        }
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                        next(err);
                                    });
                            }
                        })
                        .catch((err) => {
                            if (!err.statusCode) {
                                err.statusCode = 500;
                            }
                            next(err);
                        });
                }
                //next();
            }
        });
    } catch (error) {
        console.log(error);
    }
};
