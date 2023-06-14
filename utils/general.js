const otpGenerator = require("otp-generator");

const otpGeneratorFunc = () => {
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false, // no capital letters
    specialChars: false, // no special characters lik #*!&
    lowerCaseAlphabets: false, // no alphabets
  });
  return otp; // only 6 digit numbers
};

const validateEmail = (input) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return re.test(String(input).toLowerCase());
};

const loginStrategies = {
  local: "LOCAL",
  ggl: "GOOGLE",
  fb: "FACEBOOK",
  git: "GITHUB",
};

const getIPAddress = (req) => {
  return (ip =
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    req.connection.remoteAddress);
};

module.exports = {
  otpGeneratorFunc,
  validateEmail,
  loginStrategies,
  getIPAddress,
};
