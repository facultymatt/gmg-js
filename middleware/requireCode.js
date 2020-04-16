import { newCode, codesMatch, getCode } from "../helpers/code-gen";
import url from "url";

export default function (req, res, next) {
  if (req.query.code) {
    if (codesMatch(req.query.code)) {
      newCode();
      return next();
    }
    newCode();
    return res.status(403).json({
      message: "invalid code",
    });
  }
  newCode();
  const link = url.format({
    protocol: req.protocol,
    host: req.get("host"),
    pathname: req.originalUrl,
    query: {
      code: getCode(),
    },
  });
  return res.json({
    message: "Confirm you want send command off by visiting this link now",
    link,
    code: getCode(),
  });
}
