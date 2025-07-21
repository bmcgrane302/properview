import { NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { getDatabase } from '../../../lib/db'

// POST /api/inquiries - Submit a buyer inquiry
export async function POST(request) {
    try {
        const data = await request.json()

        // Basic validation
        const required = ['propertyId', 'name', 'email', 'message']
        for (const field of required) {
            if (!data[field]) {
                return NextResponse.json(
                    { error: `${field} is required` },
                    { status: 400 }
                )
            }
        }

        // Validate property exists
        const db = await getDatabase()
        const propertiesCollection = db.collection('properties')

        if (!ObjectId.isValid(data.propertyId)) {
            return NextResponse.json(
                { error: 'Invalid property ID' },
                { status: 400 }
            )
        }

        const property = await propertiesCollection.findOne({
            _id: new ObjectId(data.propertyId)
        })

        if (!property) {
            return NextResponse.json(
                { error: 'Property not found' },
                { status: 404 }
            )
        }

        const inquiriesCollection = db.collection('inquiries')

        const inquiry = {
            propertyId: new ObjectId(data.propertyId),
            name: data.name.trim(),
            email: data.email.trim().toLowerCase(),
            phone: data.phone?.trim() || null,
            message: data.message.trim(),
            createdAt: new Date()
        }

        const result = await inquiriesCollection.insertOne(inquiry)
        const newInquiry = await inquiriesCollection.findOne({ _id: result.insertedId })

        return NextResponse.json(newInquiry, { status: 201 })
    } catch (error) {
        console.error('Error creating inquiry:', error)
        return NextResponse.json(
            { error: 'Failed to submit inquiry' },
            { status: 500 }
        )
    }
}

// GET /api/inquiries - List inquiries (for agents)
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const agentId = searchParams.get('agentId') || 'agent1' // Mock agent ID

        const db = await getDatabase()

        // Get inquiries for properties owned by this agent
        const inquiries = await db.collection('inquiries').aggregate([
            {
                $lookup: {
                    from: 'properties',
                    localField: 'propertyId',
                    foreignField: '_id',
                    as: 'property'
                }
            },
            {
                $match: {
                    'property.agentId': agentId
                }
            },
            {
                $sort: { createdAt: -1 }
            }
        ]).toArray()

        return NextResponse.json(inquiries)
    } catch (error) {
        console.error('Error fetching inquiries:', error)
        return NextResponse.json(
            { error: 'Failed to fetch inquiries' },
            { status: 500 }
        )
    }
}
