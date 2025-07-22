'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AgentDashboardPage() {
    const [properties, setProperties] = useState([])
    const [inquiries, setInquiries] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingProperty, setEditingProperty] = useState(null)
    const [agentInfo, setAgentInfo] = useState(null)
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        address: '',
        bedrooms: '',
        bathrooms: '',
        description: '',
        status: 'active'
    })
    const router = useRouter()

    useEffect(() => {
        // Check if user is logged in and get their info
        const session = localStorage.getItem('agentSession')
        if (!session) {
            router.push('/agent/login')
            return
        }

        const agent = JSON.parse(session)
        setAgentInfo(agent)

        // Fetch data for this specific agent
        fetchProperties(agent.id)
        fetchInquiries(agent.id)
    }, [router])

    const fetchProperties = async (agentId) => {
        try {
            const response = await fetch(`/api/agent/properties?agentId=${agentId}`)

            if (!response.ok) {
                console.error('Dashboard: Response not OK:', response.statusText)
                return
            }

            const data = await response.json()
            setProperties(data)
        } catch (error) {
            console.error('Dashboard: Error fetching properties:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchInquiries = async (agentId) => {
        try {
            const response = await fetch(`/api/inquiries?agentId=${agentId}`)
            const data = await response.json()
            setInquiries(data)
        } catch (error) {
            console.error('Dashboard: Error fetching inquiries:', error)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('agentSession')
        router.push('/')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!agentInfo) {
            console.error('No agent info available')
            return
        }

        const method = editingProperty ? 'PUT' : 'POST'
        const url = editingProperty
            ? `/api/properties/${editingProperty._id}`
            : '/api/properties'

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    agentId: agentInfo.id  // Use dynamic agent ID
                })
            })

            if (response.ok) {
                await fetchProperties(agentInfo.id)
                setShowForm(false)
                setEditingProperty(null)
                setFormData({
                    title: '',
                    price: '',
                    address: '',
                    bedrooms: '',
                    bathrooms: '',
                    description: '',
                    status: 'active'
                })
            }
        } catch (error) {
            console.error('Error saving property:', error)
        }
    }

    const handleEdit = (property) => {
        setEditingProperty(property)
        setFormData({
            title: property.title,
            price: property.price.toString(),
            address: property.address,
            bedrooms: property.bedrooms.toString(),
            bathrooms: property.bathrooms.toString(),
            description: property.description,
            status: property.status
        })
        setShowForm(true)
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this property?')) return

        try {
            const response = await fetch(`/api/properties/${id}`, {
                method: 'DELETE'
            })

            if (response.ok && agentInfo) {
                await fetchProperties(agentInfo.id)
            }
        } catch (error) {
            console.error('Error deleting property:', error)
        }
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(price)
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString()
    }

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        )
    }

    return (
        <>
            <nav className="nav">
                <div className="container">
                    <div className="nav-content">
                        <Link href="/" className="nav-brand">
                            ProperView
                        </Link>
                        <div className="nav-links">
                            <span className="nav-link">
                                {agentInfo ? `Welcome, ${agentInfo.name}` : 'Agent Dashboard'}
                            </span>
                            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="container">
                <div className="header-actions">
                    <div>
                        <h1 className="page-title">Agent Dashboard</h1>
                        <p className="page-description">
                            {agentInfo ? `${agentInfo.role} - Manage your property listings` : 'Manage your property listings'}
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setShowForm(true)
                            setEditingProperty(null)
                            setFormData({
                                title: '',
                                price: '',
                                address: '',
                                bedrooms: '',
                                bathrooms: '',
                                description: '',
                                status: 'active'
                            })
                        }}
                        className="btn btn-primary"
                    >
                        Add New Property
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-3 mb-4">
                    <div className="card text-center">
                        <h3 className="mb-2">{properties.length}</h3>
                        <p className="text-light">Total Properties</p>
                    </div>
                    <div className="card text-center">
                        <h3 className="mb-2">{properties.filter(p => p.status === 'active').length}</h3>
                        <p className="text-light">Active Listings</p>
                    </div>
                    <div className="card text-center">
                        <h3 className="mb-2">{inquiries.length}</h3>
                        <p className="text-light">Total Inquiries</p>
                    </div>
                </div>

                {/* Properties */}
                <section className="mb-4">
                    <h2 className="mb-4">Your Properties</h2>
                    {properties.length === 0 ? (
                        <div className="text-center p-8">
                            <h3 className="mb-2">No properties yet</h3>
                            <p className="text-light">Add your first property listing</p>
                        </div>
                    ) : (
                        <div className="grid grid-2">
                            {properties.map((property) => (
                                <div key={property._id} className="property-card">
                                    <div className="property-card-content">
                                        <div className="mb-2">
                                            <span className={`status-badge status-${property.status}`}>
                                                {property.status}
                                            </span>
                                        </div>

                                        <h3 className="property-title">{property.title}</h3>
                                        <div className="property-price">
                                            {formatPrice(property.price)}
                                        </div>
                                        <div className="property-address">{property.address}</div>

                                        <div className="property-features">
                                            <span>{property.bedrooms} bed</span>
                                            <span>{property.bathrooms} bath</span>
                                        </div>

                                        <p className="property-description">
                                            {property.description}
                                        </p>

                                        <div className="property-actions">
                                            <button
                                                onClick={() => handleEdit(property)}
                                                className="btn btn-secondary btn-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(property._id)}
                                                className="btn btn-danger btn-sm"
                                            >
                                                Delete
                                            </button>
                                            <Link
                                                href={`/listings/${property._id}`}
                                                className="btn btn-primary btn-sm"
                                            >
                                                View
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Recent Inquiries */}
                <section>
                    <h2 className="mb-4">Recent Inquiries</h2>
                    {inquiries.length === 0 ? (
                        <div className="text-center p-8">
                            <h3 className="mb-2">No inquiries yet</h3>
                            <p className="text-light">Inquiries from potential buyers will appear here</p>
                        </div>
                    ) : (
                        <div className="grid grid-1">
                            {inquiries.slice(0, 5).map((inquiry) => (
                                <div key={inquiry._id} className="card">
                                    <div className="mb-2">
                                        <strong>{inquiry.property?.[0]?.title || 'Property'}</strong>
                                    </div>
                                    <div className="mb-2">
                                        <strong>From:</strong> {inquiry.name} ({inquiry.email})
                                        {inquiry.phone && <span> - {inquiry.phone}</span>}
                                    </div>
                                    <div className="mb-2">
                                        <strong>Date:</strong> {formatDate(inquiry.createdAt)}
                                    </div>
                                    <div>
                                        <strong>Message:</strong> {inquiry.message}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Property Form Modal - Same as before */}
                {showForm && (
                    <div className="modal-overlay" onClick={() => setShowForm(false)}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2 className="modal-title">
                                    {editingProperty ? 'Edit Property' : 'Add New Property'}
                                </h2>
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="modal-close"
                                >
                                    ×
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Title</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.title}
                                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                        required
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Price</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={formData.price}
                                            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Status</label>
                                        <select
                                            className="form-select"
                                            value={formData.status}
                                            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                                        >
                                            <option value="active">Active</option>
                                            <option value="pending">Pending</option>
                                            <option value="sold">Sold</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Address</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.address}
                                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                        required
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Bedrooms</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={formData.bedrooms}
                                            onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: e.target.value }))}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Bathrooms</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={formData.bathrooms}
                                            onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: e.target.value }))}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        className="form-textarea"
                                        rows="4"
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        required
                                    />
                                </div>

                                <div className="modal-actions">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="btn btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                    >
                                        {editingProperty ? 'Update Property' : 'Create Property'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </>
    )
}