const TokenGenerator = require("uuid-token-generator");
const { addUser, removeUser, getUser, tokenExistence } = require("./func");

const getCode = function (email) {
  const oldData = getUser(email);
  console.log(oldData);
  let code, token;
  if (oldData) {
    if (new Date(oldData.expirateDate) > new Date()) {
      code = Number(oldData.code);
      token = oldData.token;
    } else removeUser(email);
  }
  code = code || Math.floor(Math.random() * 900000 + 100000);
  token = token || new TokenGenerator().generate();
  addUser(email, { code, token });
  return code ;
};

exports.sendCode = async function (emailAddressParse) {
  const code = getCode(emailAddressParse);
  return code
};

exports.verifyCode = function (email, code) {
  const data = getUser(email);
  let error, reason;
  if (data) {
    if (new Date(data.expirateDate) > new Date()) {
      error = Number(data.code) !== Number(code);
      reason =
        Number(data.code) !== Number(code) ? "Invalid code" : "Valid code";
      Number(data.code) === Number(code) ? removeUser(email) : "Valid code";
    } else {
      removeUser(email);
      error = true;
      reason = "Expired code";
    }
  } else {
    error = true;
    reason = "Email not found";
  }
  return {
    reason,
  };
};

exports.verifyToken = function (token) {
  const { data, email } = tokenExistence(token);
  if (data) {
    removeUser(email);
    if (new Date(data.expirateDate) > new Date())
      return {
        error: false,
        email,
        code: data.code,
      };
    return {
      error: true,
      reason:
        "This link has expired, Please re-send a verification code to Confirm your email!",
    };
  }
  return {
    error: true,
    reason: "Invalid Token!",
  };
};

exports.verifyBoth = function ({ code, token }) {
  const { data, email } = tokenExistence(token);
  if (data) {
    if (new Date(data.expirateDate) > new Date()) {
      if (data.code === code) {
        removeUser(email);
        return {
          error: false,
          email,
        };
      }
      return {
        error: true,
        reason: "This code is not Valid!",
      };
    }
    removeUser(email);
    return {
      error: true,
      reason:
        "This link has expired, Please re-send a verification code to Confirm your email!",
    };
  }
  return {
    error: true,
    reason: "Invalid Token!",
  };
};
