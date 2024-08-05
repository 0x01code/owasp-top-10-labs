const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const { Sequelize, QueryTypes, DataTypes } = require('sequelize')
const bcrypt = require('bcrypt');
const saltRounds = 10;

require('dotenv').config()

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASS, {
    host: process.env.DATABASE_HOST,
    dialect: 'mysql'
});

const User = sequelize.define(
    'users',
    {
        firstname: {
            type: DataTypes.STRING,
        },
        lastname: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.STRING,
        },
    },
    {
        timestamps: false
    },
);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(cors())

function auth(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).json({ message: 'No credentials sent!' });
    }

    const token = req.headers.authorization.replace('Bearer ', '')
    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
        if (err != null) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await sequelize.query('SELECT id FROM `users` WHERE id=$id', {
            bind: {
                id: decoded.id
            },
            type: QueryTypes.SELECT,
        })

        if (user.length > 0) {
            req.user = user[0];
            next()
        } else {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    });
}

app.post('/auth/login', async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                email: req.body.email
            }
        })

        if (user != null) {
            const match = await bcrypt.compare(req.body.password, user.password);
            if (!match) {
                return res.status(400).json({
                    'message': 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
                })
            }

            const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: 60 * 60 });

            return res.json({
                'access_token': token
            })
        } else {
            return res.status(400).json({
                'message': 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
            })
        }
    } catch (error) {
        return res.status(500).json({
            'message': error
        })
    }
})

app.post('/auth/register', async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                email: req.body.email
            }
        })

        if (user != null) {
            return res.status(400).json({
                'message': 'อีเมลนี้ถูกใช้งานแล้ว'
            })
        }

        if (req.body.password !== req.body.password_confirm) {
            return res.json({
                'message': 'รหัสผ่านไม่ตรงกัน'
            })
        }

        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(req.body.password, salt);

        await User.create({
            email: req.body.email,
            password: hash,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
        })

        return res.json({
            'message': 'สมัครมาชิกสำเร็จ'
        })
    } catch (error) {
        return res.status(500).json({
            'message': error
        })
    }
})

app.get('/profile/:id', [auth], async (req, res) => {
    try {
        const id = req.params.id;

        // if (id != req.user.id) {
        //     return res.status(403).json({ message: 'Access Denied' });
        // }

        const user = await User.findOne({
            where: {
                id: id
            }
        })

        if (user != null) {
            return res.json(user)
        } else {
            return res.status(404).json({
                'message': 'ไม่พบข้อมูล'
            })
        }
    } catch (error) {
        return res.status(500).json({
            'message': error
        })
    }
})

app.post('/check', [auth], async (req, res) => {
    try {
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;

        const check = await User.findAll({
            where: sequelize.or(
                sequelize.literal(`soundex('firstname') = soundex(:firstname)`),
                { lastname: lastname },
            ),
            replacements: { firstname },
        })

        // console.log(check);

        return res.status(200).json(check)
    } catch (error) {
        return res.status(200).json({
            'message': error
        })
    }
})

app.listen(3000)