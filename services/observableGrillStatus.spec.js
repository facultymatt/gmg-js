import observableGrillStatus from "./observableGrillStatus";
import eventEmitter from "./eventEmitter";
import { GRILL_EVENTS } from "../constants";

jest.spyOn(eventEmitter, "emit");

describe("grill polling", () => {
  beforeEach(() => {
    eventEmitter.emit.mockClear();
  });
  it("testing rxjs behaviorsubject", async (done) => {
    observableGrillStatus.next({
      state: "on",
    });
    expect(observableGrillStatus.value.state).toEqual("on");
    expect(eventEmitter.emit).toHaveBeenCalledWith(GRILL_EVENTS.POWER_ON);
    done();
  });
  it("testing rxjs behaviorsubject off", async (done) => {
    observableGrillStatus.next({
      state: "off",
    });
    expect(observableGrillStatus.value.state).toEqual("off");
    expect(eventEmitter.emit).toHaveBeenCalledWith(GRILL_EVENTS.POWER_OFF);
    done();
  });
});
