import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'

let client
let db

const seedListings = [
  {
    id: 'stay-01',
    title: 'Sunlit apartment with skyline views',
    location: 'Sector 63, Noida',
    region: 'Noida',
    country: 'India',
    price: 3700,
    rating: 4.92,
    reviews: 86,
    type: 'Apartment',
    guests: 4,
    bedrooms: 2,
    beds: 2,
    baths: 2,
    host: 'Riya',
    hostInitials: 'RK',
    hostColor: '#f9c5b7',
    badge: 'Guest favourite',
    description: 'Wake up to a wide city view in this calm, design-led home with plenty of light, a chef-ready kitchen, and a dedicated work corner.',
    amenities: ['Wifi', 'Kitchen', 'Workspace', 'Air conditioning'],
    images: [
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=85',
      'https://images.pexels.com/photos/2030037/pexels-photo-2030037.jpeg?auto=compress&cs=tinysrgb&w=1200'
    ]
  },
  {
    id: 'stay-02',
    title: 'Warm villa tucked into a quiet garden',
    location: 'Chattarpur, New Delhi',
    region: 'New Delhi',
    country: 'India',
    price: 5800,
    rating: 4.88,
    reviews: 121,
    type: 'Villa',
    guests: 6,
    bedrooms: 3,
    beds: 4,
    baths: 3,
    host: 'Arjun',
    hostInitials: 'AS',
    hostColor: '#bfe2d0',
    badge: 'Guest favourite',
    description: 'A leafy hideaway for slow mornings, long lunches, and evenings around the fire pit. The garden is all yours.',
    amenities: ['Wifi', 'Pool', 'Free parking', 'Kitchen'],
    images: [
      'https://images.unsplash.com/photo-1613977257365-aaae5a9817ff?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1596178067639-5c6e68aea6dc?auto=format&fit=crop&w=1200&q=85'
    ]
  },
  {
    id: 'stay-03',
    title: 'Peaceful home near Lodhi Garden',
    location: 'Lodhi Colony, New Delhi',
    region: 'New Delhi',
    country: 'India',
    price: 4400,
    rating: 4.97,
    reviews: 64,
    type: 'Home',
    guests: 3,
    bedrooms: 1,
    beds: 2,
    baths: 1,
    host: 'Meera',
    hostInitials: 'MP',
    hostColor: '#f5d29c',
    badge: 'Rare find',
    description: 'A quiet, art-filled stay in the heart of Delhi with leafy streets, independent cafés, and the city’s best morning walks nearby.',
    amenities: ['Wifi', 'Kitchen', 'Washer', 'Patio'],
    images: [
      'https://images.unsplash.com/photo-1641232458416-feace752b346?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=85'
    ]
  },
  {
    id: 'stay-04',
    title: 'Modern retreat with a private pool',
    location: 'Greater Kailash, New Delhi',
    region: 'New Delhi',
    country: 'India',
    price: 7200,
    rating: 4.86,
    reviews: 43,
    type: 'Villa',
    guests: 8,
    bedrooms: 4,
    beds: 5,
    baths: 4,
    host: 'Aarav',
    hostInitials: 'AD',
    hostColor: '#c6d7f4',
    badge: 'Guest favourite',
    description: 'A polished indoor-outdoor villa for celebrations and reset weekends, with a pool, terrace dining, and hotel-level comfort.',
    amenities: ['Wifi', 'Pool', 'Hot tub', 'Free parking'],
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1613977257365-aaae5a9817ff?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85'
    ]
  },
  {
    id: 'stay-05',
    title: 'The little blue door in Hauz Khas',
    location: 'Hauz Khas, New Delhi',
    region: 'New Delhi',
    country: 'India',
    price: 3900,
    rating: 4.81,
    reviews: 77,
    type: 'Apartment',
    guests: 2,
    bedrooms: 1,
    beds: 1,
    baths: 1,
    host: 'Naina',
    hostInitials: 'NS',
    hostColor: '#d6c2ef',
    badge: 'Guest favourite',
    description: 'A tiny, colourful nest surrounded by art galleries, independent coffee, and the lake trail. Best for two.',
    amenities: ['Wifi', 'Kitchen', 'Air conditioning', 'TV'],
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1560185009-dddeb820c7b7?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=85'
    ]
  },
  {
    id: 'stay-06',
    title: 'Terrace home overlooking the Aravallis',
    location: 'Aravalli Hills, Gurugram',
    region: 'Gurugram',
    country: 'India',
    price: 6400,
    rating: 4.95,
    reviews: 39,
    type: 'Home',
    guests: 5,
    bedrooms: 2,
    beds: 3,
    baths: 2,
    host: 'Kabir',
    hostInitials: 'KM',
    hostColor: '#f2c4c4',
    badge: 'Amazing views',
    description: 'Trade the city noise for bird song and sunset skies. This warm terrace home is made for long weekends.',
    amenities: ['Wifi', 'Mountain view', 'Breakfast', 'Free parking'],
    images: [
      'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1475856034135-0a4b7e5d3d5d?auto=format&fit=crop&w=1200&q=85'
    ]
  },
  {
    id: 'stay-07',
    title: 'A calm studio in the heart of Goa',
    location: 'Assagao, Goa',
    region: 'Goa',
    country: 'India',
    price: 3100,
    rating: 4.9,
    reviews: 101,
    type: 'Apartment',
    guests: 2,
    bedrooms: 1,
    beds: 1,
    baths: 1,
    host: 'Ishita',
    hostInitials: 'IP',
    hostColor: '#f6dca9',
    badge: 'Guest favourite',
    description: 'A light-filled studio with a shaded veranda, close to Goa’s best bakeries and a short scooter ride from the beach.',
    amenities: ['Wifi', 'Pool', 'Kitchen', 'Garden'],
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85'
    ]
  },
  {
    id: 'stay-08',
    title: 'Glass cabin above the cedar forest',
    location: 'Naukuchiatal, Uttarakhand',
    region: 'Uttarakhand',
    country: 'India',
    price: 8100,
    rating: 4.99,
    reviews: 28,
    type: 'Cabin',
    guests: 4,
    bedrooms: 2,
    beds: 2,
    baths: 2,
    host: 'Dev',
    hostInitials: 'DS',
    hostColor: '#c4dfdc',
    badge: 'Amazing views',
    description: 'Sleep beside the forest in a glass-walled cabin with a fireplace, a cedar deck, and nothing but green beyond it.',
    amenities: ['Wifi', 'Mountain view', 'Fireplace', 'Kitchen'],
    images: [
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=1200&q=85'
    ]
  }
]

async function connectToMongo() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URL)
    await client.connect()
    db = client.db(process.env.DB_NAME)
  }
  return db
}

function cors(response) {
  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return response
}

function clean(document) {
  if (!document) return null
  const { _id, ...rest } = document
  return rest
}

async function listingsCollection(database) {
  const collection = database.collection('stays')
  if (await collection.countDocuments() === 0) {
    await collection.insertMany(seedListings.map((listing) => ({ ...listing, createdAt: new Date() })))
  }
  return collection
}

export async function OPTIONS() {
  return cors(new NextResponse(null, { status: 200 }))
}

async function handleRoute(request, { params }) {
  const { path = [] } = await params
  const parts = path
  const route = `/${parts.join('/')}`
  const method = request.method

  try {
    const database = await connectToMongo()
    const stays = await listingsCollection(database)

    if (route === '/listings' && method === 'GET') {
      const url = new URL(request.url)
      const query = (url.searchParams.get('q') || '').trim().toLowerCase()
      const category = url.searchParams.get('category')
      const maxPrice = Number(url.searchParams.get('maxPrice') || 0)
      const all = await stays.find({}).sort({ createdAt: -1 }).toArray()
      const filtered = all.filter((listing) => {
        const matchesQuery = !query || `${listing.title} ${listing.location} ${listing.region}`.toLowerCase().includes(query)
        const matchesCategory = !category || category === 'All' || (category === 'Amazing views' ? listing.badge === category : listing.type === category || listing.amenities.includes(category))
        const matchesPrice = !maxPrice || listing.price <= maxPrice
        return matchesQuery && matchesCategory && matchesPrice
      })
      return cors(NextResponse.json(filtered.map(clean)))
    }

    if (parts[0] === 'listings' && parts[1] && method === 'GET') {
      const listing = await stays.findOne({ id: parts[1] })
      if (!listing) return cors(NextResponse.json({ error: 'Stay not found' }, { status: 404 }))
      return cors(NextResponse.json(clean(listing)))
    }

    if (route === '/listings' && method === 'POST') {
      const body = await request.json()
      if (!body.title || !body.location || !body.price) return cors(NextResponse.json({ error: 'Title, location and price are required' }, { status: 400 }))
      const listing = {
        ...body,
        id: uuidv4(),
        price: Number(body.price),
        rating: 0,
        reviews: 0,
        guests: Number(body.guests || 2),
        bedrooms: Number(body.bedrooms || 1),
        beds: Number(body.beds || 1),
        baths: Number(body.baths || 1),
        host: body.host || 'You',
        hostId: body.hostId || 'host-demo',
        hostInitials: 'YO',
        hostColor: '#ffd4c7',
        badge: 'New on Roamly',
        amenities: body.amenities || ['Wifi', 'Kitchen'],
        images: body.images?.length ? body.images : [seedListings[0].images[0]],
        createdAt: new Date()
      }
      await stays.insertOne(listing)
      return cors(NextResponse.json(clean(listing), { status: 201 }))
    }

    if (parts[0] === 'listings' && parts[1] && method === 'PUT') {
      const body = await request.json()
      const update = { ...body, price: Number(body.price), updatedAt: new Date() }
      delete update.id
      const result = await stays.findOneAndUpdate({ id: parts[1] }, { $set: update }, { returnDocument: 'after' })
      if (!result) return cors(NextResponse.json({ error: 'Stay not found' }, { status: 404 }))
      return cors(NextResponse.json(clean(result)))
    }

    if (parts[0] === 'listings' && parts[1] && method === 'DELETE') {
      const result = await stays.deleteOne({ id: parts[1] })
      if (!result.deletedCount) return cors(NextResponse.json({ error: 'Stay not found' }, { status: 404 }))
      return cors(NextResponse.json({ success: true, id: parts[1] }))
    }

    if (route === '/bookings' && method === 'GET') {
      const url = new URL(request.url)
      const guestId = url.searchParams.get('guestId') || 'guest-demo'
      const bookings = await database.collection('bookings').find({ guestId }).sort({ createdAt: -1 }).toArray()
      return cors(NextResponse.json(bookings.map(clean)))
    }

    if (route === '/bookings' && method === 'POST') {
      const body = await request.json()
      if (!body.listingId || !body.startDate || !body.endDate || !body.guests) return cors(NextResponse.json({ error: 'Listing, dates and guests are required' }, { status: 400 }))
      const start = new Date(body.startDate)
      const end = new Date(body.endDate)
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) return cors(NextResponse.json({ error: 'Choose a valid date range' }, { status: 400 }))
      const listing = await stays.findOne({ id: body.listingId })
      if (!listing) return cors(NextResponse.json({ error: 'Stay not found' }, { status: 404 }))
      if (Number(body.guests) > Number(listing.guests)) return cors(NextResponse.json({ error: `This stay hosts up to ${listing.guests} guests` }, { status: 400 }))
      const existing = await database.collection('bookings').findOne({ listingId: body.listingId, status: { $ne: 'cancelled' }, startDate: { $lt: body.endDate }, endDate: { $gt: body.startDate } })
      if (existing) return cors(NextResponse.json({ error: 'Those dates are no longer available' }, { status: 409 }))
      const nights = Math.max(1, Math.ceil((end - start) / 86400000))
      const booking = {
        id: uuidv4(),
        listingId: listing.id,
        listingTitle: listing.title,
        listingImage: listing.images[0],
        location: listing.location,
        guestId: body.guestId || 'guest-demo',
        guestName: body.guestName || 'Alex Morgan',
        hostId: listing.hostId || 'host-demo',
        startDate: body.startDate,
        endDate: body.endDate,
        guests: Number(body.guests),
        nights,
        subtotal: nights * listing.price,
        total: Math.round(nights * listing.price * 1.14),
        status: 'confirmed',
        createdAt: new Date()
      }
      await database.collection('bookings').insertOne(booking)
      return cors(NextResponse.json(clean(booking), { status: 201 }))
    }

    if (route === '/host/listings' && method === 'GET') {
      const url = new URL(request.url)
      const hostId = url.searchParams.get('hostId') || 'host-demo'
      const owned = await stays.find({ hostId }).sort({ createdAt: -1 }).toArray()
      const bookings = await database.collection('bookings').find({ hostId }).sort({ createdAt: -1 }).toArray()
      return cors(NextResponse.json({ listings: owned.map(clean), bookings: bookings.map(clean) }))
    }

    return cors(NextResponse.json({ error: `Route ${route} not found` }, { status: 404 }))
  } catch (error) {
    console.error('API Error:', error)
    return cors(NextResponse.json({ error: 'Internal server error' }, { status: 500 }))
  }
}

export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
export const PATCH = handleRoute