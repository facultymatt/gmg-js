import { marbles } from "rxjs-marbles/jest";
import {
  pluck,
  map,
  concat,
  distinctUntilChanged,
  skip,
  tap,
} from "rxjs/operators";
import { probe1Changes } from "./grillStatus";
import { BehaviorSubject } from "rxjs";
// import observableGrillStatus from "../services/observableGrillStatus";

// jest.mock("../services/observableGrillStatus", () => jest.fn());

describe("learn", () => {
  it(
    "probe1Changes",
    marbles((m) => {
      const sValues = {
        a: { probe1Changes: undefined },
        b: { probe1Changes: 100 },
        c: { probe1Changes: 100 },
        d: { probe1Changes: 150 },
      };
      const eValues = { d: 150 };
      const source = m.hot("    ^-a-b-c-d-d-|", sValues);
      const expected = m.cold(" --------d---|", eValues);
      const dest = source.pipe(
        pluck("probe1Changes"),
        distinctUntilChanged(),
        skip(2),
        tap((v) => console.log(v))
      );
      m.expect(dest).toBeObservable(expected);
    })
  );
  it(
    "probe1Changes with sharedGrillState",
    marbles((m) => {
      const sValues = {
        a: { desiredProbe1Temp: "1" },
        b: { desiredProbe1Temp: 100 },
        c: { desiredProbe1Temp: 100 },
        d: { desiredProbe1Temp: 150 },
      };
      const eValues = { d: 150 };
      const source = m.hot("    ^-a-b-c-d-d-|", sValues);
      const expected = m.cold(" --------d---|", eValues);
      const dest = probe1Changes(source);
      m.expect(dest).toBeObservable(expected);
    })
  );
  it(
    "parses",
    marbles((m) => {
      const source = m.cold("---a---b---|");
      const expected = "     ---a---b---|";
      m.expect(source).toBeObservable(expected);
    })
  );
  it(
    "distinctUntilChanged",
    marbles((m) => {
      const source = m.hot("--a---a-^-a---a---|");
      const expected = "            --a-------|";
      const dest = source.pipe(distinctUntilChanged());
      m.expect(dest).toBeObservable(expected);
    })
  );
  it(
    "distinctUntilChanged but skips them all",
    marbles((m) => {
      const source = m.hot("-^-a---b---a---a---|");
      const expected = "     ------b---a-------|";
      const dest = source.pipe(distinctUntilChanged(), skip(1));
      m.expect(dest).toBeObservable(expected);
    })
  );
  it(
    "hot example",
    marbles((m) => {
      const obs1 = m.hot("---a-^-b---|");
      const obs2 = m.hot("----c^------d--|");
      const expected = "       --b----d--|";
      const dest = obs1.pipe(concat(obs2));
      m.expect(dest).toBeObservable(expected);
    })
  );
});

describe("basic", () => {
  it(
    "should support marble tests without values",
    marbles((m) => {
      const source = m.hot("  --^-a-b-c-|");
      const subs = "            ^-------!";
      const expected = m.cold(" --b-c-d-|");

      const destination = source.pipe(
        map((value) => String.fromCharCode(value.charCodeAt(0) + 1))
      );
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it(
    "should support marble tests with values",
    marbles((m) => {
      const inputs = {
        a: 1,
        b: 2,
        c: 3,
      };
      const outputs = {
        x: 2,
        y: 3,
        z: 4,
      };

      const source = m.hot("  --^-a-b-c-|", inputs);
      const subs = "            ^-------!";
      const expected = m.cold(" --x-y-z-|", outputs);

      const destination = source.pipe(map((value) => value + 1));
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it(
    "should support marble tests with errors",
    marbles((m) => {
      const source = m.hot("  --^-a-b-c-#");
      const subs = "            ^-------!";
      const expected = m.cold(" --a-b-c-#");

      const destination = source;
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );

  it(
    "should support marble tests with explicit errors",
    marbles((m) => {
      const inputs = {
        a: 1,
        b: 2,
        c: 3,
      };
      const outputs = {
        x: 2,
        y: 3,
        z: 4,
      };

      const source = m.hot("  --^-a-b-c-#", inputs, new Error("Boom!"));
      const subs = "            ^-------!";
      const expected = m.cold(" --x-y-z-#", outputs, new Error("Boom!"));

      const destination = source.pipe(map((value) => value + 1));
      m.expect(destination).toBeObservable(expected);
      m.expect(source).toHaveSubscriptions(subs);
    })
  );
});
