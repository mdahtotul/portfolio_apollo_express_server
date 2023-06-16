const otpGenerator = require("otp-generator");
const geoip = require("geoip-lite");

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

// const ipAddress = "103.127.3.43";

const getLocationByIP = async (ipAddress, access_key) => {
  const url = `http://api.ipapi.com/${ipAddress}?access_key=${access_key}`;
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

// getLocationUsingIP(ipAddress, "f0bfbc73db06de8d711185da05d9842d").then(
//   (data) => {
//     console.log("local data", data);
//   }
// );

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
  getLocationByIP,
};
