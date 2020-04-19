import { socket, latestStatus } from "./grill-polling";
import GrillStatus from "./GrillStatus";
import * as store from "./datastore-pouch";

jest.spyOn(store, 'add');

jest.mock("./GrillStatus", () => {
  return jest.fn(() => ({
    state: 'on',
  }));
});

describe.only("grill polling", () => {
  it("calls store.add on message emit", async (done) => {
    socket.emit("message", 'cats');
    expect(GrillStatus).toHaveBeenCalled();
    expect(latestStatus().state).toEqual('on');
    expect(latestStatus().timestamp).toBeDefined();
    expect(store.add).toHaveBeenCalledWith(latestStatus());
    done();
  });
  it("calls store.addEvent when on/off changes", async (done) => {
    socket.emit("message", 'cats');
    expect(latestStatus().state).toEqual('on');
    GrillStatus.mockReturnValueOnce({
      state: 'off',
    });
    socket.emit("message", 'cats');
    expect(latestStatus().state).toEqual('off');
    done();
  });
});
