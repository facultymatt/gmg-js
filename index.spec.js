import { COMMANDS, HEX_COMMANDS } from "./constants";
import * as codeGen from "./helpers/code-gen";
import url from "url";

const request = require("supertest");
const app = require("./app");
const grillPolling = require("./grill-polling");

jest.mock("./grill-polling", () => ({
  pollStatus: jest.fn(),
  sendOnce: jest.fn(),
  latestStatus: jest.fn(() => ({
    settings: "xxxxxxxxxxxx",
  })),
}));

jest.spyOn(codeGen, "newCode");

describe("COMMANDS", () => {
  beforeEach(() => {
    codeGen.newCode.mockClear();
  });
  afterEach(() => {
    grillPolling.sendOnce.mockClear();
  });
  describe("Command API", () => {
    describe("Power commands", () => {
      it("visit w/ no code returns link", async (done) => {
        const res = await request(app).get("/off");
        expect(res.statusCode).toEqual(200);
        expect(res.body.code).toBeDefined();
        expect(res.body.link).toBeDefined();
        expect(codeGen.newCode).toHaveBeenCalledTimes(1);
        done();
      });
      it("visit w/ correct code", async (done) => {
        const res = await request(app).get("/off");
        expect(res.statusCode).toEqual(200);
        const code = res.body.code;
        const link = res.body.link;
        expect(codeGen.newCode).toHaveBeenCalledTimes(1);
        expect(code).toBeDefined();
        const expectedLink = url.format({
          protocol: res.request.protocol,
          host: res.request.host,
          pathname: res.req.path,
          query: {
            code,
          },
        });
        expect(expectedLink).toEqual(link);
        const res2 = await request(app).get(`/off?code=${code}`);
        expect(res2.statusCode).toEqual(200);
        expect(grillPolling.sendOnce).toHaveBeenCalledWith(COMMANDS.powerOff, undefined);
        expect(codeGen.newCode).toHaveBeenCalledTimes(2);
        done();
      });
      it("visit w/ incorrect code", async (done) => {
        const res = await request(app).get("/off?code=x123");
        expect(res.statusCode).toEqual(403);
        expect(res.body.message).toEqual("invalid code");
        expect(codeGen.newCode).toHaveBeenCalledTimes(1);
        expect(grillPolling.sendOnce).not.toHaveBeenCalled();
        done();
      });
      describe("quick check for each", () => {
        it("on", async (done) => {
          const res = await request(app).get("/on");
          expect(res.body.link).toBeDefined();
          done();
        });
        it("on", async (done) => {
          const res = await request(app).get("/on");
          expect(res.body.link).toBeDefined();
          done();
        });
        it("coldSmoke", async (done) => {
          const res = await request(app).get("/coldSmoke");
          expect(res.body.link).toBeDefined();
          done();
        });
      });
    });
    describe("Temp commands", () => {
      // @todo test other temps
      // @todo handle out of range temps
      it("grill temp 150", async (done) => {
        const res = await request(app).get("/grill?temp=150");
        expect(res.statusCode).toEqual(200);
        const code = res.body.code;
        const link = res.body.link;
        expect(codeGen.newCode).toHaveBeenCalledTimes(1);
        expect(code).toBeDefined();
        const expectedLink = url.format({
          protocol: res.request.protocol,
          host: res.request.host,
          pathname: "/grill", // @todo fix res.req.path
          query: {
            temp: 150,
            code,
          },
        });
        expect(link).toEqual(expectedLink);
        const res2 = await request(app).get(`/grill?temp=150&code=${code}`);
        expect(res2.statusCode).toEqual(200);
        expect(res2.body.message).toEqual("Sent grill grill temp 150 command");
        expect(grillPolling.sendOnce).toHaveBeenCalledWith(
          COMMANDS.setGrillTempF(150),
          undefined
        );
        expect(codeGen.newCode).toHaveBeenCalledTimes(2);
        done();
      });
      describe("quick check for each", () => {
        // @todo detailed check for each
        it("probe1", async (done) => {
          const res = await request(app).get("/probe1");
          expect(res.body.link).toBeDefined();
          done();
        });
        it("probe2", async (done) => {
          const res = await request(app).get("/probe2");
          expect(res.body.link).toBeDefined();
          done();
        });
      });
    });
    describe("Settings commands", () => {
      it("set pizza mode", async (done) => {
        const res = await request(app).get("/pizza");
        expect(res.statusCode).toEqual(200);
        const code = res.body.code;
        const link = res.body.link;
        expect(codeGen.newCode).toHaveBeenCalledTimes(1);
        expect(code).toBeDefined();
        const expectedLink = url.format({
          protocol: res.request.protocol,
          host: res.request.host,
          pathname: "/pizza", // @todo fix res.req.path
          query: {
            code,
          },
        });
        expect(link).toEqual(expectedLink);
        const res2 = await request(app).get(`/pizza?code=${code}`);
        expect(res2.statusCode).toEqual(200);
        expect(res2.body.message).toEqual("Sent grill pizza mode command");
        expect(grillPolling.sendOnce).toHaveBeenCalledWith(
          HEX_COMMANDS.setPizzaMode(grillPolling.latestStatus().settings),
          "hex"
        );
        expect(codeGen.newCode).toHaveBeenCalledTimes(2);
        done();
      });
      describe("quick check for each", () => {
        // @todo detailed check for each
        it("pizza", async (done) => {
          const res = await request(app).get("/pizza");
          expect(res.body.link).toBeDefined();
          done();
        });
        it("regular", async (done) => {
          const res = await request(app).get("/regular");
          expect(res.body.link).toBeDefined();
          done();
        });
      });
    });
  });

  // it("on", async (done) => {
  //   const res = await request(app).get("/on");
  //   expect(res.statusCode).toEqual(200);
  //   expect(grillPolling.sendOnce).toHaveBeenCalledWith(COMMANDS.powerOn);
  //   done();
  // });
});
