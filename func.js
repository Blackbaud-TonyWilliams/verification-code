const fs = require("fs");

const path = "node_modules/email-verification-code/data.json";
// const path = "./data.json";

exports.addUser = (email, { code, token }) => {
  const data = JSON.parse(fs.readFileSync(path));
  data[email] = {
    code,
    token,
    createdDate: new Date(),
    expirateDate: new Date(new Date().getTime() + 1000 * 60 * 60),
  };
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
};

exports.removeUser = (email) => {
  const data = JSON.parse(fs.readFileSync(path));
  delete data[email];
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
};

exports.getUser = (email) => {
  const data = JSON.parse(fs.readFileSync(path));
  return data[email];
};

exports.tokenExistence = (token) => {
  const data = JSON.parse(fs.readFileSync(path));
  for (let i in data) {
    if (data[i].token === token) return { data: data[i], email: i };
  }
  return false;
};
