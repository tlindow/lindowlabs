import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  contactTransitDistance,
  getProfileDockOwner,
  NAV_DOCK_SCROLL_PX,
} from "./profileDock.ts";

describe("getProfileDockOwner", () => {
  const vh = 800;
  const contactMid = 2000;
  const transit = contactTransitDistance(vh);
  const contactStart = contactMid - transit;

  it("keeps hero ownership until the morph has nearly docked", () => {
    assert.equal(getProfileDockOwner(0, contactMid, vh), "hero");
    assert.equal(
      getProfileDockOwner(NAV_DOCK_SCROLL_PX * 0.97, contactMid, vh),
      "hero"
    );
  });

  it("hands the nav the photo only after dock and before contact transit", () => {
    assert.equal(
      getProfileDockOwner(NAV_DOCK_SCROLL_PX * 0.98, contactMid, vh),
      "nav"
    );
    assert.equal(getProfileDockOwner(contactStart - 1, contactMid, vh), "nav");
  });

  it("gives contact ownership as soon as transit toward Let's talk begins", () => {
    assert.equal(getProfileDockOwner(contactStart, contactMid, vh), "contact");
    assert.equal(getProfileDockOwner(contactMid, contactMid, vh), "contact");
  });
});
