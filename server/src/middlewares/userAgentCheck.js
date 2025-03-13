module.exports = (req, res, next) => {
  const userAgent = req.headers['user-agent'];
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

  if (!isMobile) {
    return res.status(403).send('Доступ разрешен только с мобильных устройств!');
  }
  next();
}