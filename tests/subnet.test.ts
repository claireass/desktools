import { describe, expect, it } from "vitest";
import { describeSubnet } from "@/features/subnet-calculator/logic";

describe("describeSubnet", () => {
  it("calculates a /24 network", () => {
    expect(describeSubnet("192.168.1.10/24")).toEqual({
      ok: true,
      report: {
        address: "192.168.1.10",
        prefix: 24,
        netmask: "255.255.255.0",
        network: "192.168.1.0",
        broadcast: "192.168.1.255",
        firstHost: "192.168.1.1",
        lastHost: "192.168.1.254",
        usable: 254,
        kind: "normal",
      },
    });
  });

  it("treats /31 and /32 as usable addresses", () => {
    const point = describeSubnet("10.0.0.0/31");
    expect(point.ok && point.report.kind).toBe("pointToPoint");
    expect(point.ok && point.report.usable).toBe(2);
    expect(point.ok && point.report.broadcast).toBeNull();

    const single = describeSubnet("10.1.2.3/32");
    expect(single.ok && single.report).toMatchObject({
      kind: "single",
      usable: 1,
      network: "10.1.2.3",
      firstHost: "10.1.2.3",
      broadcast: null,
    });
  });

  it("rejects broken addresses and prefixes", () => {
    expect(describeSubnet("")).toEqual({ ok: false, reason: "empty" });
    expect(describeSubnet("192.168.1.256/24")).toEqual({ ok: false, reason: "invalid" });
    expect(describeSubnet("192.168.001.1/24")).toEqual({ ok: false, reason: "invalid" });
    expect(describeSubnet("10.0.0.1/33")).toEqual({ ok: false, reason: "invalid" });
  });
});
