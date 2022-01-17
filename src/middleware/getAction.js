const getAction = async (req, res, next) => {
  if (req.method === "GET") return next();

  const { action, ...body } = req.body;

  if (action) req.action = action;
  req.body = body;
  return next();
};

module.exports = getAction;