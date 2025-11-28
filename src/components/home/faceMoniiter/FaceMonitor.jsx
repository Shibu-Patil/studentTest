import React, { useEffect, useRef, useState } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";
import toast, { Toaster } from "react-hot-toast";

const FaceMonitor = () => {
  const videoRef = useRef(null);
  const baseline = useRef({ x: 0, y: 0 });
  const samples = useRef([]);
  const calibratedRef = useRef(false); // for one-time calibration
  const [calibratedState, setCalibratedState] = useState(false); // just for UI
  const lastToastTime = useRef(0);

  const THRESH_X = 0.02;
  const THRESH_Y = 0.02;

  const showToastOnce = (msg) => {
    const now = Date.now();
    if (now - lastToastTime.current > 1200) {
      toast.error(msg, { duration: 1500 });
      lastToastTime.current = now;
    }
  };

  const recalibrate = () => {
    calibratedRef.current = false;
    setCalibratedState(false);
    samples.current = [];
    baseline.current = { x: 0, y: 0 };
    toast("Recalibrating… Keep head straight for 2 seconds ⚙️", { duration: 2500 });
  };

  useEffect(() => {
    const faceMesh = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults(onResults);

    if (videoRef.current) {
      const camera = new Camera(videoRef.current, {
        onFrame: async () => await faceMesh.send({ image: videoRef.current }),
        width: 640,
        height: 480,
      });
      camera.start();
    }
  }, []);

  const onResults = (results) => {
    if (!results.multiFaceLandmarks?.length) return;

    const lm = results.multiFaceLandmarks[0];
    const noseX = lm[1].x;
    const noseY = lm[1].y;

    // ---------------- Calibration Phase ----------------
    if (!calibratedRef.current) {
      samples.current.push({ x: noseX, y: noseY });

      if (samples.current.length >= 30) {
        const avgX = samples.current.reduce((sum, p) => sum + p.x, 0) / samples.current.length;
        const avgY = samples.current.reduce((sum, p) => sum + p.y, 0) / samples.current.length;
        baseline.current = { x: avgX, y: avgY };
        calibratedRef.current = true; // set once
        setCalibratedState(true);
        toast.success("Calibration complete ✔️", { duration: 1500 });
      }
      return;
    }

    // ---------------- Head movement detection ----------------
    const dx = noseX - baseline.current.x;
    const dy = noseY - baseline.current.y;

    if (Math.abs(dx) > THRESH_X || Math.abs(dy) > THRESH_Y) {
      showToastOnce("🚨 Looking away from screen — not allowed!");
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <Toaster position="top-center" />
      <video
        ref={videoRef}
        autoPlay
        className="w-64 h-48 rounded border border-gray-400 opacity-50"
      />
      {!calibratedState ? (
        <p className="text-sm text-gray-600">
          ⏳ Calibration in progress… Keep head straight
        </p>
      ) : (
        <p className="text-sm text-green-600">✔ Calibrated</p>
      )}
      <button
        onClick={recalibrate}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Recalibrate Head Position
      </button>
    </div>
  );
};

export default FaceMonitor;
