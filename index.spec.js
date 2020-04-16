import { COMMANDS } from "./constants";
import * as codeGen from "./helpers/code-gen";

const request = require("supertest");
const app = require("./app");
const grillPolling = require("./grill-polling");

jest.mock("./grill-polling", () => ({
  pollStatus: jest.fn(),
  sendOnce: jest.fn(),
}));

jest.spyOn(codeGen, "newCode");

describe("COMMANDS", () => {
  beforeEach(() => {
    codeGen.newCode.mockClear();
  });
  afterEach(() => {
    grillPolling.sendOnce.mockClear();
  });
  it("off returns a code and link", async (done) => {
    const res = await request(app).get("/off");
    expect(res.statusCode).toEqual(200);
    expect(res.body.code).toBeDefined();
    expect(res.body.link).toBeDefined();
    expect(codeGen.newCode).toHaveBeenCalledTimes(1);
    done();
  });
  it("off w/ correct code", async (done) => {
    const res = await request(app).get("/off");
    expect(res.statusCode).toEqual(200);
    const code = res.body.code;
    const link = res.body.link;
    expect(codeGen.newCode).toHaveBeenCalledTimes(1);
    expect(code).toBeDefined();
    const url = `/off?code=${code}`;
    const fullUrl = `http://127.0.0.1:3000/off?code=${code}`;
    expect(fullUrl).toEqual(link);
    const res2 = await request(app).get(url);
    expect(res2.statusCode).toEqual(200);
    expect(grillPolling.sendOnce).toHaveBeenCalledWith(COMMANDS.powerOff);
    expect(codeGen.newCode).toHaveBeenCalledTimes(2);
    done();
  });
  it("off w/ incorrect code", async (done) => {
    const res = await request(app).get("/off?code=x123");
    expect(res.statusCode).toEqual(403);
    expect(res.body.message).toEqual("invalid code");
    expect(codeGen.newCode).toHaveBeenCalledTimes(1);
    expect(grillPolling.sendOnce).not.toHaveBeenCalled();
    done();
  });
  // it("on", async (done) => {
  //   const res = await request(app).get("/on");
  //   expect(res.statusCode).toEqual(200);
  //   expect(grillPolling.sendOnce).toHaveBeenCalledWith(COMMANDS.powerOn);
  //   done();
  // });
});
