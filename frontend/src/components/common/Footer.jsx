import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram } from 'react-icons/fi';
import { APP_NAME, ROUTES } from '../../utils/constants';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Home', path: ROUTES.HOME },
    { label: 'About', path: ROUTES.ABOUT },
    { label: 'Contact', path: ROUTES.CONTACT },
    { label: 'Book Token', path: ROUTES.BOOK_TOKEN },
  ];

  const services = [
    'NADRA Services',
    'Passport Office',
    'Banking Services',
    'Hospital OPD',
    'Utility Bills',
  ];

  return (
    <footer className="bg-pakistan-green text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto !px-4 sm:!px-6 lg:!px-8 !py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 !gap-8">
          {/* Brand */}
          <div className="!space-y-4">
            <div className="flex items-center !space-x-3">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-2xl">SQ</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">{APP_NAME}</h3>
                <p className="text-sm text-white/70">Apki Baari, Apka Waqt</p>
              </div>
            </div>
            <p className="text-sm text-white/80 leading-relaxed">
              AI-Driven Smart Token System with Predictive Queue Management for
              Pakistani Government Offices, Banks, and Hospitals.
            </p>
            <div className="flex !space-x-3">
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <FiFacebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <FiTwitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <FiInstagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold !mb-4">Quick Links</h4>
            <ul className="!space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold !mb-4">Our Services</h4>
            <ul className="!space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <span className="text-white/80">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold !mb-4">Contact Us</h4>
            <ul className="!space-y-4">
              <li className="flex items-start !space-x-3">
                <FiMapPin className="w-5 h-5 !mt-0.5 text-gold" />
                <span className="text-white/80">
                  Islamabad, Pakistan
                </span>
              </li>
              <li className="flex items-center !space-x-3">
                <FiPhone className="w-5 h-5 text-gold" />
                <span className="text-white/80">+92 51 1234567</span>
              </li>
              <li className="flex items-center !space-x-3">
                <FiMail className="w-5 h-5 text-gold" />
                <span className="text-white/80">info@smartqueue.pk</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto !px-4 sm:!px-6 lg:!px-8 !py-4">
          <div className="flex flex-col md:flex-row justify-between items-center !space-y-2 md:!space-y-0">
            <p className="text-sm text-white/70">
              &copy; {currentYear} {APP_NAME}. All rights reserved.
            </p>
            <p className="text-sm text-white/70">
              University Final Year Project - UCP
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
