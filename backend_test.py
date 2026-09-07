import os
import tempfile
import uuid
from fastapi import HTTPException


def check(name, condition, detail=""):
    if not condition:
        raise AssertionError(f"{name}: {detail}")
    print(f"PASS: {name}")


def expect_http(fn, status_code):
    try:
        fn()
    except HTTPException as exc:
        return exc.status_code == status_code
    return False


def main():
    with tempfile.TemporaryDirectory() as tmp:
        os.environ["SQLITE_DB_PATH"] = os.path.join(tmp, "roamly-test.sqlite3")
        from backend import main as api
        api.initialize()
        check("startup schema and 8 seeded listings", len(api.get_listings(maxPrice=0)) == 8)
        check("health reports sqlite", api.health() == {"status": "ok", "database": "sqlite"})
        items = api.get_listings(maxPrice=0)
        check("seed ids and images", all(isinstance(x["id"], str) and x["images"] for x in items))
        noida = api.get_listings(q="Noida", maxPrice=0)
        check("q filter", noida and all("noida" in (x["location"] + " " + (x.get("region") or "")).lower() for x in noida))
        filtered = api.get_listings(category="Villa", maxPrice=6000)
        check("category and maxPrice filters", all(x["type"] == "Villa" and x["price"] <= 6000 for x in filtered))
        listing = items[0]
        check("listing detail", api.get_listing(listing["id"])["id"] == listing["id"])

        created = api.create_listing(api.ListingCreate(title="Courtyard studio near Connaught Place", location="Connaught Place, New Delhi", price=2500, guests=2, images=["https://example.com/studio.jpg"]))
        new_id = created["id"]
        check("listing create UUID", uuid.UUID(new_id) and created["host_id"] == "host-demo")
        host = api.get_host_listings(hostId="host-demo")
        check("host listing includes created", any(x["id"] == new_id for x in host["listings"]))
        updated = api.update_listing(new_id, api.ListingUpdate(title="Updated courtyard studio", price=2700))
        check("listing update", updated["title"] == "Updated courtyard studio" and updated["price"] == 2700)

        payload = api.BookingCreate(listing_id=listing["id"], start_date="2030-06-10", end_date="2030-06-13", guests=2, guest_id="guest-demo", guest_name="Priya Sharma")
        booking = api.create_booking(payload)
        subtotal = 3 * listing["price"]
        check("booking totals confirmed", booking["status"] == "confirmed" and booking["nights"] == 3 and booking["subtotal"] == subtotal and booking["total"] == round(subtotal * 1.14))
        check("overlap returns 409", expect_http(lambda: api.create_booking(payload), 409))
        too_many = api.BookingCreate(listing_id=listing["id"], start_date="2030-07-01", end_date="2030-07-03", guests=listing["guests"] + 1)
        check("guest capacity returns 400", expect_http(lambda: api.create_booking(too_many), 400))
        bad_date = api.BookingCreate(listing_id=listing["id"], start_date="not-a-date", end_date="2030-08-03", guests=1)
        check("malformed date returns 400", expect_http(lambda: api.create_booking(bad_date), 400))
        bad_range = api.BookingCreate(listing_id=listing["id"], start_date="2030-08-03", end_date="2030-08-03", guests=1)
        check("malformed range returns 400", expect_http(lambda: api.create_booking(bad_range), 400))
        guest = api.get_bookings(guestId="guest-demo")
        check("guest bookings includes created", any(x["id"] == booking["id"] for x in guest))
        deleted = api.delete_listing(new_id)
        check("listing delete", deleted == {"success": True, "id": new_id})
        check("deleted listing unavailable", expect_http(lambda: api.get_listing(new_id), 404))

    print("ALL EXACT-STACK BACKEND TESTS PASSED")


if __name__ == "__main__":
    main()
