
import React, { useRef } from "react";
import "./App.css";
// import * as tf from "@tensorflow/tfjs";
import * as posenet from "@tensorflow-models/posenet";
import Webcam from "react-webcam";
import {  drawSkeleton } from "./utilities";
import mountain from './pose3.jpg';

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const imgRef = useRef();
  const canvasImg = useRef(null);
  //  Load posenet
  const runPosenet = async () => {
    const net = await posenet.load({
      inputResolution: { width: 640, height: 480 },
      scale: 0.8,
    });
    //
    detectImg(net);
    setInterval(() => {
      detect(net);
    }, 100);
  };
  
  const detectImg = async(net) => {
      const image = imgRef.current;
      console.log(imgRef.current.width);
      const imageWidth = imgRef.current.width;
      const imageHeight = imgRef.current.height;

      console.log(imageWidth);

      imgRef.current.height = imageHeight;
      imgRef.current.width = imageWidth;
      const pose2 = await net.estimateSinglePose(image);
      drawCanvasImg(pose2, image, imageWidth, imageHeight, canvasImg);
  }

  const drawCanvasImg = (pose2, image, imageWidth, imageHeight, canvas) =>{
    const ctx = canvas.current.getContext("2d");
    canvas.current.width = imageWidth;
    canvas.current.height = imageHeight;
    drawSkeleton(pose2["keypoints"], 0.7, ctx);
    
  }

  

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" && webcamRef.current !== null && webcamRef.current.video.readyState === 4) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Make Detections
      const pose = await net.estimateSinglePose(video);
      

      drawCanvas(pose, video, videoWidth, videoHeight, canvasRef);
    }
  };

  const drawCanvas = (pose, video, videoWidth, videoHeight, canvas) => {
    const ctx = canvas.current.getContext("2d");
    canvas.current.width = videoWidth;
    canvas.current.height = videoHeight;

    drawSkeleton(pose["keypoints"], 0.7, ctx);
  };

  runPosenet();

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height:480,
          }}
        />
        <canvas
          ref={canvasImg}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height:480,
          }}
        />
            
        <img ref={imgRef}
        src={mountain} alt="Mountain"
        style={{position:"fixed"}}
         />
      </header>      
    </div>
  );
}

export default App;