'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function PropertyDetailsPage() {
    const params = useParams()
    const [property, setProperty] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showInquiryForm, setShowInquiryForm] = useState(false)
    const [inquiry, setInquiry] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    })
    const [submitting, setSubmitting] = useState(false)
    const [submitMessage, setSubmitMessage] = useState('')

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await fetch(`/api/properties/${params.id}`)
                if (response.ok) {
                    const data = await response.json()
                    setProperty(data)
                }
            } catch (error) {
                console.error('Error fetching property:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchProperty()
    }, [params.id])

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(price)
    }

    const handleInquirySubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        setSubmitMessage('')

        try {
            const response = await fetch('/api/inquiries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...inquiry,
                    propertyId: params.id
                })
            })

            if (response.ok) {
                setSubmitMessage('Your inquiry has been submitted successfully!')
                setInquiry({ name: '', email: '', phone: '', message: '' })
                setShowInquiryForm(false)
            } else {
                const error = await response.json()
                setSubmitMessage(`Error: ${error.error}`)
            }
        } catch (error) {
            setSubmitMessage('Error submitting inquiry. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        )
    }

    if (!property) {
        return (
            <>
                <nav className="nav">
                    <div className="container">
                        <div className="nav-content">
                            <Link href="/" className="nav-brand">ProperView</Link>
                            <div className="nav-links">
                                <Link href="/listings" className="nav-link">Back to Listings</Link>
                            </div>
                        </div>
                    </div>
                </nav>
                <main className="container">
                    <div className="text-center p-8">
                        <h1>Property not found</h1>
                        <Link href="/listings" className="btn btn-primary mt-4">
                            Back to Listings
                        </Link>
                    </div>
                </main>
            </>
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
                            <Link href="/" className="nav-link">
                                Home
                            </Link>
                            <Link href="/listings" className="nav-link">
                                Browse Listings
                            </Link>
                            <Link href="/agent/login" className="btn btn-primary">
                                Agent Login
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="container">
                <div className="mb-4">
                    <Link href="/listings" className="nav-link">
                        ← Back to Listings
                    </Link>
                </div>

                <div className="grid grid-1">
                    <div className="card">
                        <div className="mb-2">
                            <span className={`status-badge status-${property.status}`}>
                                {property.status}
                            </span>
                        </div>

                        <h1 className="property-title">{property.title}</h1>
                        <div className="property-price mb-2">
                            {formatPrice(property.price)}
                        </div>
                        <div className="property-address mb-4">{property.address}</div>

                        <div className="property-features mb-4">
                            <span><strong>{property.bedrooms}</strong> bedrooms</span>
                            <span><strong>{property.bathrooms}</strong> bathrooms</span>
                        </div>

                        <div className="mb-4">
                            <h3 className="mb-2">Description</h3>
                            <p>{property.description}</p>
                        </div>

                        {property.status === 'active' && (
                            <div className="property-actions">
                                <button
                                    onClick={() => setShowInquiryForm(true)}
                                    className="btn btn-primary"
                                >
                                    Submit Inquiry
                                </button>
                            </div>
                        )}

                        {submitMessage && (
                            <div className={`mt-4 p-4 rounded ${submitMessage.includes('Error') ? 'error-message' : 'success-message'
                                }`}>
                                {submitMessage}
                            </div>
                        )}
                    </div>
                </div>

                {/* Inquiry Modal */}
                {showInquiryForm && (
                    <div className="modal-overlay" onClick={() => setShowInquiryForm(false)}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2 className="modal-title">Submit Inquiry</h2>
                                <button
                                    onClick={() => setShowInquiryForm(false)}
                                    className="modal-close"
                                >
                                    ×
                                </button>
                            </div>

                            <form onSubmit={handleInquirySubmit}>
                                <div className="form-group">
                                    <label className="form-label">Name *</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={inquiry.name}
                                        onChange={(e) => setInquiry(prev => ({ ...prev, name: e.target.value }))}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Email *</label>
                                    <input
                                        type="email"
                                        className="form-input"
                                        value={inquiry.email}
                                        onChange={(e) => setInquiry(prev => ({ ...prev, email: e.target.value }))}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Phone</label>
                                    <input
                                        type="tel"
                                        className="form-input"
                                        value={inquiry.phone}
                                        onChange={(e) => setInquiry(prev => ({ ...prev, phone: e.target.value }))}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Message *</label>
                                    <textarea
                                        className="form-textarea"
                                        rows="4"
                                        value={inquiry.message}
                                        onChange={(e) => setInquiry(prev => ({ ...prev, message: e.target.value }))}
                                        placeholder="I'm interested in this property..."
                                        required
                                    />
                                </div>

                                <div className="modal-actions">
                                    <button
                                        type="button"
                                        onClick={() => setShowInquiryForm(false)}
                                        className="btn btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={submitting}
                                    >
                                        {submitting ? 'Submitting...' : 'Submit Inquiry'}
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
