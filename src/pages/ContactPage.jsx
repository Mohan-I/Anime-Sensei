import React, { useEffect, useState } from 'react';
import GlitchText from '../components/ui/GlitchText';
import { gsap } from 'gsap';
import { motion } from "framer-motion";
import { TbAppWindow, TbCreditCard, TbFileReport, TbPlayCard } from 'react-icons/tb';
import { TiContacts } from 'react-icons/ti';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import PageHero from '../components/ui/PageHero';

const ContactPage = () => {
  const [formErrors, setFormErrors] = useState({});

  // Particle animation function
  const createParticles = () => {
    const particlesContainer = document.getElementById('particles-container');
    const numParticles = window.innerWidth > 768 ? 30 : 15;

    for (let i = 0; i < numParticles; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particlesContainer.appendChild(particle);

      gsap.set(particle, {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        opacity: Math.random() * 0.5 + 0.5,
        scale: Math.random() * 1.5 + 0.5,
        backgroundColor: `hsl(${Math.random() * 360}, 100%, 75%)`,
      });

      gsap.to(particle, {
        x: `+=${Math.random() * 200 - 100}`,
        y: `+=${Math.random() * 200 - 100}`,
        opacity: 0,
        repeat: -1,
        duration: Math.random() * 3 + 2,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }
  };

  useEffect(() => {
    createParticles();
  }, []);

  // Validate form inputs
  const validateForm = (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const subject = e.target.subject.value.trim();
    const message = e.target.message.value.trim();

    const errors = {};
    if (!email || !/\S+@\S+\.\S+/.test(email)) errors.email = 'Invalid email address.';
    if (!subject) errors.subject = 'Subject is required.';
    if (!message) errors.message = 'Message is required.';
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      console.log('Form submitted:', { email, subject, message });
      alert('Your message has been sent successfully!');
      e.target.reset();
    }
  };

  // Popular Articles Component
const PopularArticles = () => {
  const articles = [
    {
      icon: <TbFileReport />,
      category: 'Report & Ban',
      title: 'My account is banned',
      description:
        'If your account has been banned, it could be due to a violation of our terms of service. You can appeal the decision through our support center. Learn about possible reasons and recovery steps.',
      wordCount: 35,
      tags: ['Account', 'Ban'],
    },
    {
      icon: <TiContacts />,
      category: 'Account',
      title: 'I lost my account. What can I do?',
      description:
        'Lost access to your account? Follow our recovery process to regain control. Ensure you have the correct credentials and linked email or phone number for verification.',
      wordCount: 28,
      tags: ['Recovery'],
    },
    {
      icon: <TbCreditCard />,
      category: 'Payment and Refund',
      title: 'I want to see my purchase history.',
      description:
        'You can view your purchase history by logging into your account and navigating to the transactions section. This allows you to track your past payments and subscriptions.',
      wordCount: 30,
      tags: ['Payments'],
    },
    {
      icon: <TbPlayCard />,
      category: 'Anime Play',
      title: 'How can I quit a clan?',
      description:
        'To leave a clan, go to the clan settings in your profile, select the "Leave Clan" option, and confirm. Note that leaving may have consequences such as loss of clan perks.',
      wordCount: 31,
      tags: ['Gameplay'],
    },
    {
      icon: <TbAppWindow />,
      category: 'Installing and Running Application',
      title: "Anime won't run",
      description:
        'If the application fails to run, check system requirements, update drivers, and ensure a stable internet connection. Try reinstalling if the issue persists.',
      wordCount: 27,
      tags: ['Technical'],
    },
    {
      icon: <TbPlayCard />,
      category: 'Anime Play',
      title: 'How can I add a friend?',
      description:
        'To add a friend, go to the social menu, search for their username, and send a request. Once accepted, you can chat and play together.',
      wordCount: 25,
      tags: ['Gameplay'],
    },
  ];

    return (
      <section className="bg-gray-100 p-6">
      <motion.h2
        className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Popular Articles For Common Queries
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <motion.div
            key={index}
            className="rounded-lg bg-gradient-to-bl from-blue-800 to-slate-800 shadow-2xl border-4 p-4 
                       transform transition-all hover:scale-105 hover:shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            whileHover={{ scale: 1.07, boxShadow: "0px 10px 15px rgba(0, 0, 0, 0.3)" }}
          >
            <motion.h3
              className="text-lg flex gap-2 border p-2 m-2 rounded-full font-semibold mb-2 relative 
                         bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              <span className="bg-violet-600 p-2 text-white rounded-full">{article.icon}</span>
              {article.category}
            </motion.h3>

            <details className="group">
              <summary className="text-blue-50 font-general cursor-pointer hover:text-blue-300 transition-all">
                {article.title}
              </summary>
              <motion.p
                className="text-white p-4 m-4 bg-slate-700 rounded-lg shadow-inner"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {article.description}
              </motion.p>
            </details>

            <div className="mt-2 flex gap-2">
              {article.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-blue-500 text-white rounded px-3 py-1 transition-all transform hover:scale-105"
                >
                 # {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
    );
  };

  // FAQ Accordion Component
  const FAQs = () => {
    const faqData = [
      { question: 'How do I reset my password?', answer: 'You can reset your password by clicking on the "Forgot Password" link on the login page.' },
      { question: 'What are the payment methods?', answer: 'We accept credit cards, PayPal, and Google Pay.' },
      { question: 'How can I cancel my subscription?', answer: 'Navigate to your account settings and select "Cancel Subscription".' },
    ];

    return (
      <section className="bg-gray-100 p-4">
        <h2 className="text-2xl font-general text-center mb-4">FAQs</h2>
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <details key={index} className="p-4 bg-white shadow-md rounded-lg">
              <summary className="cursor-pointer p-2 font-general">{faq.question}</summary>
              <p className="mt-2 text-gray-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="relative">
      <GlitchText
        title="Contact Us"
        bgImage="./img/guy.gif"
        subtitle="What We Do"
      />

      {/* Particle Background */}
      <div id="particles-container" className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"></div>

      <section className="bg-white dark:bg-gray-900 relative z-10">
        <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
        <PageHero
        title="C<b>o</b>nt<b>a</b>ct Us"
        containerClass="my-14 pointer-events-none mix-blend-difference relative z-10"
      />
          <p className="mb-8 lg:mb-16 font-general text-center text-gray-500 dark:text-gray-400 sm:text-xl">
            Got a technical issue? Want to send feedback about a beta feature?
            Need details about our Business plan? Let us know.
          </p>

          {/* Form Section */}
          <form className="space-y-8" onSubmit={validateForm}>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                Your email
              </label>
              <input
                type="email"
                id="email"
                className={`shadow-lg bg-gray-50 border ${
                  formErrors.email ? 'border-red-500' : 'border-gray-300'
                } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
                placeholder="name@example.com"
                required
              />
              {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
            </div>

            <div>
              <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                className={`shadow-lg bg-gray-50 border ${
                  formErrors.subject ? 'border-red-500' : 'border-gray-300'
                } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
                placeholder="Let us know how we can help you"
                required
              />
              {formErrors.subject && <p className="text-red-500 text-sm mt-1">{formErrors.subject}</p>}
            </div>

            <div>
              <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">
                Your message
              </label>
              <textarea
                id="message"
                rows={6}
                className={`shadow-lg bg-gray-50 border ${
                  formErrors.message ? 'border-red-500' : 'border-gray-300'
                } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
                placeholder="Leave a comment..."
                required
              />
              {formErrors.message && <p className="text-red-500 text-sm mt-1">{formErrors.message}</p>}
            </div>

            <button
              type="submit"
              className="py-3 px-5 text-sm font-medium text-center text-white rounded-lg bg-blue-600 sm:w-fit hover:bg-blue-700"
            >
              Send message
            </button>
          </form>
        </div>

        <PopularArticles />
        <FAQs />

        <section className="bg-gray-200 py-8">
          <h2 className="text-center text-2xl font-bold">Contact Information</h2>
          <div className="mt-4 text-center">
            <p>Email: contact@animesensei.com</p>
            <p>Phone: +1 (555) 123-4567</p>
            <p>Address: 123 Anime Street, Tokyo, Japan</p>
          </div>

          <div className="flex justify-center mt-4 gap-4 text-xl">
            <FaFacebook className="cursor-pointer hover:text-blue-600" />
            <FaTwitter className="cursor-pointer hover:text-blue-400" />
            <FaInstagram className="cursor-pointer hover:text-pink-500" />
            <FaLinkedin className="cursor-pointer hover:text-blue-700" />
          </div>
        </section>

        <section className="bg-gray-200 py-8">
          <iframe
            className="w-full h-96"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12624.999998648938!2d139.73279467614975!3d35.689487500000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188c0d2aeb9bcb%3A0x9a2d566f8c001a73!2sAnime%20World!5e0!3m2!1sen!2sjp!4v16766401234"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </section>
      </section>
    </div>
  );
};

export default ContactPage;
