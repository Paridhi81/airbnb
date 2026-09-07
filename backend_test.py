import os
import uuid
from datetime import date, timedelta
import requests

BASE = os.environ.get('NEXT_PUBLIC_BASE_URL', 'https://property-portal-606.preview.emergentagent.com').rstrip('/') + '/api'

def check(name, condition, detail=''):
    if not condition:
        raise AssertionError(f'{name}: {detail}')
    print(f'PASS: {name}')

def main():
    s = requests.Session()
    listings = s.get(f'{BASE}/listings', timeout=20)
    check('GET listings status', listings.status_code == 200, listings.text)
    items = listings.json()
    check('seeded at least 8 listings', len(items) >= 8, str(len(items)))
    check('listing ids and images', all(isinstance(x.get('id'), str) and x.get('images') for x in items))
    noida = s.get(f'{BASE}/listings?q=Noida', timeout=20)
    check('Noida filter', noida.status_code == 200 and noida.json() and all('noida' in (x.get('location','')+' '+x.get('region','')).lower() for x in noida.json()), noida.text)
    filt = s.get(f'{BASE}/listings?category=Villa&maxPrice=6000', timeout=20)
    check('category/maxPrice filter', filt.status_code == 200 and all(x.get('type') == 'Villa' and x.get('price') <= 6000 for x in filt.json()))
    listing = items[0]
    detail = s.get(f"{BASE}/listings/{listing['id']}", timeout=20)
    check('listing detail', detail.status_code == 200 and detail.json().get('id') == listing['id'])
    start = date.today() + timedelta(days=30); end = start + timedelta(days=2)
    payload = {'listingId': listing['id'], 'guestId':'guest-demo', 'guestName':'Priya Sharma', 'startDate':start.isoformat(), 'endDate':end.isoformat(), 'guests':1}
    booking = s.post(f'{BASE}/bookings', json=payload, timeout=20)
    check('booking create', booking.status_code == 201 and booking.json().get('nights') == 2 and booking.json().get('subtotal') and booking.json().get('total') and booking.json().get('status') == 'confirmed', booking.text)
    overlap = s.post(f'{BASE}/bookings', json=payload, timeout=20)
    check('overlap returns 409', overlap.status_code == 409, overlap.text)
    too_many = {**payload, 'startDate':(start+timedelta(days=5)).isoformat(), 'endDate':(end+timedelta(days=5)).isoformat(), 'guests':listing['guests']+1}
    check('guest capacity returns 400', s.post(f'{BASE}/bookings', json=too_many, timeout=20).status_code == 400)
    guest = s.get(f'{BASE}/bookings?guestId=guest-demo', timeout=20)
    check('guest bookings includes created', guest.status_code == 200 and any(x.get('id') == booking.json().get('id') for x in guest.json()))
    create = {'title':'Courtyard studio near Connaught Place','location':'Connaught Place, New Delhi','price':2500,'hostId':'host-demo','guests':2,'images':['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85']}
    created = s.post(f'{BASE}/listings', json=create, timeout=20)
    check('host listing create', created.status_code == 201, created.text)
    new_id = created.json().get('id')
    host = s.get(f'{BASE}/host/listings?hostId=host-demo', timeout=20)
    check('host listing get', host.status_code == 200 and any(x.get('id') == new_id for x in host.json().get('listings', [])))
    updated = s.put(f'{BASE}/listings/{new_id}', json={'title':'Updated courtyard studio','price':2700}, timeout=20)
    check('host listing update', updated.status_code == 200 and updated.json().get('title') == 'Updated courtyard studio' and updated.json().get('price') == 2700, updated.text)
    deleted = s.delete(f'{BASE}/listings/{new_id}', timeout=20)
    check('host listing delete', deleted.status_code == 200, deleted.text)
    check('malformed booking 400', s.post(f'{BASE}/bookings', json={'listingId':listing['id']}, timeout=20).status_code == 400)
    check('malformed listing 400', s.post(f'{BASE}/listings', json={'title':'Only title'}, timeout=20).status_code == 400)
    print('ALL BACKEND TESTS PASSED')

if __name__ == '__main__':
    try: main()
    except Exception as e:
        print(f'FAIL: {e}')
        raise
