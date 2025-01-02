import React, { useEffect, useState } from 'react';
import GlitchText from '../components/ui/GlitchText';
import { gsap } from 'gsap';
import { TbAppWindow, TbCreditCard, TbFileReport, TbPlayCard } from 'react-icons/tb';
import { TiContacts } from 'react-icons/ti';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

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
      { icon: <TbFileReport />, category: 'Report & Ban', title: 'My account is banned', tags: ['Account', 'Ban'] },
      { icon: <TiContacts />, category: 'Account', title: 'I lost my account. What can I do?', tags: ['Recovery'] },
      { icon: <TbCreditCard />, category: 'Payment and Refund', title: 'I want to see my purchase history.', tags: ['Payments'] },
      { icon: <TbPlayCard />, category: 'Anime play', title: 'How can I quit a clan?', tags: ['Gameplay'] },
      { icon: <TbAppWindow />, category: 'Installing and Running Application', title: 'Anime won\'t run', tags: ['Technical'] },
      { icon: <TbPlayCard />, category: 'Anime play', title: 'How can I add a friend?', tags: ['Gameplay'] },
    ];

    return (
      <section className="bg-gray-100 p-4">
        <h2 className="text-2xl font-general font-bold mb-4 text-center">Popular Articles</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {articles.map((article, index) => (
            <div key={index} className="rounded-lg bg-gradient-to-bl from-blue-800 to-slate-800 shadow-xl border-4 p-4 transform transition-all hover:scale-105">
              <h3 className="text-lg flex gap-2 font-semibold mb-2 relative bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent font-semibold">
                <span className='bg-violet-600 p-4 text-white rounded-full'>{article.icon}</span>
                {article.category}
              </h3>
              <p className="text-blue-50">{article.title}</p>
              <div className="mt-2 flex gap-2">
                {article.tags.map((tag, idx) => (
                  <span key={idx} className="text-xs bg-blue-500 text-white rounded px-2 py-1">{tag}</span>
                ))}
              </div>
            </div>
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
        <h2 className="text-2xl font-bold text-center mb-4">FAQs</h2>
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <details key={index} className="p-4 bg-white shadow-md rounded-lg">
              <summary className="cursor-pointer font-medium">{faq.question}</summary>
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
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white">
            Contact Us
          </h2>
          <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">
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
