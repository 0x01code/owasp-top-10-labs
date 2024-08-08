const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const { Sequelize, QueryTypes } = require('sequelize')
const bcrypt = require('bcrypt');
const saltRounds = 10;

require('dotenv').config()

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASS, {
    host: process.env.DATABASE_HOST,
    dialect: 'mariadb'
});

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
            req.user = user[0]
            next()
        } else {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    });
}

app.post('/auth/login', async (req, res) => {
    try {
        const user = await sequelize.query('SELECT id,password FROM `users` WHERE email=$email', {
            bind: {
                email: req.body.email
            },
            type: QueryTypes.SELECT,
        })

        if (user.length > 0) {
            const match = await bcrypt.compare(req.body.password, user[0].password);

            if (!match) {
                return res.status(400).json({
                    'message': 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
                })
            }

            const token = jwt.sign({ id: user[0].id }, process.env.SECRET_KEY, { expiresIn: 60 * 60 });

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

app.post('/auth/pin', [auth], async (req, res) => {
    try {
        const user = await sequelize.query('SELECT id,pin FROM `users` WHERE id=$id and pin=$pin', {
            bind: {
                id: req.user.id,
                pin: req.body.pin,
            },
            type: QueryTypes.SELECT,
        })

        if (user.length > 0) {
            return res.json({
                'message': 'success'
            })
        } else {
            return res.status(400).json({
                'message': 'PIN ไม่ถูกต้อง'
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
        const users = await sequelize.query('SELECT id FROM `users` WHERE email=$email', {
            bind: {
                email: req.body.email
            },
            type: QueryTypes.SELECT,
        })

        if (users.length > 0) {
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

        await sequelize.query('INSERT INTO `users` (email,password,name,pin) VALUES ($email,$password,$name,$pin)', {
            bind: {
                email: req.body.email,
                password: hash,
                name: req.body.name,
                pin: req.body.pin,
            },
            type: QueryTypes.INSERT,
            logging: true
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

        const user = await sequelize.query('SELECT id,email,name FROM `users` WHERE id=$id', {
            bind: {
                id: id
            },
            type: QueryTypes.SELECT
        })

        if (user.length > 0) {
            return res.json({
                'id': user[0].id,
                'email': user[0].email,
                'name': user[0].name,
            })
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

app.listen(3000)