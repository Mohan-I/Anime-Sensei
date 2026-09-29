import { FaDiscord, FaTwitter, FaYoutube, FaMedium } from "react-icons/fa";

const socialLinks = [
  { href: "https://discord.com", icon: <FaDiscord /> },
  { href: "https://twitter.com", icon: <FaTwitter /> },
  { href: "https://youtube.com", icon: <FaYoutube /> },
  { href: "https://medium.com", icon: <FaMedium /> },
];

const Footer = () => {
  return (
    <footer className='w-screen bg-[#5542ff] py-4 text-teal-200'>
      <div className='container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row'>
        <p className='text-center font-bold text-sm font-light md:text-left'>
          © <a 
          href='https://www.bing.com/ck/a?!&&p=f2dd0ff60e743eee83b03a98e7d9fa58add16ecafe0b6e82e21170866793ae3eJmltdHM9MTczNTc3NjAwMA&ptn=3&ver=2&hsh=4&fclid=2e06b968-bbfc-6001-1b32-ad88ba4e617f&psq=mohan+yadav+developer&u=a1aHR0cHM6Ly9pbi5saW5rZWRpbi5jb20vaW4vbW9oYW4teWFkYXYtZGV2ZWxvcGVy&ntb=1'
          target='_blank'
          rel='noopener noreferrer'
          className='text-teal-200 transition-colors duration-500 ease-in-out hover:text-white'
          >Anime Sensei</a>  2025. All rights reserved.
        </p>

        <div className='flex justify-center gap-4  md:justify-start'>
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target='_blank'
              rel='noopener noreferrer'
              className='text-teal-200 transition-colors duration-500 ease-in-out hover:text-white'
            >
              {link.icon}
            </a>
          ))}
        </div>

        <div className='text-center text-bold text-sm font-light md:text-left gap-4'>
        <a
          href='/terms'
          className='text-center px-2 text-sm hover:text-white md:text-right'
        >
          Terms and Conditions
        </a>
        <a
          href='/carrers'
          className='text-center px-2 text-sm hover:text-white md:text-right'
        >
          Carrers
        </a>
        <a
          href='/privacy-policy'
          className='text-center px-2 text-sm hover:text-white md:text-right'
        >
          Privacy Policy
        </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer