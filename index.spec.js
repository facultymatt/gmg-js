import { COMMANDS } from "./constants";

const request = require("supertest");
const app = require("./app");
const grillPolling = require('./grill-polling');

jest.mock("./grill-polling", () => ({
  pollStatus: jest.fn(),
  sendOnce: jest.fn(),
}));

describe("COMMANDS", () => {
  it("off", async (done) => {
    const res = await request(app).get("/off");
    expect(res.statusCode).toEqual(200);
    expect(grillPolling.sendOnce).toHaveBeenCalledWith(COMMANDS.powerOff);
    done();
  });
  it("on", async (done) => {
    const res = await request(app).get("/on");
    expect(res.statusCode).toEqual(200);
    expect(grillPolling.sendOnce).toHaveBeenCalledWith(COMMANDS.powerOn);
    done();
  });
});
