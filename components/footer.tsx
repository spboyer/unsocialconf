import Link from "next/link"

export default function Footer() {
  return (
    <footer className="footer bg-light">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 mb-4 mb-lg-0">
            <div className="d-flex align-items-center mb-3">
              <i className="fas fa-comments text-primary me-2 fa-2x"></i>
              <h5 className="mb-0 fw-bold">Unconference</h5>
            </div>
            <p className="text-muted">
              A community-driven platform for organizing and participating in unconference events.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-muted">
                <i className="fab fa-twitter fa-lg"></i>
              </a>
              <a href="#" className="text-muted">
                <i className="fab fa-facebook fa-lg"></i>
              </a>
              <a href="#" className="text-muted">
                <i className="fab fa-linkedin fa-lg"></i>
              </a>
              <a href="#" className="text-muted">
                <i className="fab fa-github fa-lg"></i>
              </a>
            </div>
          </div>

          <div className="col-lg-2 col-md-4 mb-4 mb-md-0">
            <h6 className="fw-bold mb-3">Navigation</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link href="/" className="text-decoration-none text-muted">
                  <i className="fas fa-chevron-right me-1 small"></i> Home
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/#sessions" className="text-decoration-none text-muted">
                  <i className="fas fa-chevron-right me-1 small"></i> Sessions
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/submit" className="text-decoration-none text-muted">
                  <i className="fas fa-chevron-right me-1 small"></i> Submit
                </Link>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none text-muted">
                  <i className="fas fa-chevron-right me-1 small"></i> About
                </a>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-4 mb-4 mb-md-0">
            <h6 className="fw-bold mb-3">Resources</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-decoration-none text-muted">
                  <i className="fas fa-chevron-right me-1 small"></i> FAQ
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none text-muted">
                  <i className="fas fa-chevron-right me-1 small"></i> Support
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none text-muted">
                  <i className="fas fa-chevron-right me-1 small"></i> Terms
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none text-muted">
                  <i className="fas fa-chevron-right me-1 small"></i> Privacy
                </a>
              </li>
            </ul>
          </div>

          <div className="col-lg-4 col-md-4">
            <h6 className="fw-bold mb-3">Stay Updated</h6>
            <p className="text-muted mb-3">Subscribe to our newsletter for updates on upcoming events.</p>
            <div className="input-group mb-3">
              <input type="email" className="form-control" placeholder="Your email" />
              <button className="btn btn-primary" type="button">
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>

        <hr className="my-4" />

        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <p className="text-muted mb-0">&copy; {new Date().getFullYear()} Unconference. All rights reserved.</p>
          </div>
          <div className="col-md-6 text-center text-md-end mt-3 mt-md-0">
            <img
              src="/placeholder.svg?height=30&width=120"
              alt="Payment methods"
              className="img-fluid"
              style={{ maxHeight: "30px" }}
            />
          </div>
        </div>
      </div>
    </footer>
  )
}
