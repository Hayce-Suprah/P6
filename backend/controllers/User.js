const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const MaskData = require('maskdata');
const Joi = require('joi');
const password = require('../middleware/password');


const maskEmailOptions = {
  maskWith: "X", 
  unmaskedStartCharactersBeforeAt: 0,
  unmaskedEndCharactersAfterAt: 5,
  maskAtTheRate: false
};


// const schema = Joi.object({
//   password: Joi.string().pattern(/^[a-zA-Z0-9]{3,20}$/),
//   repeat_password: Joi.ref("password"),
//   email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net", 'fr'] } } )
// }).with('username', 'birth_year').xor('password', 'access_token').with('password', 'repeat_password')

// schema.validate({ email: req.body.email, password: password });

// schema.validate({});

// try {
//     const value = await schema.validateAsync({ email: req.body.email, password: password});
// }
// catch (err) { }


exports.signup = (req, res, next) => {
  const maskedEmail = MaskData.maskEmail2(req.body.email, maskEmailOptions);
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: maskedEmail,
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};


exports.login = (req, res, next) => {
    User.findOne({ email: MaskData.maskEmail2(req.body.email, maskEmailOptions) })
        .then(user => {
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        console.log(user);
        bcrypt.compare(req.body.password, user.password)
            .then(valid => {
            if (!valid) {
                return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    { userId: user._id },
                    'RANDOM_TOKEN_SECRET',
                    { expiresIn: '24h' }
                  )
            });
            })
            .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
    };
// exports.login = (req, res, next) => {
// const emailhash = bcrypt.hashSync(req.body.email, 10)
// const userfind = null;
// User.find()
//   .then(users => {
//     for (const user of users) {
//       console.log(user.email)
//       const isValid = bcrypt.compareSync(emailhash, user.email)
//       console.log(isValid)
//       if(isValid){
//         userfind = user
//       }
//     }
//     if(userfind !== null){
//       bcrypt.compare(req.body.password, userfind.password)
//         .then(valid => {
//         if (!valid) {
//             return res.status(401).json({ error: 'Mot de passe incorrect !' });
//         }
//         res.status(200).json({
//             userId: userfind._id,
//             token: jwt.sign(
//                 { userId: userfind._id },
//                 'RANDOM_TOKEN_SECRET',
//                 { expiresIn: '24h' }
//               )
//         });
//         })
//         .catch(error => res.status(500).json({ error }));
//     }
//   })
// .catch(error => res.status(500).json({ error }));
// };