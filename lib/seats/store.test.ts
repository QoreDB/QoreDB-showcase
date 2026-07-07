import assert from "node:assert/strict";
import test from "node:test";
import type Stripe from "stripe";

import {
  canClaim,
  computeTrimToCap,
  countActive,
  findActiveAssignment,
  getAssignments,
  getCap,
  getJoinNonce,
  type SeatAssignment,
  serializeAssignments,
} from "./store";

// Fabrique un abonnement minimal avec un plafond (quantity) et une metadata.
function fakeSubscription(
  quantity: number,
  metadata: Record<string, string> = {},
): Stripe.Subscription {
  return {
    id: "sub_test",
    metadata,
    items: { data: [{ quantity }] },
  } as unknown as Stripe.Subscription;
}

function withAssignments(
  quantity: number,
  list: SeatAssignment[],
): Stripe.Subscription {
  return fakeSubscription(quantity, {
    qoredb_seat_assignments: serializeAssignments(list),
  });
}

const seat = (
  email: string,
  status: SeatAssignment["status"] = "active",
): SeatAssignment => ({
  email,
  status,
  claimedAt: "2026-06-01T00:00:00.000Z",
});

test("round-trip assignments through metadata", () => {
  const list = [seat("a@acme.com"), seat("b@acme.com", "removed")];
  const sub = withAssignments(3, list);
  const decoded = getAssignments(sub);

  assert.equal(decoded.length, 2);
  assert.equal(decoded[0].email, "a@acme.com");
  assert.equal(decoded[0].status, "active");
  assert.equal(decoded[1].email, "b@acme.com");
  assert.equal(decoded[1].status, "removed");
  assert.equal(decoded[0].claimedAt, "2026-06-01T00:00:00.000Z");
});

test("empty / malformed metadata yields empty ledger", () => {
  assert.deepEqual(getAssignments(fakeSubscription(3)), []);
  assert.deepEqual(
    getAssignments(
      fakeSubscription(3, { qoredb_seat_assignments: "not-json" }),
    ),
    [],
  );
});

test("canClaim under cap is allowed, at cap is refused", () => {
  const underCap = withAssignments(3, [seat("a@acme.com"), seat("b@acme.com")]);
  assert.equal(canClaim(underCap), true);

  const atCap = withAssignments(3, [
    seat("a@acme.com"),
    seat("b@acme.com"),
    seat("c@acme.com"),
  ]);
  assert.equal(canClaim(atCap), false);
  assert.equal(countActive(getAssignments(atCap)), 3);
});

test("removed seat frees a slot", () => {
  const list = [
    seat("a@acme.com"),
    seat("b@acme.com"),
    seat("c@acme.com", "removed"),
  ];
  const sub = withAssignments(3, list);
  assert.equal(countActive(getAssignments(sub)), 2);
  assert.equal(canClaim(sub), true);
});

test("email matching is case-insensitive and ignores removed seats", () => {
  const list = [seat("Dev@Acme.com"), seat("old@acme.com", "removed")];
  const sub = withAssignments(3, list);
  const found = findActiveAssignment(getAssignments(sub), "dev@acme.com");
  assert.ok(found);
  assert.equal(found?.email, "dev@acme.com");

  assert.equal(
    findActiveAssignment(getAssignments(sub), "old@acme.com"),
    undefined,
  );
});

test("computeTrimToCap removes the most recent seats first (3 -> 2)", () => {
  const list: SeatAssignment[] = [
    {
      email: "admin@acme.com",
      status: "active",
      claimedAt: "2026-06-01T00:00:00.000Z",
    },
    {
      email: "dev1@acme.com",
      status: "active",
      claimedAt: "2026-06-02T00:00:00.000Z",
    },
    {
      email: "dev2@acme.com",
      status: "active",
      claimedAt: "2026-06-03T00:00:00.000Z",
    },
  ];
  const { next, removed } = computeTrimToCap(list, 2);
  assert.deepEqual(removed, ["dev2@acme.com"]); // le plus récent
  assert.equal(countActive(next), 2);
  assert.equal(
    next.find((s) => s.email === "admin@acme.com")?.status,
    "active",
  );
  assert.equal(
    next.find((s) => s.email === "dev2@acme.com")?.status,
    "removed",
  );
});

test("computeTrimToCap is a no-op when active count is within cap", () => {
  const list: SeatAssignment[] = [
    {
      email: "a@acme.com",
      status: "active",
      claimedAt: "2026-06-01T00:00:00.000Z",
    },
    {
      email: "b@acme.com",
      status: "removed",
      claimedAt: "2026-06-02T00:00:00.000Z",
    },
  ];
  const { next, removed } = computeTrimToCap(list, 3);
  assert.deepEqual(removed, []);
  assert.equal(next, list);
});

test("getCap and getJoinNonce read subscription state", () => {
  assert.equal(getCap(fakeSubscription(5)), 5);
  assert.equal(getCap(fakeSubscription(0)), 0);
  assert.equal(
    getJoinNonce(fakeSubscription(3, { qoredb_join_nonce: "abc123" })),
    "abc123",
  );
  assert.equal(getJoinNonce(fakeSubscription(3)), null);
});
