"use strict";

window.addEventListener("load", () => {
  const video = document.getElementById("video");

  let angryList = [];
  let disgustedList = [];
  let fearfulList = [];
  let happyList = [];
  let neutralList = [];
  let sadList = [];
  let surprisedList = [];

  function startVideo() {
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;
    navigator.getUserMedia(
      {
        video: {},
      },
      (stream) => (video.srcObject = stream),
      (err) => console.log(err)
    );
  }

  function ArrayAvg(myArray) {
    var i = 0,
      summ = 0,
      ArrayLen = myArray.length;
    while (i < ArrayLen) {
      summ = summ + myArray[i++];
    }
    return summ / ArrayLen;
  }

  Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
    faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
    faceapi.nets.faceExpressionNet.loadFromUri("/models"),
    faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
    faceapi.nets.ageGenderNet.loadFromUri("/models"),
  ]).then(startVideo);

  video.addEventListener("play", async () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();
      const resizedDetections = faceapi.resizeResults(detections, displaySize);

      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

      angryList.push(detections[0]["expressions"]["angry"]);
      disgustedList.push(detections[0]["expressions"]["disgusted"]);
      fearfulList.push(detections[0]["expressions"]["fearful"]);
      happyList.push(detections[0]["expressions"]["happy"]);
      neutralList.push(detections[0]["expressions"]["neutral"]);
      sadList.push(detections[0]["expressions"]["sad"]);
      surprisedList.push(detections[0]["expressions"]["surprised"]);

      const resultados = 
        {
          angry: ArrayAvg(angryList),
          disgusted: ArrayAvg(disgustedList),
          fearful: ArrayAvg(fearfulList),
          happy: ArrayAvg(happyList),
          neutral: ArrayAvg(neutralList),
          sad: ArrayAvg(sadList),
          surprised: ArrayAvg(surprisedList)
        }
      

      let resultado = detections[0]["expressions"];
      console.log(resultado);

      console.log("-------------------");
      console.log("Resultados finales");
      console.log(resultados);
      console.log("-------------------");
    }, 1000);
  });
});
