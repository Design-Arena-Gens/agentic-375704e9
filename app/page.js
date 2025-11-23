'use client';

import { useState, useRef } from 'react';

export default function Home() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImage = {
          id: Date.now() + Math.random(),
          src: event.target.result,
          name: file.name,
          timestamp: new Date().toLocaleString()
        };
        setImages(prev => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleCameraCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImage = {
          id: Date.now(),
          src: event.target.result,
          name: 'Camera capture',
          timestamp: new Date().toLocaleString()
        };
        setImages(prev => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
    if (selectedImage?.id === id) {
      setSelectedImage(null);
    }
  };

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let item of items) {
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        const reader = new FileReader();
        reader.onload = (event) => {
          const newImage = {
            id: Date.now(),
            src: event.target.result,
            name: 'Pasted image',
            timestamp: new Date().toLocaleString()
          };
          setImages(prev => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        background: '#1a1a1a',
        color: '#fff'
      }}
      onPaste={handlePaste}
      tabIndex={0}
    >
      {/* Sidebar */}
      <div style={{
        width: '300px',
        background: '#2a2a2a',
        padding: '20px',
        overflowY: 'auto',
        borderRight: '1px solid #444'
      }}>
        <h1 style={{ margin: '0 0 20px 0', fontSize: '24px' }}>Reference Images</h1>

        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '10px',
              background: '#4a9eff',
              border: 'none',
              borderRadius: '6px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            📁 Upload Images
          </button>

          <button
            onClick={() => cameraInputRef.current?.click()}
            style={{
              width: '100%',
              padding: '12px',
              background: '#ff4a9e',
              border: 'none',
              borderRadius: '6px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            📷 Take Photo
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />

          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleCameraCapture}
            style={{ display: 'none' }}
          />
        </div>

        <p style={{ fontSize: '12px', color: '#888', marginBottom: '15px' }}>
          💡 Tip: You can also paste images directly (Ctrl/Cmd + V)
        </p>

        {/* Image thumbnails */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {images.map(img => (
            <div
              key={img.id}
              style={{
                position: 'relative',
                border: selectedImage?.id === img.id ? '2px solid #4a9eff' : '2px solid #444',
                borderRadius: '8px',
                overflow: 'hidden',
                cursor: 'pointer',
                background: '#333'
              }}
              onClick={() => setSelectedImage(img)}
            >
              <img
                src={img.src}
                alt={img.name}
                style={{
                  width: '100%',
                  height: '120px',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
              <div style={{ padding: '8px' }}>
                <div style={{ fontSize: '12px', fontWeight: '500', marginBottom: '4px' }}>
                  {img.name}
                </div>
                <div style={{ fontSize: '10px', color: '#888' }}>
                  {img.timestamp}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(img.id);
                }}
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: 'rgba(0,0,0,0.7)',
                  border: 'none',
                  borderRadius: '4px',
                  color: '#fff',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  fontSize: '12px'
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {images.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#666',
            fontSize: '14px'
          }}>
            No reference images yet.<br/>Upload or capture one to get started!
          </div>
        )}
      </div>

      {/* Main viewing area */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflow: 'auto'
      }}>
        {selectedImage ? (
          <div style={{ maxWidth: '100%', maxHeight: '100%' }}>
            <img
              src={selectedImage.src}
              alt={selectedImage.name}
              style={{
                maxWidth: '100%',
                maxHeight: 'calc(100vh - 40px)',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
              }}
            />
            <div style={{
              textAlign: 'center',
              marginTop: '20px',
              fontSize: '14px',
              color: '#aaa'
            }}>
              {selectedImage.name} • {selectedImage.timestamp}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#666' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🖼️</div>
            <div style={{ fontSize: '18px' }}>
              Select an image from the sidebar to view it here
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
