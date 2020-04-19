const short = require("short-uuid");

let code;

export const getCode = () => {
  return code;
};

export const codesMatch = (checkCode) => {
  return checkCode === code;
};

export const newCode = () => {
  code = short.generate();
};
