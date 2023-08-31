const express = require('express');
const nodemailer = require("nodemailer");

const router = express.Router()

const UserSchema = require('../model/user')
const BlogSchema = require('../model/blog')

// Note: Function to send email to user...!
const sendEmail = (email, password, purpose) => {
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);

    try {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SENDER_EMAIL,
                pass: process.env.SENDER_PASSWORD
            }
        });

        let receiverDetails = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Account Credentials",
            text: (purpose == "user-creation") ? (`Your account has been set up, and here is your credentials: Email: ${email}, Password; ${password}`) : (`You password has been reset and below is your password: ${password}`)
        };

        transporter
            .sendMail(
                receiverDetails,
                (err) => {
                    if (!err) {
                        console.log(`Email send successfully!`);
                        return;
                    };
                }
            );
    }

    catch (error) {
        console.log(`Something went wrong while sending email: ${error}`);
    };
};

// Note: API route to create user...!
router.post('/user/signup', async (req, res) => {
    const { email } = req.body;

    try {
        // 400:
        let formData = Object.values(req.body);
        let validator = formData.includes("");

        if (validator) {
            return res.status(400).send({
                status: false,
                message: "Email and role fields are required!"
            });
        };

        // 401:
        let isUserExist = await UserSchema.findOne({ email });

        if (isUserExist) {
            return res.status(404).send({
                status: false,
                message: `Account already exist on this email: ${email}`
            });
        };

        // 200:

        // Note: generating a random password...!
        let generatedPassword = Math.random().toString(36).slice(2);

        // Note: Encoding the password...!
        let securePassword = btoa(generatedPassword);

        // Note: Saving user in database...!
        const newUser = new UserSchema({
            email: email,
            password: securePassword,
            role: req.body.role,
            createdAt: new Date().getTime()
        });

        const saveUser = await newUser.save();

        if (saveUser) {
            sendEmail(email, generatedPassword, "user-creation");

            return res.status(200).send({
                status: true,
                message: `User created successfully. Credentials have been sent to ${email}`,
                data: newUser
            });
        };
    }

    catch (error) {
        // 500:
        console.log(`Somthing went wrong while creating user: ${error}`);

        return res.status(500).send({
            status: false,
            message: "Somthing went wrong while creating user!"
        });
    };
});

// Note: API route to create user...!
router.post("/user/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // 400:
        let formData = Object.values(req.body);
        let validator = formData.includes("");

        if (validator) {
            return res.status(400).send({
                status: false,
                message: "Email and password fields are required!"
            });
        };

        // 404:
        let isAccountExist = await UserSchema.findOne({ email });

        if (!isAccountExist) {
            return res.status(404).send({
                status: false,
                message: `No account exist on thsi email: ${email}`
            });
        };

        // 405:
        let decodePassword = atob(isAccountExist.password);

        if (password != decodePassword) {
            return res.status(405).send({
                status: false,
                message: "Password did not match!"
            });
        };

        // 200:
        return res.status(200).send({
            status: true,
            message: "You have logged in successfully!",
            data: isAccountExist
        });
    }

    catch (error) {
        // 500:
        console.log(`Something went wrong while login user: ${error}`);

        return res.status(500).send({
            status: false,
            message: "Something went wrong while login user!"
        });
    };
});

// Note: API route to forget password...!
router.post("/update/password", async (req, res) => {
    let { email } = req.body;
    console.log(`Email: ${email}`);

    try {
        // 400:
        let isUserExist = await UserSchema.findOne({ email });
        console.log(`User: ${isUserExist}`);

        if (!isUserExist) {
            return res.status(400).send({
                status: false,
                message: `No account exist on this email: ${email}`
            });
        };

        // 200:

        // Note: generating a random password...!
        let generatedPassword = Math.random().toString(36).slice(2);

        // Note: Encoding the password...!
        let securePassword = btoa(generatedPassword);

        // Note: Updaing user's password...!
        let updatePassword = await UserSchema
            .findByIdAndUpdate(
                isUserExist._id,
                { password: securePassword },
                { new: true }
            );

        if (updatePassword) {
            sendEmail(email, generatedPassword, "update-password");

            return res.status(200).send({
                status: true,
                message: `Your password has been updated and sent to ${email}`
            });
        };
    }

    catch (error) {
        // 500:
        console.log(`Something went wrong while updating password: ${error}`);

        return res.status(500).send({
            status: false,
            message: "Something went wrong while updating password!"
        });
    };
});

router.post('/blogPost', async (req, res) => {
    const { mainImage, mainHeading, mainContent, subSection, mainImageAltText, imgSection, imgAlignment } = req.body

    try {
        if (!mainImage || !mainHeading || !mainContent) {
            res.status(400).send({
                status: "error",
                message: "Please enter complete information"
            })
            return
        }

        let result = await BlogSchema.create({
            mainImage,
            mainHeading,
            mainContent,
            subSection,
            mainImageAltText,
            imgSection,
            imgAlignment,
            blogCreatedAt: new Date().getTime()
        })
        res.status(200).send({
            status: "success",
            message: "Form Has Been Submitted",
            data: result
        })
        return
    } catch (error) {
        res.status(404).send({
            status: "error",
            message: error.message
        })
    }

})

router.get('/blogList', async (req, res) => {


    try {
        const blogList = await BlogSchema.find()
        res.status(200).send({
            status: "ok",
            data: blogList
        })
    } catch (error) {
        res.status(400).send({
            status: "error",
            data: error.message
        })
    }
})


router.get("/viewBlog", async (req, res) => {
    const { email } = req.body

    let user = await BlogSchema.findById({ _id: req.body.id })
    try {
        res.status(200).send({
            status: 'ok',
            message: user
        })
    } catch (error) {
        res.status(400).send({
            status: 'errr',
            message: error
        })
    }
})

// Note: API route to delete all blogs...!
router.delete("/delete/all", async (req, res) => {

    try {
        let removeAll = await BlogSchema.deleteMany();
        if (removeAll) {
            return res.status(200).send({
                status: true,
                message: "All blogs deleted successfully"
            });
        };
    }

    catch (error) {
        console.log(`Something went wrong while deleting all blogs: ${error}`);

        return res.status(500).send({
            status: false,
            message: "Something went wrong while deleting all blogs!"
        });
    };
});

// Note: API route to delete blog by id...!
router.delete("/blog/delete/:id", async (req, res) => {
    let { id } = req.params;
    console.log(`Blog Id ${id}`);

    try {
        let deleteBlog = await BlogSchema.deleteOne({ _id: id });

        if (deleteBlog) {
            return res.status(200).send({
                status: true,
                message: "Blog deleted successfully!"
            });
        };
    }

    catch (error) {
        console.log(`Something went wrong while deleting blog: ${error}`);

        return res.status(500).send({
            status: false,
            message: "Something went wrong while deleting blog"
        });
    };
});

module.exports = router;