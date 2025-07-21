import Link from 'next/link'

export default function HomePage() {
  return (
    <>
      <nav className="nav">
        <div className="container">
          <div className="nav-content">
            <Link href="/" className="nav-brand">
              ProperView
            </Link>
            <div className="nav-links">
              <Link href="/" className="nav-link active">
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
        <section className="page-header text-center p-8">
          <h1 className="page-title">Find Your Dream Property</h1>
          <p className="page-description">
            Browse premium real estate listings from top agents
          </p>
        </section>

        <section className="grid grid-3 mb-4">
          <div className="card text-center">
            <h3 className="mb-2">Browse Listings</h3>
            <p className="text-light mb-4">
              Explore available properties with advanced filtering options
            </p>
            <Link href="/listings" className="btn btn-primary">
              View Properties
            </Link>
          </div>

          <div className="card text-center">
            <h3 className="mb-2">Agent Dashboard</h3>
            <p className="text-light mb-4">
              Manage your property listings and track inquiries
            </p>
            <Link href="/agent/login" className="btn btn-secondary">
              Agent Login
            </Link>
          </div>

          <div className="card text-center">
            <h3 className="mb-2">Submit Inquiry</h3>
            <p className="text-light mb-4">
              Contact agents directly about properties that interest you
            </p>
            <Link href="/listings" className="btn btn-secondary">
              Get Started
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}