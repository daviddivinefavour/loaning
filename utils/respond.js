const respond = (status) => (message) => (res) => (data) => {
  return   res
    .status(status)
    .send(message ? { status, message, data } : { status, ...data });
}

module.exports = {respond}