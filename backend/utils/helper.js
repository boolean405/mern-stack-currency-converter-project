module.exports = {
  resMsg: (res, msg = "", results = []) =>
    res.status(200).json({ con: true, msg, results }),
  timer: async (second) => {
    await new Promise((resolve) => setTimeout(resolve, second * 1000));
  },
};
