const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleLogin = async (req, res) => {
    try {
        const cookies = req.cookies;
        if (cookies?.refreshToken) {
            return res.status(400).json({ error: 'You are already logged in.' });
        }

        const {email, password, isRememberMe} = req.body;

        if (!email || !password) return res.status(400).send({error: 'Email and password are required.'})

        const foundUser = await User.findOne({
            email: email, isActive: true,
        }).exec();
        if (!foundUser) {
            return res.status(401).json({error: 'User not found'}); //Unauthorized
        }


        const isVerify = await bcrypt.compare(password, foundUser.password);

        if (!isVerify) {
            return res.status(401).json({error: 'Incorrect password'});
        } else {
            const accessToken = jwt.sign({id: foundUser._id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'});

            let refreshToken = jwt.sign({id: foundUser._id, rememberMe: isRememberMe}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '15d'});

            // Saving refreshToken with current user
            foundUser.refreshToken.push(refreshToken);
            const result = await foundUser.save();

            const refreshTokenExpiry = 30 * 24 * 60 * 60 * 1000;

            // Creates Secure Cookie with refresh token
            if(!isRememberMe){
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true, secure: true, sameSite: 'None'
                });
            }
            else{
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true, secure: true, sameSite: 'None', maxAge: refreshTokenExpiry
                });
            }

            // Send authorization roles and access token to user
            res.json({accessToken});
        }
    } catch (e) {
        res.status(500).json({status: 500, message: e.message});
    }

}

const handleRegister = async (req, res) => {
    try {
        const data = req.body;
        if (!data?.email || !data?.password || !data?.fullName) return res.status(400).json({'message': 'Username and password are required.'});

        // Check unique
        const duplicate = await User.findOne({email: data.email})
        if (duplicate) {
            return res.status(401).json({error: 'Email is already registered'});
        }

        // Hash pass
        data.password = await bcrypt.hash(data.password, Number(process.env.BCRYPTSALT));

        const newUser = new User(data)
        await newUser.save();

        res.status(201).json({'success': `New user ${data.fullName} created!`});
    } catch (e) {
        res.status(500).json({status: 500, message: e.message});
    }
}

// POST auth/logout
const handleLogout = async (req, res) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.refreshToken) return res.sendStatus(204)
        const refreshToken = cookies.refreshToken;

        // Is refreshToken in db?
        const foundUser = await User.findOne({refreshToken}).exec();
        if (!foundUser) {
            res.clearCookie('refreshToken', {httpOnly: true, sameSite: 'None', secure: true});
            return res.sendStatus(204);
        }

        // Delete in db
        foundUser.refreshToken = foundUser.refreshToken.filter(rt => rt !== refreshToken);
        const result = await foundUser.save();

        res.clearCookie('refreshToken', {httpOnly: true, sameSite: 'None', secure: true});
        res.sendStatus(204);

    } catch (e) {
        res.status(500).json({status: 500, message: e.message});
    }
}

const handleRefresh = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) return res.sendStatus(401);

    const refreshToken = cookies.refreshToken;
    res.clearCookie('refreshToken', {httpOnly: true, sameSite: 'None', secure: true});

    try{
        const foundUser = await User.findOne({refreshToken: refreshToken}).select('-password').exec();

        if (!foundUser) {
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decode) => {
                if (err) {
                    return res.sendStatus(403)
                }

                await User.updateOne({_id: decode.id}, {refreshToken: []}).exec();
                return res.sendStatus(403);
            })
        }
        else{
            const newRefreshTokenArray = foundUser?.refreshToken.filter(rt => rt !== refreshToken);

            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decode) => {
                if (err) {
                    await User.findOneAndUpdate(
                        { _id: foundUser._id },
                        { refreshToken: newRefreshTokenArray }
                    ).exec();
                    return res.sendStatus(403);
                }

                const accessToken = jwt.sign({id: foundUser._id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'});
                const newRefreshToken = jwt.sign({id: foundUser._id, rememberMe: decode.rememberMe}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '30d'})

                const refreshTokenArray = [...newRefreshTokenArray, newRefreshToken];
                await User.updateOne(
                    { _id: foundUser._id },
                    { refreshToken: refreshTokenArray }
                ).exec();

                const refreshTokenExpiry = 30 * 24 * 60 * 60 * 1000;

                // Creates Secure Cookie with refresh token
                if(!decode.rememberMe){
                    res.cookie('refreshToken', newRefreshToken, {
                        httpOnly: true, secure: true, sameSite: 'None'
                    });
                }
                else{
                    res.cookie('refreshToken', newRefreshToken, {
                        httpOnly: true, secure: true, sameSite: 'None', maxAge: refreshTokenExpiry
                    });
                }

                res.json({accessToken})
            })
        }
    }
    catch (e){
        console.error('Lỗi xử lý refresh token:', e);
        res.sendStatus(500); // Lỗi máy chủ nội bộ
    }
}

module.exports = {handleLogin, handleRegister, handleLogout, handleRefresh}