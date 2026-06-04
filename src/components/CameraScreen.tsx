import React, { useEffect, useRef, useState } from 'react';
import { X, Camera } from 'lucide-react';

interface CameraScreenProps {
  onCapture: (scanData: any) => void;
  onClose: () => void;
}

export function CameraScreen({ onCapture, onClose }: CameraScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    
    async function setupCamera() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
           throw new Error('Camera API not available.');
        }

        try {
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
          });
        } catch (e) {
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: true 
          });
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);
      } catch (err) {
        console.error("Camera setup failed:", err);
        setHasPermission(false);
      }
    }

    setupCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCaptureClick = async () => {
    if (isCapturing || !videoRef.current || !canvasRef.current) return;
    setIsCapturing(true);
    setErrorMsg(null);

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Could not get 2d context");

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64Image = canvas.toDataURL('image/jpeg', 0.8);

      const response = await fetch('/api/analyze-foot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64Image })
      });

      if (!response.ok) {
        throw new Error("Failed to analyze image");
      }

      const data = await response.json();
      
      if (!data.hasFoot) {
        setErrorMsg("No clear human foot detected. Please align your foot and try again.");
        setIsCapturing(false);
      } else {
        onCapture(data);
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to process scan. Please try again.");
      setIsCapturing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#111] text-white relative">
      <div className="absolute top-0 inset-x-0 p-4 pt-6 shrink-0 flex justify-between items-center z-20 bg-gradient-to-b from-[#111]/80 to-transparent">
        <span className="text-[10px] uppercase tracking-[2px] opacity-70 font-bold">Scanning Foot</span>
        {!isCapturing && (
          <button onClick={onClose} className="p-2 active:scale-95 hover:bg-white/10 rounded-full">
            <X size={20} />
          </button>
        )}
      </div>

      <div className="flex-1 relative overflow-hidden bg-black">
        {hasPermission === false ? (
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
            <p className="text-white/50 font-bold uppercase tracking-widest text-sm leading-relaxed">
              Camera access denied.<br/>Please enable permissions in your browser.
            </p>
          </div>
        ) : (
          <video 
            ref={videoRef}
            autoPlay 
            playsInline 
            muted 
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        
        {/* Foot Guide Overlay */}
         <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-8">
            <div className={`relative w-full max-w-[280px] h-[500px] border-2 border-dashed ${isCapturing ? 'border-amber-400/80' : 'border-emerald-500/50'} rounded-[60px] flex items-center justify-center ${isCapturing ? 'bg-amber-400/10' : 'bg-emerald-500/5'} transition-colors duration-300`}>
              {!isCapturing && (
                <span className="text-emerald-500 font-bold uppercase tracking-[2px] text-[10px] bg-black/50 px-3 py-1 rounded-full">Align foot here</span>
              )}
              
              <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border-t-2 border-l-2 ${isCapturing ? 'border-amber-400' : 'border-emerald-500'} transition-colors duration-300`}></div>
              <div className={`absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 w-4 h-4 border-t-2 border-r-2 ${isCapturing ? 'border-amber-400' : 'border-emerald-500'} transition-colors duration-300`}></div>
              <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4 h-4 border-b-2 border-l-2 ${isCapturing ? 'border-amber-400' : 'border-emerald-500'} transition-colors duration-300`}></div>
              <div className={`absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 w-4 h-4 border-b-2 border-r-2 ${isCapturing ? 'border-amber-400' : 'border-emerald-500'} transition-colors duration-300`}></div>

              {/* Scanning effect */}
              {isCapturing && (
                <div className="absolute inset-x-0 h-1 bg-amber-400/60 shadow-[0_0_15px_rgba(251,191,36,0.6)] animate-[scan_1.5s_ease-in-out_infinite]" />
              )}
            </div>
            {errorMsg && (
              <div className="mt-8 bg-red-500/90 text-white text-xs font-bold px-4 py-3 rounded-xl max-w-[280px] text-center shadow-lg">
                {errorMsg}
              </div>
            )}
         </div>
         <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="shrink-0 pb-12 pt-8 flex items-center justify-center bg-[#111] z-20">
        <button 
          onClick={handleCaptureClick}
          disabled={isCapturing}
          className={`w-20 h-20 rounded-full border-[3px] border-white flex items-center justify-center transition-transform ${isCapturing ? 'opacity-50' : 'active:scale-95'}`}
        >
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            {isCapturing ? (
              <div className="w-6 h-6 border-4 border-[#111] border-t-transparent rounded-full animate-spin" />
            ) : (
              <Camera size={28} className="text-black" />
            )}
          </div>
        </button>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
