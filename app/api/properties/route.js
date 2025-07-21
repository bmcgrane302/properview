import { NextResponse } from 'next/server'
import { getDatabase } from '../../../lib/db'

// GET /api/properties - List all public properties
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const minPrice = searchParams.get('minPrice')
        const maxPrice = searchParams.get('maxPrice')
        const bedrooms = searchParams.get('bedrooms')
        const location = searchParams.get('location')

        const db = await getDatabase()
        const collection = db.collection('properties')

        // Build filter for active properties only
        let filter = { status: 'active' }

        if (minPrice) {
            filter.price = { ...filter.price, $gte: parseInt(minPrice) }
        }

        if (maxPrice) {
            filter.price = { ...filter.price, $lte: parseInt(maxPrice) }
        }

        if (bedrooms) {
            filter.bedrooms = parseInt(bedrooms)
        }

        if (location) {
            filter.address = { $regex: location, $options: 'i' }
        }

        const properties = await collection
            .find(filter)
            .sort({ createdAt: -1 })
            .toArray()

        return NextResponse.json(properties)
    } catch (error) {
        console.error('Error fetching properties:', error)
        return NextResponse.json(
            { error: 'Failed to fetch properties' },
            { status: 500 }
        )
    }
}

// POST /api/properties - Create new property
export async function POST(request) {
    try {
        const data = await request.json()

        const db = await getDatabase()
        const collection = db.collection('properties')

        const property = {
            ...data,
            price: parseInt(data.price),
            bedrooms: parseInt(data.bedrooms),
            bathrooms: parseInt(data.bathrooms),
            status: data.status || 'active',
            agentId: data.agentId || 'agent1',
            createdAt: new Date(),
            updatedAt: new Date()
        }

        const result = await collection.insertOne(property)
        const newProperty = await collection.findOne({ _id: result.insertedId })

        return NextResponse.json(newProperty, { status: 201 })
    } catch (error) {
        console.error('Error creating property:', error)
        return NextResponse.json(
            { error: 'Failed to create property' },
            { status: 500 }
        )
    }
}
