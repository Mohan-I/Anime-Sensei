import React, { useEffect, useState } from 'react';
import GlitchText from '../components/ui/GlitchText';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import { TbAppWindow, TbCreditCard, TbFileReport, TbPlayCard, TbClock, TbShieldCheck, TbHeadset } from 'react-icons/tb';
import { TiContacts } from 'react-icons/ti';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { FiChevronDown, FiMail, FiPhone, FiMapPin, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import PageHero from '../components/ui/PageHero';

const ContactPage = () => {
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({ email: '', subject: '', message: '' });
  const [openFaq, setOpenFaq] = useState(null);

  // Particle animation
  useEffect(() => {
    const particlesContainer = document.getElementById('particles-container');
    if (!particlesContainer) return;
    
    const numParticles = window.innerWidth > 768 ? 25 : 12;
    const particles = [];

    for (let i = 0; i < numParticles; i++) {
      const particle = document.createElement('div');
      particle.classList.add('absolute', 'rounded-full');
      particlesContainer.appendChild(particle);
      particles.push(particle);

      gsap.set(particle, {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        opacity: Math.random() * 0.3 + 0.1,
        width: Math.random() * 3 + 1,
        height: Math.random() * 3 + 1,
        backgroundColor: `hsl(${Math.random() * 40 + 250}, 100%, 75%)`,
      });

      gsap.to(particle, {
        x: `+=${Math.random() * 150 - 75}`,
        y: `+=${Math.random() * 150 - 75}`,
        opacity: 0,
        repeat: -1,
        duration: Math.random() * 5 + 4,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }

    return () => particles.forEach(p => p.remove());
  }, []);

  const validateForm = (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Please enter a valid email.';
    if (!formData.subject) errors.subject = 'Subject is required.';
    if (!formData.message) errors.message = 'Message cannot be empty.';
    
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      console.log('Form submitted:', formData);
      alert('Your message has been sent successfully!');
      setFormData({ email: '', subject: '', message: '' });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (formErrors[e.target.id]) {
      setFormErrors({ ...formErrors, [e.target.id]: null });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] font-sans selection:bg-violet-500/30">
      
      {/* Global Background Glow */}
      <div className="pointer-events-none fixed inset-0 z-0 flex justify-center">
        <div className="h-[500px] w-full max-w-4xl bg-[radial-gradient(ellipse_at_top,_rgba(139,92,246,0.15),_transparent_70%)]" />
      </div>

      <div id="particles-container" className="pointer-events-none fixed inset-0 z-0 overflow-hidden"></div>

      <main className="relative z-10">
        
        {/* =========================================
            HERO SECTION (GlitchText + PageHero)
        ========================================= */}
        <section className="relative">
          <GlitchText
            title="Contact Us"
            bgImage="./img/guy.gif"
            subtitle="What We Do"
          />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
            <div className="text-center">
              <PageHero
                title="Get&nbsp;I<b>n</b> To<b>u</b>ch"
                containerClass="my-10 pointer-events-none mix-blend-difference relative z-10"
              />
              <p className="mx-auto max-w-2xl text-base text-white/50 sm:text-lg">
                Got a technical issue, want to send feedback, or need details about our Business plan? 
                Let us know and we'll get back to you within 24 hours.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================
            SUPPORT STATS / TRUST BAR
        ========================================= */}
        <section className="border-y border-white/[0.06] bg-white/[0.01] py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {[
                { icon: <TbClock />, label: 'Avg. Response Time', value: '< 2 Hours' },
                { icon: <TbHeadset />, label: 'Support Availability', value: '24/7 Live Chat' },
                { icon: <TbShieldCheck />, label: 'Satisfaction Rate', value: '98% Positive' },
                { icon: <FiCheckCircle />, label: 'Tickets Resolved', value: '12,400+' },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-lg text-violet-400 border border-violet-500/20">
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">{stat.label}</p>
                    <p className="text-sm font-bold text-white">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================
            CONTACT FORM SECTION
        ========================================= */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
              
              {/* Left Side: Info Panel */}
              <div className="lg:col-span-2 space-y-10">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Contact Information</h3>
                  <p className="text-sm text-white/50 mb-6">Reach out to us through any of these channels.</p>
                  
                  <div className="space-y-5">
                    <div className="flex items-center gap-4 group">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.03] text-lg text-violet-400 border border-white/10 group-hover:bg-violet-500/10 group-hover:border-violet-400/30 transition-all">
                        <FiMail />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-white/40">Email</p>
                        <p className="text-sm font-medium text-white">contact@animesensei.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 group">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.03] text-lg text-violet-400 border border-white/10 group-hover:bg-violet-500/10 group-hover:border-violet-400/30 transition-all">
                        <FiPhone />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-white/40">Phone</p>
                        <p className="text-sm font-medium text-white">+1 (555) 123-4567</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 group">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.03] text-lg text-violet-400 border border-white/10 group-hover:bg-violet-500/10 group-hover:border-violet-400/30 transition-all">
                        <FiMapPin />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-white/40">Office</p>
                        <p className="text-sm font-medium text-white">123 Anime Street, Tokyo, Japan</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Socials */}
                <div>
                  <h4 className="text-[11px] font-semibold uppercase tracking-wider text-white/40 mb-4">Follow Us</h4>
                  <div className="flex gap-3">
                    {[
                      { icon: <FaTwitter />, color: 'hover:text-sky-400 hover:border-sky-400/30 hover:bg-sky-400/10' },
                      { icon: <FaInstagram />, color: 'hover:text-pink-400 hover:border-pink-400/30 hover:bg-pink-400/10' },
                      { icon: <FaLinkedin />, color: 'hover:text-blue-400 hover:border-blue-400/30 hover:bg-blue-400/10' },
                      { icon: <FaFacebook />, color: 'hover:text-blue-500 hover:border-blue-500/30 hover:bg-blue-500/10' }
                    ].map((social, i) => (
                      <a key={i} href="#" className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.03] border border-white/10 text-white/60 transition-all duration-200 ${social.color}`}>
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Additional content: Business hours */}
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <h4 className="text-sm font-bold text-white mb-3">Business Hours</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-white/50">
                      <span>Mon - Fri</span>
                      <span className="text-white/80 font-medium">9:00 AM - 6:00 PM JST</span>
                    </div>
                    <div className="flex justify-between text-white/50">
                      <span>Saturday</span>
                      <span className="text-white/80 font-medium">10:00 AM - 4:00 PM JST</span>
                    </div>
                    <div className="flex justify-between text-white/50">
                      <span>Sunday</span>
                      <span className="text-violet-400 font-medium">Closed (Email only)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Professional Form */}
              <div className="lg:col-span-3">
                <form onSubmit={validateForm} className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-xl sm:p-8 shadow-2xl shadow-black/50">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-1">Send us a message</h3>
                    <p className="text-sm text-white/40">Fill out the form and our team will get back to you shortly.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 mb-5">
                    <div>
                      <label htmlFor="email" className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-white/60">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full rounded-xl border bg-[#0a0a0f]/50 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all focus:bg-white/[0.04] focus:border-violet-400 focus:ring-1 focus:ring-violet-400/50 ${
                          formErrors.email ? 'border-red-500/50' : 'border-white/10'
                        }`}
                        placeholder="you@company.com"
                      />
                      {formErrors.email && <p className="mt-1.5 text-xs text-red-400">{formErrors.email}</p>}
                    </div>

                    <div>
                      <label htmlFor="subject" className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-white/60">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={`w-full rounded-xl border bg-[#0a0a0f]/50 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all focus:bg-white/[0.04] focus:border-violet-400 focus:ring-1 focus:ring-violet-400/50 ${
                          formErrors.subject ? 'border-red-500/50' : 'border-white/10'
                        }`}
                        placeholder="How can we help?"
                      />
                      {formErrors.subject && <p className="mt-1.5 text-xs text-red-400">{formErrors.subject}</p>}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="message" className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-white/60">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className={`w-full rounded-xl border bg-[#0a0a0f]/50 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all focus:bg-white/[0.04] focus:border-violet-400 focus:ring-1 focus:ring-violet-400/50 resize-none ${
                        formErrors.message ? 'border-red-500/50' : 'border-white/10'
                      }`}
                      placeholder="Tell us what you need help with..."
                    />
                    {formErrors.message && <p className="mt-1.5 text-xs text-red-400">{formErrors.message}</p>}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <p className="text-[11px] text-white/30">
                      By submitting, you agree to our <a href="#" className="text-violet-400 hover:underline">Privacy Policy</a>.
                    </p>
                    <button
                      type="submit"
                      className="group flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-600/20 transition-all hover:bg-violet-500 active:scale-[0.98]"
                    >
                      Send Message
                      <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            MAP SECTION
        ========================================= */}
        <section className="border-y border-white/[0.06] bg-[#0d0d12]">
          <div className="mx-auto max-w-7xl h-[400px]">
             <iframe
                title="Google Map Location"
                className="h-full w-full border-0 opacity-40 grayscale mix-blend-screen transition-all duration-700 hover:opacity-100 hover:grayscale-0"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6480.1362053267385!2d139.7671559936792!3d35.699941690324636!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188c1d829dd5cd%3A0x772f5995da208987!2sAkihabara%20Electric%20Town%2C%20Tokyo%2C%20Japan!5e0!3m2!1sen!2sin!4v1792166610241!5m2!1sen!2sin"
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
          </div>
        </section>

        {/* =========================================
            POPULAR ARTICLES (Light Theme)
        ========================================= */}
        <section className="bg-gray-50 py-20 px-4 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Popular Articles
              </h2>
              <p className="mt-3 text-lg text-gray-500">Quick answers to common questions.</p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: <TbFileReport />, category: 'Report & Ban', title: 'My account is banned', description: 'If your account has been banned, it could be due to a violation of our terms of service. You can appeal the decision through our support center.', tags: ['Account', 'Ban'] },
                { icon: <TiContacts />, category: 'Account', title: 'I lost my account. What can I do?', description: 'Lost access to your account? Follow our recovery process to regain control. Ensure you have the correct credentials and linked email.', tags: ['Recovery'] },
                { icon: <TbCreditCard />, category: 'Payment', title: 'I want to see my purchase history.', description: 'You can view your purchase history by logging into your account and navigating to the transactions section.', tags: ['Payments'] },
                { icon: <TbPlayCard />, category: 'Anime Play', title: 'How can I quit a clan?', description: 'To leave a clan, go to the clan settings in your profile, select the "Leave Clan" option, and confirm.', tags: ['Gameplay'] },
                { icon: <TbAppWindow />, category: 'Technical', title: "Anime won't run", description: 'If the application fails to run, check system requirements, update drivers, and ensure a stable internet connection.', tags: ['Technical'] },
                { icon: <TbPlayCard />, category: 'Anime Play', title: 'How can I add a friend?', description: 'To add a friend, go to the social menu, search for their username, and send a request.', tags: ['Gameplay'] },
              ].map((article, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-xl text-violet-600 transition-colors group-hover:bg-violet-600 group-hover:text-white">
                      {article.icon}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-violet-600">
                      {article.category}
                    </span>
                  </div>

                  <details className="group/details mt-auto">
                    <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-gray-900 marker:hidden">
                      {article.title}
                      <FiChevronDown className="text-gray-400 transition-transform duration-300 group-open/details:rotate-180" />
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-gray-600">
                      {article.description}
                    </p>
                  </details>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {article.tags.map((tag, idx) => (
                      <span key={idx} className="rounded-md bg-gray-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================
            FAQS (Light Theme)
        ========================================= */}
        <section className="bg-white py-20 px-4 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Frequently Asked Questions
              </h2>
              <p className="mt-3 text-lg text-gray-500">Everything you need to know about our platform.</p>
            </div>
            
            <div className="space-y-3">
              {[
                { question: 'How do I reset my password?', answer: 'You can reset your password by clicking on the "Forgot Password" link on the login page.' },
                { question: 'What are the payment methods?', answer: 'We accept credit cards, PayPal, and Google Pay.' },
                { question: 'How can I cancel my subscription?', answer: 'Navigate to your account settings and select "Cancel Subscription".' },
                { question: 'How do I report a user?', answer: 'Visit their profile, click the three dots in the top right corner, and select "Report".' },
                { question: 'Is there a mobile app available?', answer: 'Yes, our mobile app is available for both iOS and Android. You can download it from the App Store or Google Play Store.' },
                { question: 'How do I contact support for urgent issues?', answer: 'For urgent issues, use our live chat feature available 24/7, or email us at contact@animesensei.com with "URGENT" in the subject line.' },
              ].map((faq, index) => (
                <div key={index} className="overflow-hidden rounded-xl border border-gray-200 bg-white transition-colors hover:border-gray-300">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="flex w-full items-center justify-between p-5 text-left font-semibold text-gray-900"
                  >
                    {faq.question}
                    <FiChevronDown className={`shrink-0 transition-transform duration-300 ${openFaq === index ? 'rotate-180 text-violet-600' : 'text-gray-400'}`} />
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-sm leading-relaxed text-gray-600">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================
            FINAL CTA SECTION
        ========================================= */}
        <section className="bg-[#0a0a0f] py-20 px-4 sm:px-6 relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.1),_transparent_70%)]" />
          <div className="mx-auto max-w-4xl text-center relative z-10">
            <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
              Still need help?
            </h2>
            <p className="text-lg text-white/50 mb-8 max-w-2xl mx-auto">
              Can't find the answer you're looking for? Our dedicated support team is just one click away.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#contact-form"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-600/25 transition-all hover:bg-violet-500 active:scale-[0.98]"
              >
                Contact Support
                <FiArrowRight />
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-white/[0.08]"
              >
                Visit Help Center
              </a>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default ContactPage;