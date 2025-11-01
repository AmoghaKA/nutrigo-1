// app/scan/page.tsx
'use client';

import { useState, useRef, useCallback, useEffect} from 'react';
import Image from 'next/image';
import { FiCamera, FiUploadCloud } from 'react-icons/fi';
import { useRouter } from 'next/navigation'; // Use this for App Router



export default function ScanPage() {
  const router = useRouter(); // Hook for navigation
  const [scanning, setScanning] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const photoRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Array<{
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number
    }> = []

    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        opacity: Math.random() * 0.5 + 0.2,
      })
    }

    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        ctx.fillStyle = `rgba(52, 211, 153, ${particle.opacity})`
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()

        particle.x += particle.speedX
        particle.y += particle.speedY

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Function to start the camera
  const startCamera = useCallback(async () => {
  try {
    setScanning(true);
    setImagePreview(null);

    const stream = await navigator.mediaDevices.getUserMedia({ video: true });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    }
  } catch (err) {
    console.error("Error accessing camera: ", err);
    alert("Could not access camera. Please grant permission or check if your browser supports it.");
    setScanning(false);
  }
}, []);


  // Function to stop the camera
  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setScanning(false);
  }, []);

  // Function to take a photo
  const takePhoto = useCallback(() => {
    if (videoRef.current && photoRef.current) {
      const context = photoRef.current.getContext('2d');
      if (context) {
        photoRef.current.width = videoRef.current.videoWidth;
        photoRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
        const imageDataUrl = photoRef.current.toDataURL('image/png');
        setImagePreview(imageDataUrl);
        stopCamera();
      }
    }
  }, [stopCamera]);

  // Function to handle file upload
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      stopCamera();
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setScanning(false);
      };
      reader.readAsDataURL(file);
    }
  }, [stopCamera]);

  // Handler for drag-and-drop
  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload({ target: { files } } as any);
    }
  }, [handleFileUpload]);

  // Reset to initial state
  const resetScanner = () => {
    stopCamera();
    setImagePreview(null);
    if(fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-8 relative overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      {/* Background radial gradient from your homepage */}
       <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-emerald-500/30 to-teal-500/30 rounded-full blur-3xl animate-pulse-slow"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      <div className="z-10 w-full max-w-4xl text-center">
        {/* Back Button */}
        <button
          onClick={() => router.back()} // Go back to the previous page
          className="absolute top-8 left-8 text-gray-400 hover:text-white transition-colors text-lg"
        >
          &larr; Back
        </button>

        <h1 className="text-5xl md:text-6xl font-black mb-6">
          <span className="text-white">Scan & </span>
          <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
            Analyze
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-400 mb-12">
          Get real-time AI nutrition insights from your camera or an image.
        </p>

        <div className="flex justify-center gap-6 mb-8">
          {!scanning && !imagePreview ? (
            <>
              {/* Access Camera Button */}
              <button
                onClick={startCamera}
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-lg text-lg font-bold hover:opacity-90 transition-opacity shadow-lg"
              >
                <FiCamera className="text-2xl" /> Access Camera
              </button>
              {/* Upload Image Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-3 px-8 py-4 border-2 border-emerald-500/50 hover:border-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/15 text-emerald-400 rounded-lg text-lg font-bold backdrop-blur-xl transition-all"
              >
                <FiUploadCloud className="text-2xl" /> Upload Image
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
              />
            </>
          ) : (
            // Reset Button
            <button
              onClick={resetScanner}
              className="flex items-center px-8 py-4 border border-red-500 text-red-500 rounded-lg text-lg font-semibold hover:bg-red-500 hover:text-white transition-colors shadow-lg"
            >
              Start Over
            </button>
          )}
        </div>

        {/* --- Main Display Area --- */}
        <div
        className="relative mx-auto w-full max-w-2xl h-96 bg-black/30 rounded-xl overflow-hidden shadow-2xl border border-gray-700/50 flex items-center justify-center
             transition-all duration-300 ease-in-out backdrop-blur-sm mt-8 flex-shrink-0"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
         style={{ alignSelf: "center" }}
>

          {!scanning && !imagePreview && (
            <div className="flex flex-col items-center justify-center w-full h-full text-gray-500 text-lg pointer-events-none">
            <FiUploadCloud className="text-6xl mb-4" />
            <p>Or drag & drop your image here</p>
            </div>
         )}


          {/* Live Camera Feed */}
          {scanning && (
            <>
              <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
              <button
                onClick={takePhoto}
                className="absolute bottom-4 z-10 left-1/2 -translate-x-1/2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full text-lg font-semibold hover:scale-105 transition-transform shadow-xl"
              >
                Take Photo
              </button>
              <canvas ref={photoRef} className="hidden" />
            </>
          )}

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={imagePreview}
                alt="Image preview"
                layout="fill"
                objectFit="contain"
                className="rounded-lg"
              />
              {/* This is where you would show the analysis results */}
              <button
                onClick={() => alert("Analysis logic goes here!")}
                className="absolute bottom-4 z-10 left-1/2 -translate-x-1/2 px-8 py-3 bg-gradient-to-r from-teal-400 to-cyan-500 text-white rounded-full text-lg font-semibold hover:scale-105 transition-transform shadow-xl"
              >
                Analyze Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}