const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Joi = require("joi");
const password = require("../middleware/password");

const shemaUser = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net", "fr"] },
  }),
  password: Joi.string().pattern(/^[a-zA-Z0-9]{3,20}$/),
});

exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.email, 10)
    .then((hashemail) => {
      bcrypt
        .hash(req.body.password, 10)
        .then((hash) => {
          const err = shemaUser.validate({
            email: req.body.email,
            password: req.body.password,
          });
          if (err.error) throw err.error;

          const user = new User({
            email: hashemail,
            password: hash,
          });

          user
            .save()
            .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
            .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  User.find()
    .then((users) => {
      let userFinded = null;
      for (const user of users) {
        const valid = bcrypt.compareSync(req.body.email, user.email);
        if (valid) {
          userFinded = user;
        }
      }

      if (userFinded !== null) {
        bcrypt
          .compare(req.body.password, userFinded.password)
          .then((valid) => {
            if (!valid) {
              return res.status(401).json({ error: "Mot de passe incorrect" });
            }
            res.status(200).json({
              userId: userFinded._id,
              token: jwt.sign(
                { userId: userFinded._id },
                process.env.JWT_TOKEN,
                { expiresIn: "24h" }
              ),
            });
          })
          .catch((error) => res.status(500).json({ error }));
      }
    })
    .catch((error) => res.status(500).json({ error }));
};
