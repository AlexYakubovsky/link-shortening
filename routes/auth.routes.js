const {Router} = require('express')
const bcrypt = require('bcrypt')
const {check, validationResult} = require('express-validator')
const config = require('config')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const router = Router()

const registerValidators = [
    check('email', 'Некорректный email').isEmail(),
    check('password', 'Минимальная длинна пароля 6 символов').isLength({min: 6})
]

const loginValidators = [
    check('email', 'Введите корректный email').normalizeEmail().isEmail(),
    check('password', 'Введите пароль').exists()
]

// /api/auth/register
router.post('/register', registerValidators, async (req, res) => {
    try {
        console.log(req.body)
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некорректные данные при регистрации'
            })
        }

        const {email, password} = req.body
        const candidate = await User.findOne({email})

        if (candidate) {
            return res.status(400).json({message: 'Такой пользователь существует'})
        }

        const hashedPassword = await bcrypt.hash(password, 12)
        const user = new User({email, password: hashedPassword})

        await user.save()

        res.status(201).json({message: 'Пользователь создан'})
    } catch (e) {
        res.status(500).json({message: `Ошибка! ${e.status}\n${e.message}`})
    }
})

// /api/auth/login
router.post('/login', loginValidators, async (req, res) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некорректные данные при входе в систему'
            })
        }

        const {email, password} = req.body
        const user = await User.findOne({email})

        if (!user) {
            return res.status(400).json({message: 'Пользователь не найден'})
        }

        const isMatchPassword = await bcrypt.compare(password, user.password)

        if (!isMatchPassword) {
            return res.status(400).json({message: 'Неверный пароль, попробуйте еще раз'})
        }

        const token = jwt.sign(
            {userId: user.id},
            config.get('jwtSecret'),
            {expiresIn: '1h'}
        )

        res.json({token, userId: user.id})
    } catch (e) {
        res.status(500).json({message: `Ошибка! ${e.status}\n${e.message}`})
    }
})

module.exports = router