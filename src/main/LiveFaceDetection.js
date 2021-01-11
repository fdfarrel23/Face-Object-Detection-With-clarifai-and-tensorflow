import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import './style.css';
import React, { Component } from 'react';


class faceDetect extends Component{
    constructor(props){
        super(props)
        this.state={
            values:null,
            videoCurrent:null
        }
    }
     // reference to both the video and canvas
    videoRef = React.createRef();
    canvasRef = React.createRef();

    // we are gonna use inline style
    styles = {
        position: 'fixed',
        top: 150,
        left: 150
    };

    stopVideo=(event)=>{
      console.log("stop")
      const video = document.querySelector('video')
      const track = video.srcObject.getTracks()
      track.forEach(track => track.stop())
      document.getElementById("video_holder").style.display="none";
      //set btn props
      this.props.action()
    }

    btnLiveClicker=(event)=>{
      document.getElementsByClassName('black_background')[0].style.display = "block"
      if(this.props.title==='Live Object Detection'){
         //set btn props
        this.props.action()
        if (navigator.mediaDevices.getUserMedia) {
          // define a Promise that'll be used to load the webcam and read its frames
          const webcamPromise = navigator.mediaDevices
            .getUserMedia({
              video: true,
              audio: false,
            })
            .then(stream => {
              // pass the current frame to the window.stream
              window.stream = stream;
              // pass the stream to the videoRef
              this.videoRef.current.srcObject = stream;
              document.getElementById("video_holder").style.display="block";
              return new Promise(resolve => {
                this.videoRef.current.onloadedmetadata = () => {
                  resolve();
                };
              });
            }, (error) => {
              console.log("Couldn't start the webcam")
              console.error(error)
            });
            (async () => {
              // define a Promise that'll be used to load the model
              const loadlModelPromise = cocoSsd.load();
              // resolve all the Promises
              await loadlModelPromise.then(()=>{
                document.getElementsByClassName('black_background')[0].style.display = "none"
              })
              Promise.all([loadlModelPromise, webcamPromise])
              .then(values => {
                this.detectFromVideoFrame(values[0], this.videoRef.current);
              })
              .catch(error => {
                console.error(error);
              });
            })()
        }
      }else{
        document.getElementsByClassName('black_background')[0].style.display = "none"
        this.stopVideo()
      }
    }


    detectFromVideoFrame = (model, video) => {
        model.detect(video).then(predictions => {
          try{
            this.showDetections(predictions);
            requestAnimationFrame(() => {
              this.detectFromVideoFrame(model, video);
            });
          }catch(error){
            
          }
        }, (error) => {
          alert("Couldn't start the webcam")
          console.error(error)
        });
      };
      showDetections = predictions => {
        const ctx = this.canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        const font = "24px helvetica";
        ctx.font = font;
        ctx.textBaseline = "top";
    
        predictions.forEach(prediction => {
          const x = prediction.bbox[0]+30;
          const y = prediction.bbox[1];
          const width = prediction.bbox[2];
          const height = prediction.bbox[3];
          // Draw the bounding box.
          ctx.strokeStyle = "#2fff00";
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, width, height);
          // Draw the label background.
          ctx.fillStyle = "#2fff00";
          const textWidth = ctx.measureText(prediction.class).width;
          const textHeight = parseInt(font, 10);
          // draw top left rectangle
          ctx.fillRect(x, y, textWidth + 10, textHeight + 10);
          // draw bottom left rectangle
          ctx.fillRect(x, y + height - textHeight, textWidth + 15, textHeight + 10);
    
          // Draw the text last to ensure it's on top.
          ctx.fillStyle = "#000000";
          ctx.fillText(prediction.class, x, y);
          ctx.fillText(prediction.score.toFixed(2), x, y + height - textHeight);
        });
      };
    
    render() {
        return (
        <div className="live_holder">
             <div className="button_holder">
                <button onClick={this.btnLiveClicker} id="live_btn">{this.props.title}</button> 
                <label htmlFor="file_picker" id="live_btn_local">Select Image from Local</label>
                <input type='file' id='file_picker' style={{display:"none"}} onChange={this.props.imgSetter}/>
                <div> 
                    <div id="video_holder" >
                        <video
                        className="classHolder"
                        autoPlay
                        muted
                        ref={this.videoRef}
                        width="720"
                        height="600"
                        />
                        <canvas className="classHolder" ref={this.canvasRef} width="720" height="600" />
                    </div>
                </div>
            </div>
        </div>
        );
      }
}

export default faceDetect;
