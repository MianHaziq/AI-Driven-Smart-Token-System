import { motion } from 'framer-motion';
import { FiTarget, FiEye, FiUsers, FiAward } from 'react-icons/fi';
import { Card } from '../../components/common';

const About = () => {
  const team = [
    {
      name: 'Muhammad Taimoor Khadim',
      role: 'Full Stack Developer',
      image: null,
    },
    {
      name: 'Hussnain Shoukat',
      role: 'Full Stack Developer',
      image: null,
    },
  ];

  const values = [
    {
      icon: FiTarget,
      title: 'Our Mission',
      description:
        'To eliminate the frustration of long queues in Pakistani public services by providing an intelligent, user-friendly queue management system.',
    },
    {
      icon: FiEye,
      title: 'Our Vision',
      description:
        'To become the leading queue management platform in Pakistan, making public services more accessible and efficient for all citizens.',
    },
    {
      icon: FiUsers,
      title: 'Our Values',
      description:
        'Innovation, accessibility, reliability, and commitment to improving the daily lives of Pakistani citizens through technology.',
    },
    {
      icon: FiAward,
      title: 'Our Goal',
      description:
        'To save millions of hours wasted in queues every year and bring digital transformation to government services across Pakistan.',
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-pakistan !py-20">
        <div className="max-w-7xl mx-auto !px-4 sm:!px-6 lg:!px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-white !mb-6">
              About Smart Queue Pakistan
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              A Final Year Project by students of University of Central Punjab,
              designed to revolutionize queue management in Pakistan.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="!py-20">
        <div className="max-w-7xl mx-auto !px-4 sm:!px-6 lg:!px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 !gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <div className="w-12 h-12 bg-pakistan-green-50 rounded-xl flex items-center justify-center !mb-4">
                    <value.icon className="w-6 h-6 text-pakistan-green" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 !mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="!py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto !px-4 sm:!px-6 lg:!px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 !mb-6">
                The Problem We're Solving
              </h2>
              <p className="text-lg text-gray-600 !mb-8">
                Every day, millions of Pakistanis waste hours standing in queues at
                government offices, banks, and hospitals. This leads to:
              </p>
              <div className="grid sm:grid-cols-3 !gap-6 text-left">
                <Card>
                  <p className="text-3xl font-bold text-pakistan-green !mb-2">4-6 hrs</p>
                  <p className="text-gray-600">Average time spent waiting in queues</p>
                </Card>
                <Card>
                  <p className="text-3xl font-bold text-pakistan-green !mb-2">40%</p>
                  <p className="text-gray-600">Of people leave due to long waits</p>
                </Card>
                <Card>
                  <p className="text-3xl font-bold text-pakistan-green !mb-2">₨ Billions</p>
                  <p className="text-gray-600">Lost in productivity annually</p>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="!py-20">
        <div className="max-w-7xl mx-auto !px-4 sm:!px-6 lg:!px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center !mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 !mb-4">Our Team</h2>
            <p className="text-gray-600">
              University of Central Punjab - Group ID: F25SE061
            </p>
          </motion.div>

          <div className="flex justify-center !gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-32 h-32 bg-pakistan-green-50 rounded-full flex items-center justify-center mx-auto !mb-4">
                  <span className="text-4xl font-bold text-pakistan-green">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {member.name}
                </h3>
                <p className="text-gray-600">{member.role}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600">
              <strong>Project Advisor:</strong> Ms. Sarah Javaid
            </p>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Technology Stack
            </h2>
            <p className="text-gray-600">Built with modern, scalable technologies</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {['React', 'Node.js', 'MongoDB', 'Socket.IO', 'Tailwind', 'Express'].map(
              (tech, index) => (
                <motion.div
                  key={tech}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="text-center py-6">
                    <p className="font-semibold text-gray-900">{tech}</p>
                  </Card>
                </motion.div>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
