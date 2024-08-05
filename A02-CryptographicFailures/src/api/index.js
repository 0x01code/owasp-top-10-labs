const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const md5 = require('md5')
const { Sequelize, QueryTypes } = require('sequelize')

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

        const user = await sequelize.query(`SELECT id FROM users WHERE id=${decoded.id}`, {
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
        const email = req.body.email;
        const password = md5(req.body.password);

        const user = await sequelize.query(`SELECT id,password FROM users WHERE email='${email}' AND password='${password}'`, {
            type: QueryTypes.SELECT
        })

        if (user.length > 0) {
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

app.post('/auth/register', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const password_confirm = req.body.password_confirm;
        const name = req.body.name;

        const users = await sequelize.query(`SELECT id FROM users WHERE email='${email}'`, {
            type: QueryTypes.SELECT,
        })

        if (users.length > 0) {
            return res.status(400).json({
                'message': 'อีเมลนี้ถูกใช้งานแล้ว'
            })
        }

        if (password !== password_confirm) {
            return res.json({
                'message': 'รหัสผ่านไม่ตรงกัน'
            })
        }

        await sequelize.query(`INSERT INTO users (email,password,name) VALUES ('${email}','${password}','${name}')`, {
            type: QueryTypes.INSERT,
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

        const user = await sequelize.query(`SELECT id,email,name FROM users WHERE id=${id}`, {
            type: QueryTypes.SELECT,
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