const { Router } = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/user");
// const userValidation = require("../middleware/validation/user");

const usernameUsedError = (username) => new Error(`Username already used \`${username}\``);
const loginError = () => new Error("Invalid username or password");

const router = Router();

router.post("/register", /*userValidation,*/ async (req, res, next) => {
  const { email, password } = req.body;

  const { emailUsed, error } = await User.findOne({ email })
    .then((user) => ({ emailUsed: user !== null }))
    .catch((error) => ({ error }));
  if (error) return next(error);
  if (emailUsed) return next(usernameUsedError(username));

  const users = await User.findOne({});
  if (!users) {
    req.body.admin = true;
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  const user = { ...req.body, password: hashedPassword };

  User.create(user)
    .then(({ _id, admin,  }) => {
      req.session.user = { _id, admin }
      res.redirect(admin ? "/admin/games" : "/games");
    })
    .catch((error) => next(error));
});

router.get("/", (req, res) => {
  const user = req.session.user;
  res.json(user);
})

router.post("/login", /*userValidation,*/ async (req, res, next) => {
  const { email, password } = req.body;

  const { user, error } = await User.findOne({ email })
    .then((user) => ({ user }))
    .catch((error) => ({ error }));
  if (error) return next(error);
  if (!user) return next(loginError());

  const passwordValid = bcrypt.compareSync(password, user.password);
  if (!passwordValid) return next(loginError());

  const { _id, admin } = user;
  req.session.user = { _id, admin };
  res.redirect(admin ? "/admin/games" : "/games");
});

router.delete("/logout", async (req, res, next) => {
  req.session.destroy();
  res.json({ message: "Success" });
});

router.delete("/:_id", async (req, res, next) => {
  const { _id } = req.params;

  User.deleteOne({ _id })
    .then(({ deletedCount }) => res.json({ deletedCount }))
    .catch((error) => next(error));
});

module.exports = router;