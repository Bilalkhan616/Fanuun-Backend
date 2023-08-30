const BlogSchema = require('../model/blog')
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const UserSchema = require('../model/user')

router.get('/check', (req, res) => {
    res.status(200).send({
        status: "ok",
        message: "Hello"
    })
})

router.post('/blogPost', async (req, res) => {
    const { mainImage, mainHeading, mainContent, subSection ,mainImageAltText,imgSection,imgAlignment} = req.body

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
            imgAlignment
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

router.post('/signup', async (req, res) => {
    const { password, email } = req.body
    if (!email || !password) {
        res.status(400).send({
            status: "error",
            message: "Please enter complete information"
        })
    }
    else {
        // let pass = await bcrypt.hash(password, 5)
        try {
            let result = await UserSchema.create({
                password,
                email,
            })
            console.log(result, 'ressss')
            res.send({
                status: "success",
                message: "User Created Successfully"
            })
        } catch (error) {
            if (error.code == 11000) {
                res.status(400).send({
                    status: "error",
                    message: "Email Already Exists"
                })
            }
            else {
                res.status(400).send({
                    status: "error",
                    message: "Something went wrong"
                })
            }
        }
    }

})

router.post("/login", async (req, res) => {
    const { email, password } = req.body
    let result = await UserSchema.findOne({ email })
    if (result == null) {
        res.status(400).send({
            status: "error",
            message: "User does not exists"
        })
    }
    else {
        if (email == result.email && password == result.password) {
            let params = {
                result
            }
            res.status(200).send({
                status: "user matched",
                data: params
            })
        }
        else {
            res.status(400).send({
                status: "error",
                message: "Email Or Password is Incorrect"
            })
        }
    }
})


router.get("/viewBlog", async (req, res) => {
    const { email} = req.body

    let user = await BlogSchema.findById({ _id : req.body.id })
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


module.exports = router