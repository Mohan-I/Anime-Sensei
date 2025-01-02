import React from "react"
import PropTypes from "prop-types"

const AboutUs = ({ title, bgImage, subtitle }) => {
  return (
    <section
      className="bg-cover bg-center text-center py-48 px-6"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <h3 className="relative inline-block text-white text-4xl font-bold uppercase glitch">
        <span aria-hidden="true">{title}</span>{title}<span aria-hidden="true">{title}</span>
      </h3>
      {subtitle && (
        <div className="font-robert-regular text-sm text-white text-brand font-semibold">
          {subtitle}
        </div>
      )}
    </section>
  );
};

// Prop Types validation
AboutUs.propTypes = {
  title: PropTypes.string.isRequired,
  bgImage: PropTypes.string.isRequired,
  subtitle: PropTypes.string
};

// Default props
AboutUs.defaultProps = {
  subtitle: "Anime Sensei" // Default subtitle text
};

export default AboutUs;
