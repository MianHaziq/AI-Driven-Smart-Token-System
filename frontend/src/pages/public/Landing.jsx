import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiClock,
  FiMapPin,
  FiBell,
  FiTrendingUp,
  FiUsers,
  FiCheckCircle,
  FiArrowRight,
  FiPlay,
} from 'react-icons/fi';
import { Button, Card } from '../../components/common';
import { ROUTES, APP_NAME } from '../../utils/constants';

const Landing = () => {
  const features = [
    {
      icon: FiClock,
      title: 'AI Wait Time Prediction',
      description: 'Get accurate estimated wait times powered by machine learning algorithms.',
    },
    {
      icon: FiMapPin,
      title: 'Real-time Tracking',
      description: 'Track your position in the queue from anywhere with live updates.',
    },
    {
      icon: FiBell,
      title: 'Smart Notifications',
      description: 'Receive alerts when your turn is approaching. Never miss your slot.',
    },
    {
      icon: FiTrendingUp,
      title: 'Analytics Dashboard',
      description: 'Comprehensive insights for service providers to optimize operations.',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Select Service Center',
      description: 'Choose from NADRA, Banks, Hospitals, or other government offices.',
    },
    {
      num: '02',
      title: 'Choose Your Service',
      description: 'Select the specific service you need and see estimated wait time.',
    },
    {
      num: '03',
      title: 'Get Your Token',
      description: 'Receive a digital token with your queue position and QR code.',
    },
    {
      num: '04',
      title: 'Track & Arrive',
      description: 'Monitor your position and arrive just when it\'s your turn.',
    },
  ];

  const services = [
    { name: 'NADRA', icon: '🪪', desc: 'CNIC & Identity Services' },
    { name: 'Passport Office', icon: '📘', desc: 'Passport Applications' },
    { name: 'Banks', icon: '🏦', desc: 'Banking Services' },
    { name: 'Hospitals', icon: '🏥', desc: 'OPD Appointments' },
    { name: 'Utility Centers', icon: '💡', desc: 'Bill Payments' },
    { name: 'Excise Office', icon: '🚗', desc: 'Vehicle Registration' },
  ];

  const stats = [
    { value: '100K+', label: 'Tokens Served' },
    { value: '50+', label: 'Service Centers' },
    { value: '95%', label: 'Satisfaction Rate' },
    { value: '30min', label: 'Avg. Time Saved' },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-pakistan" />
        <div className="absolute inset-0 pattern-grid opacity-10" />

        <div className="relative max-w-7xl mx-auto !px-4 sm:!px-6 lg:!px-8 !py-20 lg:!py-32">
          <div className="grid lg:grid-cols-2 !gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center !px-4 !py-2 bg-white/10 rounded-full text-white text-sm !mb-6">
                <span className="w-2 h-2 bg-gold rounded-full !mr-2 animate-pulse" />
                Pakistan's Smart Queue System
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight !mb-6">
                {APP_NAME}
              </h1>

              <p className="text-xl text-white/80 !mb-4 font-urdu">
                "آپکی باری، آپکا وقت"
              </p>

              <p className="text-lg text-white/90 !mb-8 max-w-lg">
                AI-powered queue management for Pakistani government offices, banks, and hospitals.
                Book your token online, track in real-time, and arrive just when it's your turn.
              </p>

              <div className="flex flex-col sm:flex-row !gap-4">
                <Link to={ROUTES.BOOK_TOKEN}>
                  <Button size="lg" variant="gold" icon={FiArrowRight} iconPosition="right">
                    Book Token Now
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-pakistan-green">
                  <FiPlay className="!mr-2" />
                  Watch Demo
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 !gap-4 !mt-12">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="text-center"
                  >
                    <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs sm:text-sm text-white/70">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Content - Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                {/* Token Card */}
                <div className="bg-white rounded-2xl shadow-2xl !p-6 max-w-sm mx-auto">
                  <div className="flex items-center justify-between !mb-4">
                    <span className="text-sm text-gray-500">Your Token</span>
                    <span className="!px-3 !py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      Active
                    </span>
                  </div>
                  <div className="text-center !py-6">
                    <p className="text-6xl font-bold text-pakistan-green !mb-2">A-042</p>
                    <p className="text-gray-500">NADRA Office, Islamabad</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl !p-4 !mb-4">
                    <div className="flex justify-between text-sm !mb-2">
                      <span className="text-gray-500">Position</span>
                      <span className="font-semibold">3rd in Queue</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Est. Wait</span>
                      <span className="font-semibold text-pakistan-green">~15 mins</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-pakistan-green h-2 rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-4 -right-4 bg-gold text-white !px-4 !py-2 rounded-lg shadow-lg"
                >
                  <FiBell className="inline !mr-2" />
                  Your turn is next!
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="absolute -bottom-4 -left-4 bg-white !px-4 !py-2 rounded-lg shadow-lg"
                >
                  <FiCheckCircle className="inline !mr-2 text-green-500" />
                  Token confirmed
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="!py-20">
        <div className="max-w-7xl mx-auto !px-4 sm:!px-6 lg:!px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center !mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 !mb-4">
              Why Choose Smart Queue Pakistan?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Revolutionary features designed to eliminate long queues and save your valuable time.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 !gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="h-full text-center">
                  <div className="w-14 h-14 bg-pakistan-green-50 rounded-xl flex items-center justify-center mx-auto !mb-4">
                    <feature.icon className="w-7 h-7 text-pakistan-green" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 !mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="!py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto !px-4 sm:!px-6 lg:!px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center !mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 !mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Four simple steps to skip the queue and save your time.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 !gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="text-6xl font-bold text-pakistan-green/10 !mb-4">
                  {step.num}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 !mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>

                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full">
                    <div className="border-t-2 border-dashed border-pakistan-green/20 w-3/4" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="!py-20">
        <div className="max-w-7xl mx-auto !px-4 sm:!px-6 lg:!px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center !mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 !mb-4">
              Supported Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Available at major government offices and institutions across Pakistan.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 !gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card hover className="text-center !py-6">
                  <div className="text-4xl !mb-3">{service.icon}</div>
                  <h3 className="font-semibold text-gray-900 !mb-1">{service.name}</h3>
                  <p className="text-xs text-gray-500">{service.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="!py-20 bg-gradient-pakistan relative overflow-hidden">
        <div className="absolute inset-0 pattern-grid opacity-10" />
        <div className="relative max-w-4xl mx-auto !px-4 sm:!px-6 lg:!px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white !mb-6">
              Ready to Skip the Queue?
            </h2>
            <p className="text-xl text-white/80 !mb-8 max-w-2xl mx-auto">
              Join thousands of Pakistanis who are already saving time with Smart Queue Pakistan.
            </p>
            <div className="flex flex-col sm:flex-row !gap-4 justify-center">
              <Link to={ROUTES.REGISTER}>
                <Button size="lg" variant="gold">
                  Get Started Free
                </Button>
              </Link>
              <Link to={ROUTES.ABOUT}>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-pakistan-green">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
