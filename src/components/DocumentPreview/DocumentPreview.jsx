import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';
import useDeviceType from '../../hooks/useDeviceType';
import { handleDownload } from '../../utils/downloadHelpers';
import CustomModal from '../CustomModal/CustomModal';

import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import DownloadIcon from '../../assets/icons/download-icon.svg?react';
import closeIcon from '../../assets/icons/close-icon.svg';
import viewportWideIcon from '../../assets/icons/viewport-wide-icon.svg';
import backMobileIcon from '../../assets/icons/back-mobile-icon.svg';

import './styles.scss';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

const DocumentPreview = ({ showPreview, selectedDocument, onClose }) => {
  const [numPages, setNumPages] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const currentUserDevice = useDeviceType();
  const currentFirm = useSelector((state) => state.firm.currentFirm);

  console.log('selectedDocument', selectedDocument, currentFirm);

  const prevFirmRef = useRef(currentFirm);

  useEffect(() => {
    if (prevFirmRef.current && prevFirmRef.current.id !== currentFirm.id) {
      onClose();
    }
    prevFirmRef.current = currentFirm;
  }, [currentFirm, onClose]);


  const onLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  useEffect(() => {
    if (currentUserDevice === 'mobile') {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [currentUserDevice]);

  const handleFullScreenToggle = () => {
    setIsFullScreen(!isFullScreen);
  };

  const renderDocumentContent = (scale) => (
    <Document
      file={`${import.meta.env.VITE_API_URL}/${selectedDocument.file.path}`}
      onLoadSuccess={onLoadSuccess}
    >
      {Array.from(new Array(numPages), (el, index) => (
        <Page key={index} pageNumber={index + 1} scale={scale} />
      ))}
    </Document>
  );

  if (currentUserDevice === 'mobile') {
    return ReactDOM.createPortal(
      <div className='modal-overlay'>
        <div
          className='document-preview-mobile'
          onClick={(e) => e.stopPropagation()}
        >
          <div className='mobile-header'>
            <div className='mobile-name-wrapper'>
              <img
                src={backMobileIcon}
                alt='Back'
                className='back-arrow'
                onClick={onClose}
              />
              <h1 className='title'>{selectedDocument.title}</h1>
            </div>
            <DownloadIcon
              alt='Download all'
              className='mobile-view-download-icon'
              onClick={() => {
                handleDownload(selectedDocument);
              }}
            />
          </div>
          <div className='mobile-document-content'>
            <div className='document-centered'>
              <Document
                file={`${import.meta.env.VITE_API_URL}/${
                  selectedDocument.file.path
                }`}
                onLoadSuccess={onLoadSuccess}
              >
                {Array.from(new Array(numPages), (el, index) => (
                  <Page key={index} pageNumber={index + 1} scale={0.6} />
                ))}
              </Document>
            </div>
          </div>
        </div>
      </div>,
      document.getElementById('mobile-portal')
    );
  }

  return (
    <>
      <div className='document-preview'>
        <img
          src={closeIcon}
          alt='Close'
          className='close-icon'
          onClick={onClose}
        />
        <img
          src={viewportWideIcon}
          alt='View'
          className='view-icon'
          onClick={handleFullScreenToggle}
        />
        {/* <Document
        file={`${import.meta.env.VITE_API_URL}/${selectedDocument.file.path}`}
        onLoadSuccess={onLoadSuccess}
      >
        {Array.from(new Array(numPages), (el, index) => (
          <Page key={index} pageNumber={index + 1} scale={0.9} />
        ))}
      </Document> */}
        {renderDocumentContent(0.9)}
      </div>

      <CustomModal
        isOpen={isFullScreen}
        onClose={handleFullScreenToggle}
        fullScreen={true}
      >
        <div className='fullscreen-document'>
          <p className='fullscreen-header'>{selectedDocument.title}</p>

          <div className='document-content'>{renderDocumentContent(0.7)}</div>
        </div>
      </CustomModal>
    </>
  );
};

export default DocumentPreview;
