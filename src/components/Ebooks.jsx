import React, { useState } from "react";
import { TiArrowForward, TiCalendar, TiTimes } from "react-icons/ti";
import { motion, AnimatePresence } from "framer-motion";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

// Configure PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

// Ebook Card Component
const EbookCard = ({ title, date, image, alt, onClick }) => {
  return (
    <motion.div
      className="md:w-1/3 h-64 md:px-2 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <div
        className="relative group h-full w-full cursor-pointer rounded-lg overflow-hidden shadow-lg"
        onClick={onClick}
      >
        <div className="relative h-full">
          <figure className="h-full">
            <img
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              src={image}
              alt={alt}
              loading="lazy"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/70"></div>
          </figure>
        </div>
        <div className="absolute bottom-0 left-0 w-full p-6 text-white">
          <motion.div
            className="flex flex-col"
            initial={{ y: 0 }}
            whileHover={{ y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center mb-2">
              <TiCalendar className="mr-2" />
              <p className="font-medium text-sm">{date}</p>
            </div>
            <h5 className="text-xl font-bold mb-3 line-clamp-2">{title}</h5>
          </motion.div>
          <motion.div
            className="flex items-center text-teal-300 font-medium"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            Read More <TiArrowForward className="ml-2" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// PDF Viewer Modal Component
const PdfViewerModal = ({ ebook, onClose }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] flex flex-col"
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        transition={{ type: "spring", damping: 25 }}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-bold">{ebook.title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <TiTimes className="text-2xl" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {/* PDF Viewer */}
          <div className="border rounded-lg overflow-hidden">
            <Document
              file={ebook.pdf}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={<div className="p-8 text-center">Loading PDF...</div>}
              error={
                <div className="p-8 text-center text-red-500">
                  PDF not available
                </div>
              }
            >
              <div className="p-4 items-center">
              <Page
                pageNumber={pageNumber}
                scale={scale}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
              </div>
            </Document>
          </div>

          {/* Fallback content if PDF doesn't exist */}
          {!numPages && (
            <div className="p-8 text-center">
              <p className="text-sm font-general mb-4">
                PDF preview not available for this ebook.
              </p>
              <a
                href={ebook.link}
                className="inline-block font-general uppercase px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download Ebook
              </a>
            </div>
          )}
        </div>

        {numPages && (
          <div className="flex items-center justify-between p-4 border-t bg-gray-50">
            <div className="flex items-center text-sm space-x-4">
              <button
                onClick={() => setScale((prev) => Math.max(0.5, prev - 0.1))}
                className="px-3 py-1 border rounded"
                disabled={scale <= 0.5}
              >
                -
              </button>
              <span>{(scale * 100).toFixed(0)}%</span>
              <button
                onClick={() => setScale((prev) => Math.min(2, prev + 0.1))}
                className="px-3 py-1 border rounded"
                disabled={scale >= 2}
              >
                +
              </button>
            </div>

            <div className="flex text-sm items-center space-x-4">
              <button
                onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
                className="px-3 py-1 border rounded"
                disabled={pageNumber <= 1}
              >
                Previous
              </button>
              <span>
                Page {pageNumber} of {numPages}
              </span>
              <button
                onClick={() =>
                  setPageNumber((prev) => Math.min(numPages, prev + 1))
                }
                className="px-3 py-1 border rounded"
                disabled={pageNumber >= numPages}
              >
                Next
              </button>
            </div>

            <a
              href={ebook.link}
              className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download
            </a>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

// Main Ebooks Component
const Ebooks = () => {
  const [selectedEbook, setSelectedEbook] = useState(null);

  const ebooks = [
    {
      title: "Transforming and Changing Lives With Anime",
      date: "April 25, 2024",
      image: "/img/bg1.webp",
      alt: "Transforming lives with anime",
      link: "./pdfs/HayaoMiyazaki.pdf",
      pdf: "/pdfs/HayaoMiyazaki.pdf", // Japan's Premier Anime Storyteller
    },
    {
      title: "How Anime Is Changing The Face Of Marketing",
      date: "April 25, 2024",
      image: "/img/image.webp",
      alt: "Anime in marketing",
      link: "#",
      pdf: "/pdfs/anime-in-marketing.pdf",
    },
    {
      title: "Exploring The Ethics Of Anime Fanarts",
      date: "April 25, 2024",
      image: "/img/bgcmp.gif",
      alt: "Ethics of anime fanart",
      link: "#",
      pdf: "/pdfs/ethics-of-anime-fanart.pdf",
    },
    {
      title: "HunterX Future - Collaboration or Cooperation?",
      date: "April 25, 2024",
      image: "/img/error.gif",
      alt: "HunterX future",
      link: "#",
      pdf: "/pdfs/hunterx-future.pdf",
    },
    {
      title: "From Fantasy to Reality: The Journey of Anime",
      date: "April 25, 2024",
      image: "/img/guy.gif",
      alt: "Fantasy to reality",
      link: "#",
      pdf: "/pdfs/fantasy-to-reality.pdf",
    },
    {
      title: "Exploring the Economy of Anime",
      date: "April 25, 2024",
      image: "/img/rain.gif",
      alt: "Anime economy",
      link: "#",
      pdf: "/pdfs/anime-economy.pdf",
    },
  ];

  return (
    <section className="lg:py-[60px] md:py-[40px] py-[20px] ">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-sm font-general text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Choose among our free ebooks download them or read them online.
        </motion.h2>

        <div className="flex flex-wrap -mx-2">
          {ebooks.map((ebook, index) => (
            <EbookCard
              key={index}
              title={ebook.title}
              date={ebook.date}
              image={ebook.image}
              alt={ebook.alt}
              onClick={() => setSelectedEbook(ebook)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedEbook && (
          <PdfViewerModal
            ebook={selectedEbook}
            onClose={() => setSelectedEbook(null)}
          />
        )}
      </AnimatePresence>

      <div className="mx-6">
        <h4>Free Ebooks - Terms and Conditions </h4>
        <h5>1. Acceptance of Terms:</h5>
        <p>
          By downloading and/or accessing any free ebook provided by [Your
          Company/Website Name] ("we," "us," or "our"), you ("you" or "user")
          agree to be bound by these Terms and Conditions. If you do not agree
          with any part of these terms, you must not download or access the
          ebooks.
        </p>
        <h5>2. Grant of License:</h5>
        <p>
          We grant you a non-exclusive, non-transferable, revocable license to
          download and use the free ebooks for personal, non-commercial
          purposes. This license does not grant you any ownership rights to the
          ebooks or their content.
        </p>
        <h5>3. Permitted Use:</h5>
        <p>You may:</p>
        <p>
          Download and store the ebooks on your personal devices. Read and use
          the information within the ebooks for your own personal use. 4.
          Prohibited Use:
        </p>
        <p>You may not:</p>
        <p>
          Distribute, sell, rent, lease, or otherwise transfer the ebooks to any
          third party. Modify, adapt, translate, or create derivative works
          based on the ebooks. Remove or alter any copyright notices,
          trademarks, or other proprietary markings from the ebooks. Use the
          ebooks for any commercial purpose without our express written consent.
          Upload the ebooks to any file-sharing or public distribution platform.
          Use automated systems (bots, spiders, etc.) to download ebooks in
          bulk. Use the ebooks in any way that violates applicable laws or
          regulations.
        </p>
      </div>
    </section>
  );
};

export default Ebooks;
