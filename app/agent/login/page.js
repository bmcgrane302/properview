'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AgentLoginPage() {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        let agentData = null

        // Support multiple demo agents
        if (credentials.email === 'agent@properview.com' && credentials.password === 'demo123') {
            agentData = {
                id: 'agent1',
                email: credentials.email,
                name: 'John Smith',
                role: 'Senior Agent'
            }
        } else if (credentials.email === 'agent2@properview.com' && credentials.password === 'demo123') {
            agentData = {
                id: 'agent2',
                email: credentials.email,
                name: 'Sarah Johnson',
                role: 'Real Estate Agent'
            }
        } else if (credentials.email === 'agent3@properview.com' && credentials.password === 'demo123') {
            agentData = {
                id: 'agent3',
                email: credentials.email,
                name: 'Mike Wilson',
                role: 'Property Specialist'
            }
        }

        if (agentData) {
            localStorage.setItem('agentSession', JSON.stringify(agentData))
            router.push('/agent/dashboard')
        } else {
            setError('Invalid credentials. Try one of the demo accounts below.')
        }

        setLoading(false)
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
                        </div>
                    </div>
                </div>
            </nav>

            <main className="container">
                <div style={{ maxWidth: '500px', margin: '4rem auto' }}>
                    <div className="card">
                        <h1 className="text-center mb-4">Agent Login</h1>

                        {error && (
                            <div style={{
                                background: '#fee2e2',
                                color: '#991b1b',
                                padding: '0.75rem',
                                borderRadius: '0.375rem',
                                marginBottom: '1rem',
                                border: '1px solid #fecaca'
                            }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={credentials.email}
                                    onChange={(e) => setCredentials(prev => ({
                                        ...prev,
                                        email: e.target.value
                                    }))}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-input"
                                    value={credentials.password}
                                    onChange={(e) => setCredentials(prev => ({
                                        ...prev,
                                        password: e.target.value
                                    }))}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ width: '100%' }}
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>

                        <div className="mt-4 p-4" style={{
                            background: '#f1f5f9',
                            borderRadius: '0.375rem',
                            border: '1px solid #e2e8f0'
                        }}>
                            <h4 className="mb-2" style={{ fontSize: '1rem', fontWeight: '600' }}>Demo Agent Accounts</h4>

                            <div style={{ marginBottom: '1rem' }}>
                                <p style={{ margin: '0.25rem 0', fontWeight: '500' }}>John Smith (Senior Agent)</p>
                                <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                                    <strong>Email:</strong> agent@properview.com
                                </p>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <p style={{ margin: '0.25rem 0', fontWeight: '500' }}>Sarah Johnson (Real Estate Agent)</p>
                                <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                                    <strong>Email:</strong> agent2@properview.com
                                </p>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <p style={{ margin: '0.25rem 0', fontWeight: '500' }}>Mike Wilson (Property Specialist)</p>
                                <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                                    <strong>Email:</strong> agent3@properview.com
                                </p>
                            </div>

                            <p style={{ margin: '0.5rem 0', fontSize: '0.9rem', fontStyle: 'italic' }}>
                                <strong>Password for all accounts:</strong> demo123
                            </p>
                        </div>

                        <div className="text-center mt-4">
                            <Link href="/" className="nav-link">
                                ← Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}