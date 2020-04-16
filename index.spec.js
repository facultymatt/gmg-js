import { COMMANDS } from "./constants";

const request = require("supertest");
const app = require("./app");
const grillPolling = require('./grill-polling');

jest.mock("./grill-polling", () => ({
  pollStatus: jest.fn(),
  sendOnce: jest.fn(),
}));

describe("COMMANDS", () => {
  afterEach(() => {
    grillPolling.sendOnce.mockClear();
  });
  it.only("off", async (done) => {
    const res = await request(app).get("/off");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      code: '1234'
    });
    // expect(grillPolling.sendOnce).toHaveBeenCalledWith(COMMANDS.powerOff);
    done();
  });
  it.only("off w/ correct code", async (done) => {
    const res = await request(app).get("/off?code=1234");
    expect(res.statusCode).toEqual(200);
    expect(grillPolling.sendOnce).toHaveBeenCalledWith(COMMANDS.powerOff);
    done();
  });
  it.only("off w/ incorrect code", async (done) => {
    const res = await request(app).get("/off?code=x123");
    expect(res.statusCode).toEqual(403);
    expect(grillPolling.sendOnce).not.toHaveBeenCalled();
    done();
  });
  it("on", async (done) => {
    const res = await request(app).get("/on");
    expect(res.statusCode).toEqual(200);
    expect(grillPolling.sendOnce).toHaveBeenCalledWith(COMMANDS.powerOn);
    done();
  });
});
