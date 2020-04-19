import { socket, latestStatus } from "./grill-polling";
import GrillStatus from "./GrillStatus";
import * as store from "./datastore-pouch";

jest.spyOn(store, 'add');
jest.spyOn(store, 'addEvent');

jest.mock("./GrillStatus", () => {
  return jest.fn(() => ({
    state: 'on',
  }));
});

describe.only("grill polling", () => {
  it("calls store.add on message emit", async (done) => {
    socket.emit("message", 'cats');
    expect(GrillStatus).toHaveBeenCalled();
    latestStatus().state = 'beans';
    expect(latestStatus().state).toEqual('beans');
    expect(latestStatus().timestamp).toBeDefined();
    expect(store.add).toHaveBeenCalledWith(latestStatus());
    done();
  });
  it("calls store.addEvent when on/off changes", async (done) => {
    latestStatus().state = 'off';
    expect(latestStatus().state).toEqual('off');
    latestStatus().state = 'on';
    expect(latestStatus().state).toEqual('on');
    expect(store.addEvent).toHaveBeenCalled();
    done();
  });
});
