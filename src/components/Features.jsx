import { TiLocationArrow } from "react-icons/ti";
import { useState, useRef } from 'react'

const FeatureCard = ({ src, title, description, isComingSoon }) => {
  return (
    <div className="relative size-full">
      <video
        src={src}
        className="absolute left-0 top-0 size-full object-cover object-center"
        loop
        muted
        autoPlay
      />
      <div className="relative z-10 flex size-full flex-col justify-between p-4 text-blue-50">
        <div>
          <h1 className="feature-title special-font">{title}</h1>
          {description && (
            <p className="mt-4 max-w-64 text-xs md:text-base">{description}</p>
          )}
        </div>
      </div>
      {title}
    </div>
  );
};

export const FeatureTilt = ({ children, className = "" }) => {
    const [transformStyle, setTransformStyle] = useState("");
    const itemRef = useRef(null);
  
    const handleMouseMove = (event) => {
      if (!itemRef.current) return;
  
      const { left, top, width, height } =
        itemRef.current.getBoundingClientRect();
  
      const relativeX = (event.clientX - left) / width;
      const relativeY = (event.clientY - top) / height;
  
      const tiltX = (relativeY - 0.5) * 5;
      const tiltY = (relativeX - 0.5) * -5;
  
      const newTransform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(.98, .98, .98)`;
      setTransformStyle(newTransform);
    };
  
    const handleMouseLeave = () => {
      setTransformStyle("");
    };

    return (
        <div
          ref={itemRef}
          className={className}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ transform: transformStyle }}
        >
          {children}
        </div>
      );
    };

const Features = () => {
  return (
    <section className="bg-black py-48">
      <div className="container mx-auto px-3 md:px-10">
        <div className="px-4 py-28">
          <p className="font-circular-web text-lg text-blue-50">
            Into the Sensei's School
          </p>
        
        <p className="max-w-md font-circular-web text-lg text-blue-50 opacity-50">
          Immerse yourself in a rich and ever-expanding ecosystem where a
          vibrant array of animes converge into an interconnected universe.
        </p>
      </div>

      <FeatureTilt className="border-hsla relative mb-8 h-96 w-full overflow-hidden rounded-md md md:h-[65vh]">
        <FeatureCard
          src="videos/feature-1.mp4"
          title={
            <>
             be <br/> i<b>m</b><b>a</b>gi<b>n</b>ative
            </>
          }
          description="Feel imaginative combination of graphic art, characterization, cinematography with individualistic stories"
          isComingSoon
        />
      </FeatureTilt>

      <div className='grid h-[140vh] grid-cols-2 grid-rows-4 gap-8'>

        <FeatureTilt className='feature-tilt_1 row-span-1 md:col-span-1 md:row-span-2'>
        <FeatureCard
          src="videos/feature-2.mp4"
          title={
            <>
              <b>have</b> p<b>e</b>rsp<b>e</b>ctiv<b>e</b>
            </>
          }
          description="Learn valuable life lessons through character development."
          isComingSoon
        />
        </FeatureTilt>

        <FeatureTilt className='feature-tilt_1 row-span-1 ms-28 md:col-span-1 md:ms-0'>
        <FeatureCard
          src="videos/feature-4.mp4"
          title={
            <>
             Be S<b>u</b>btl<b>e</b>
            </>
          }
          description="A simpliyfied social hub, characterized by colorful, detailed animations"
          isComingSoon
        />
        </FeatureTilt>

        <FeatureTilt className='feature-tilt_1 me-14 md:col-span-1 md:me-0'>
        <FeatureCard
          src="videos/feature-3.mp4"
          title={
            <>
              <b>Explore</b>
            </>
          }
          description="It's a unique lens into how people live their daily lives."
          isComingSoon
        />
        </FeatureTilt>

        <FeatureTilt className='feature-tilt-2'>
            <div className='flex size-full flex-col justify-between bg-violet-300 p-4'>
                <h1 className='feature-title special-font max-w-64 text-black'>a<b>n</b>d m<b>an</b>y mo<b>re</b>!</h1>
                <TiLocationArrow className='m-4 scale-[4] self-end'/>
            </div>
        </FeatureTilt>

        <FeatureTilt className='feature-tilt-2'>
            <video
             src="videos/feature-5.mp4"
             className='size-full object-cover object-center'
             loop
             muted 
             autoPlay
             />
        </FeatureTilt>

      </div>
      </div>
    </section>
  );
};

export default Features;
