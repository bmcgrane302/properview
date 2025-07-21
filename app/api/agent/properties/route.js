import { NextResponse } from 'next/server'
import { getDatabase } from '../../../../lib/db'

// GET /api/agent/properties - List all agent-owned properties
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const agentId = searchParams.get('agentId') || 'agent1' // Mock agent ID

        console.log('API: Fetching properties for agent:', agentId)

        const db = await getDatabase()
        const collection = db.collection('properties')

        const properties = await collection
            .find({ agentId })
            .sort({ createdAt: -1 })
            .toArray()

        console.log('API: Found properties:', properties.length)

        return NextResponse.json(properties)
    } catch (error) {
        console.error('Error fetching agent properties:', error)
        return NextResponse.json(
            { error: 'Failed to fetch properties' },
            { status: 500 }
        )
    }
}
