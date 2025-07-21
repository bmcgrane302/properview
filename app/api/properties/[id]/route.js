import { NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { getDatabase } from '../../../../lib/db'

// GET /api/properties/:id - Get single property
export async function GET(request, { params }) {
  try {
    const { id } = params
    console.log('API: Fetching property with ID:', id)

    if (!ObjectId.isValid(id)) {
      console.log('API: Invalid ObjectId:', id)
      return NextResponse.json(
        { error: 'Invalid property ID' },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const collection = db.collection('properties')

    const property = await collection.findOne({ _id: new ObjectId(id) })
    console.log('API: Found property:', property ? 'Yes' : 'No')

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(property)
  } catch (error) {
    console.error('API: Error fetching property:', error)
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    )
  }
}

// PUT /api/properties/:id - Update property
export async function PUT(request, { params }) {
  try {
    const data = await request.json()
    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid property ID' },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const collection = db.collection('properties')

    const updateData = {
      ...data,
      updatedAt: new Date()
    }

    if (data.price) updateData.price = parseInt(data.price)
    if (data.bedrooms) updateData.bedrooms = parseInt(data.bedrooms)
    if (data.bathrooms) updateData.bathrooms = parseInt(data.bathrooms)

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    const updatedProperty = await collection.findOne({ _id: new ObjectId(id) })
    return NextResponse.json(updatedProperty)
  } catch (error) {
    console.error('Error updating property:', error)
    return NextResponse.json(
      { error: 'Failed to update property' },
      { status: 500 }
    )
  }
}

// DELETE /api/properties/:id - Delete property
export async function DELETE(request, { params }) {
  try {
    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid property ID' },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const collection = db.collection('properties')

    const result = await collection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Property deleted successfully' })
  } catch (error) {
    console.error('Error deleting property:', error)
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    )
  }
}