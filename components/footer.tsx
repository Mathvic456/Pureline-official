import Link from "next/link"
import { Instagram, Facebook, Twitter, Phone, Mail, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="text-2xl font-serif tracking-wider">
              Pureline Designs
            </Link>
            <p className="mt-4 text-primary-foreground/70 text-sm leading-relaxed">
              Creating sophisticated, timeless interiors that reflect your personal style and elevate your lifestyle.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="hover:opacity-60 transition-opacity" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:opacity-60 transition-opacity" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:opacity-60 transition-opacity" aria-label="Twitter">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-medium tracking-wider uppercase mb-6">Services</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/services" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
                  Residential Design
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
                  Commercial Spaces
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
                  Luxury Interiors
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
                  Design Consultation
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-medium tracking-wider uppercase mb-6">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
                  Our Portfolio
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-medium tracking-wider uppercase mb-6">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-primary-foreground/70" />
                <span className="text-primary-foreground/70 text-sm">(+234) 81653994444</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-primary-foreground/70" />
                <span className="text-primary-foreground/70 text-sm">Purelinedesignss@gmail.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin size={16} className="text-primary-foreground/70 mt-1 flex-shrink-0" />
                <span className="text-primary-foreground/70 text-sm">
                  Port Harcourt<br />
                  Rivers State<br />
                  Nigeria
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/60 text-xs">
              &copy; {new Date().getFullYear()} Pureline Designs. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-xs">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-xs">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
