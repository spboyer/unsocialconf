import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        <Link href="/" className="navbar-brand d-flex align-items-center">
          <i className="fas fa-comments text-primary me-2 fa-lg"></i>
          <span className="fw-bold">Unconference</span>
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link href="/" className="nav-link">
                <i className="fas fa-home me-1"></i> Home
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/#sessions" className="nav-link">
                <i className="fas fa-calendar-alt me-1"></i> Sessions
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/submit" className="nav-link">
                <i className="fas fa-plus-circle me-1"></i> Submit
              </Link>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                <i className="fas fa-info-circle me-1"></i> About
              </a>
            </li>
          </ul>
          <div className="d-flex ms-lg-3">
            <button className="btn btn-outline-primary">
              <i className="fas fa-user me-1"></i> Sign In
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
