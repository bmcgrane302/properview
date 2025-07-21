'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ListingsPage() {
    const [properties, setProperties] = useState([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({
        minPrice: '',
        maxPrice: '',
        bedrooms: '',
        location: ''
    })

    const fetchProperties = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (filters.minPrice) params.append('minPrice', filters.minPrice)
            if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)
            if (filters.bedrooms) params.append('bedrooms', filters.bedrooms)
            if (filters.location) params.append('location', filters.location)

            const response = await fetch(`/api/properties?${params}`)
            const data = await response.json()
            setProperties(data)
        } catch (error) {
            console.error('Error fetching properties:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProperties()
    }, [])

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    const applyFilters = () => {
        fetchProperties()
    }

    const clearFilters = () => {
        setFilters({
            minPrice: '',
            maxPrice: '',
            bedrooms: '',
            location: ''
        })
        setTimeout(fetchProperties, 100)
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(price)
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
                            <Link href="/listings" className="nav-link active">
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
                <div className="page-header">
                    <h1 className="page-title">Property Listings</h1>
                    <p className="page-description">
                        Find your perfect property from our available listings
                    </p>
                </div>

                {/* Filters */}
                <div className="filters">
                    <div className="filters-grid">
                        <div className="form-group">
                            <label className="form-label">Min Price</label>
                            <input
                                type="number"
                                className="form-input"
                                placeholder="Min price"
                                value={filters.minPrice}
                                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Max Price</label>
                            <input
                                type="number"
                                className="form-input"
                                placeholder="Max price"
                                value={filters.maxPrice}
                                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Bedrooms</label>
                            <select
                                className="form-select"
                                value={filters.bedrooms}
                                onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                            >
                                <option value="">Any</option>
                                <option value="1">1+</option>
                                <option value="2">2+</option>
                                <option value="3">3+</option>
                                <option value="4">4+</option>
                                <option value="5">5+</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Location</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="City or area"
                                value={filters.location}
                                onChange={(e) => handleFilterChange('location', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="filter-buttons">
                        <button onClick={applyFilters} className="btn btn-primary">
                            Apply Filters
                        </button>
                        <button onClick={clearFilters} className="btn btn-secondary">
                            Clear Filters
                        </button>
                    </div>
                </div>

                {/* Results */}
                {loading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <>
                        <p className="mb-4 text-light">
                            {properties.length} properties found
                        </p>

                        {properties.length === 0 ? (
                            <div className="text-center p-8">
                                <h3 className="mb-2">No properties found</h3>
                                <p className="text-light">Try adjusting your filters</p>
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
                                                <Link
                                                    href={`/listings/${property._id}`}
                                                    className="btn btn-primary"
                                                >
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </main>
        </>
    )
}
