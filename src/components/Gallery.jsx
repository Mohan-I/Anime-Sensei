import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useGlobalContext } from '../context/Global'
import { TiArrowLeft } from 'react-icons/ti'

function Gallery() {
    const { getAnimePictures, pictures, characterName } = useGlobalContext();
    const { id } = useParams();

    // State for selected image index
    const [index, setIndex] = React.useState(0);

    const handleImageClick = (i) => {
        setIndex(i);
    };

    React.useEffect(() => {
        getAnimePictures(id);
    }, [id]);

    return (
        <div className="bg-gray-200 min-h-screen flex flex-col items-center mt-8">
            <h1 className="font-general uppercase pb-8 text-center text-black mt-20">
              ch<b>ar</b>ac<b>te</b>r  Gallery
            </h1>

            {/* Back button */}
            <div className="relative">
                <Link to="/" className="font-semibold border-2 border-red-200 px-2 rounded-full text-red-500 flex items-center gap-2">
                    <TiArrowLeft /> Back to Home
                </Link>
            </div>

            {/* Character's name */}
            {characterName && (
                <h2 className="mt-4 text-2xl font-semibold text-gray-700">{characterName}</h2>
            )}

            {/* Big Image */}
            <div className="inline-block p-8 my-8 bg-white rounded-lg border-4 border-gray-200">
                <img src={pictures[index]?.jpg.image_url} alt="" className="w-[350px]" />
            </div>

            {/* Small Images */}
            <div className="flex flex-wrap gap-2 w-4/5 p-8 rounded-lg bg-white border-4 border-gray-200">
                {pictures?.map((picture, i) => (
                    <div
                        className="cursor-pointer"
                        onClick={() => handleImageClick(i)}
                        key={i}
                    >
                        <img
                            src={picture?.jpg.image_url}
                            alt=""
                            className={`w-24 h-24 object-cover rounded-lg border-4 ${i === index ? 'border-green-500 transform scale-110 grayscale-0' : 'border-gray-200 grayscale-60'} transition-all duration-300 ease-in-out`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Gallery;
