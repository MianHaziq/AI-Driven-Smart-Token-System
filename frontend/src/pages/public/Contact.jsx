import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiSend,
  FiCheckCircle,
} from 'react-icons/fi';
import { Button, Input, Card, Alert } from '../../components/common';

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess(true);
      reset();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: FiMapPin,
      title: 'Address',
      content: 'University of Central Punjab, Lahore, Pakistan',
    },
    {
      icon: FiPhone,
      title: 'Phone',
      content: '+92 42 1234567',
    },
    {
      icon: FiMail,
      title: 'Email',
      content: 'contact@smartqueue.pk',
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
              Contact Us
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Have questions or feedback? We'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="!py-20">
        <div className="max-w-7xl mx-auto !px-4 sm:!px-6 lg:!px-8">
          <div className="grid lg:grid-cols-2 !gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card>
                <h2 className="text-2xl font-bold text-gray-900 !mb-6">
                  Send us a Message
                </h2>

                {success && (
                  <Alert variant="success" className="!mb-6">
                    <div className="flex items-center">
                      <FiCheckCircle className="!mr-2" />
                      Your message has been sent successfully!
                    </div>
                  </Alert>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="!space-y-4">
                  <div className="grid sm:grid-cols-2 !gap-4">
                    <Input
                      label="Your Name"
                      placeholder="Ahmed Khan"
                      error={errors.name?.message}
                      {...register('name', {
                        required: 'Name is required',
                      })}
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="your@email.com"
                      error={errors.email?.message}
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address',
                        },
                      })}
                    />
                  </div>

                  <Input
                    label="Subject"
                    placeholder="How can we help?"
                    error={errors.subject?.message}
                    {...register('subject', {
                      required: 'Subject is required',
                    })}
                  />

                  <div className="!mb-4">
                    <label className="block text-sm font-medium text-gray-700 !mb-1.5">
                      Message
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Write your message here..."
                      className={`
                        block w-full rounded-lg border transition-all duration-200
                        !px-4 !py-2.5
                        ${
                          errors.message
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-pakistan-green focus:ring-pakistan-green'
                        }
                        focus:outline-none focus:ring-2 focus:ring-opacity-20
                        placeholder:text-gray-400
                      `}
                      {...register('message', {
                        required: 'Message is required',
                        minLength: {
                          value: 10,
                          message: 'Message must be at least 10 characters',
                        },
                      })}
                    />
                    {errors.message && (
                      <p className="!mt-1.5 text-sm text-red-500">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    loading={loading}
                    icon={FiSend}
                    iconPosition="right"
                  >
                    Send Message
                  </Button>
                </form>
              </Card>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="!space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-900 !mb-6">
                  Get in Touch
                </h2>
                <p className="text-gray-600 !mb-8">
                  We're here to help! Reach out to us through any of the following
                  channels or fill out the contact form.
                </p>
              </div>

              {contactInfo.map((info, index) => (
                <Card key={info.title} className="flex items-start !space-x-4">
                  <div className="w-12 h-12 bg-pakistan-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <info.icon className="w-6 h-6 text-pakistan-green" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{info.title}</h3>
                    <p className="text-gray-600">{info.content}</p>
                  </div>
                </Card>
              ))}

              {/* Map Placeholder */}
              <Card padding="none" className="overflow-hidden">
                <div className="h-64 bg-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <FiMapPin className="w-12 h-12 text-gray-400 mx-auto !mb-2" />
                    <p className="text-gray-500">Map Integration</p>
                    <p className="text-sm text-gray-400">Coming Soon</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="!py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto !px-4 sm:!px-6 lg:!px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center !mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 !mb-4">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="!space-y-4">
            {[
              {
                q: 'Is Smart Queue Pakistan free to use?',
                a: 'Yes! Our service is completely free for citizens. Service centers may have their own subscription plans.',
              },
              {
                q: 'How accurate are the wait time predictions?',
                a: 'Our AI-powered system provides estimates with 90%+ accuracy based on historical data and real-time factors.',
              },
              {
                q: 'Can I cancel my token after booking?',
                a: 'Yes, you can cancel your token anytime before your turn through the app or website.',
              },
              {
                q: 'What if I miss my turn?',
                a: "If you don't show up within 5 minutes of being called, you'll be marked as a no-show. You can book a new token.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <h3 className="font-semibold text-gray-900 !mb-2">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
