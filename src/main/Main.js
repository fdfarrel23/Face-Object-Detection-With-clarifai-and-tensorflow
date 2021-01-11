import React, { Component } from 'react';
import './Main.css';
import Clarifai from "clarifai";
import logo from '../asset/Logo.svg';
import { MdExitToApp } from "react-icons/md";
import LiveFaceDetection from "./LiveFaceDetection";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import firebase from '../firebaseConfig';

const apps = new Clarifai.App({
    apiKey: "8dc50f0bbcb04e04b3a22fb4db5ceeaf",
});

const FaceDetect = ({ imageUrl, box }) => {
  return (
    <div className="img_container">
      <div className="holder_center">
        <div className="image_holder">
          <img id="inputimage" alt="" src={imageUrl} width='500px' height='auto' />
        <div
            className="bounding-box"
            // styling that makes the box visible base on the return value
            style={{
              top: box.topRow,
              right: box.rightCol,
              bottom: box.bottomRow+30,
              left: box.leftCol,  
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

class Main extends Component {
    constructor(props) {
        super(props);
        this.titlesetState = this.titlesetState.bind(this)
        this.submitOnClick = this.submitOnClick.bind(this)
        this.imgUrlsetState = this.imgUrlsetState.bind(this)
        this.state = {
            input: "",
            imageUrl: "",
            box:{},
            title:"Live Object Detection",
            name:""
        }
    }

    componentDidMount(){
      var uid = ""
      try {
        uid = firebase.auth().currentUser.uid
      } catch (error) {
        uid = localStorage.getItem('uid');
      }
      var database = firebase.database().ref("/user/"+uid)
      var nameHolder = ''

      database.once('value',function(childSnapshot){
        nameHolder = childSnapshot.val().name
      }).then((value)=>{
        this.setState({
          name: nameHolder
        })
      })
      
    }

    calculateFaceLocation = (data) => {
        const clarifaiFace =
          data.outputs[0].data.regions[0].region_info.bounding_box;
        const image = document.getElementById("inputimage");
        const width = Number(image.width);
        const height = Number(image.height);
        return {
          leftCol: clarifaiFace.left_col * width,
          topRow: clarifaiFace.top_row * height,
          rightCol: width - clarifaiFace.right_col * width,
          bottomRow: height - clarifaiFace.bottom_row * height,
        };
      };

    displayFaceBox = (box) => {
      document.getElementsByClassName('black_background')[0].style.display = "none"
        this.setState({ box: box });
      };

    onChange=(event)=>{
      this.setState({
        input: event.target.value
      })
    }

    imgUrlsetState=(event)=>{
      if(event.target.files[0]) {
        var reader = new FileReader();
        reader.addEventListener('load', this.inputsetState)
        reader.readAsDataURL(event.target.files[0]);
      }
    }

    inputsetState=(event)=>{
      this.setState({
        input: event.target.result
      })
      this.submitOnClick();
    }

    titlesetState(){
      console.log("CLicked")
      if(this.state.title==="Live Object Detection"){
        this.setState({
          title: "Stop Video",
          imageUrl: "",
          box:{},
          input:""
        })
      }else{
        this.setState({
          title: "Live Object Detection",
          imageUrl: "",
          box:{},
          input:""
        })
      }
    }

    submitOnClick(){
        if(this.state.input===''){
          alert("Masukan Url Terlebih dahulu")
        }else{
          document.getElementsByClassName('black_background')[0].style.display = "block"
          const element = document.querySelector("#video_holder");
          if(getComputedStyle(element).display==="block"){
            const video = document.querySelector('video')
            const track = video.srcObject.getTracks()
            track.forEach(track => track.stop())
            //set title
            this.setState({
              title: "Live Object Detection"
            })
            document.getElementById("video_holder").style.display="none";
          }
          this.setState({ 
            imageUrl: this.state.input,
            box:{}
          });
          apps.models
          .predict(Clarifai.FACE_DETECT_MODEL, this.state.input.replace(/^data:image\/(.*);base64,/, ''))
          .then((response) =>
              this.displayFaceBox(this.calculateFaceLocation(response))
          )
          // if error exist console.log error
          .catch((err) => console.log(err));
          document.getElementById("inputUrl").value = ""
          }
    };

    logoutBtnListener=(event)=>{
      event.preventDefault()
      confirmAlert({
        title:"Konfimasi Logout!!",
        message:"Apakah Kamu Yakin Ingin Logout?..",
        buttons:[
          {
            label:'Iya',
            onClick:()=>{
              try{
                console.log("stop")
                const video = document.querySelector('video')
                const track = video.srcObject.getTracks()
                track.forEach(track => track.stop())
                document.getElementById("video_holder").style.display="none";
              }catch(error){
                
              }
              localStorage.clear()
              this.props.history.goBack()
            }
          },
          {
            label:'Tidak'
          }
        ]
      })
    }

    render() {
        return(
          <div>
            <div className="black_background">
              <div className="loader"></div>
            </div>
            <div className='main_holder'>
                <div className="ml-5 mr-5">
                    <div className="m-4 header">
                        <img src={logo} alt="Logo" width="150px" height="150px" />
                        <button className="header__logout" onClick={this.logoutBtnListener}>
                            <div className="hl__text" >SIGN OUT</div>
                            <div className="hl__iconContainer">
                            <MdExitToApp size={25} color={'white'} />
                            </div>
                        </button>
                    </div>

                    <div className="body">
                        <h1 className="body__title">Hai, {this.state.name}</h1>
                        <p className="body__subTitle">This Input URL Will detect faces in your pictures. Give it a try.</p>
                        <div className="body__form">
                            <div className="body__formContainer">
                                <input type="text" name="inputUrl" id="inputUrl" className="body__input" 
                                placeholder="Input Your URL Here..." onChange={this.onChange}/>
                                <button type="submit" className="body__submit" onClick={this.submitOnClick}>Detect</button>
                            </div>
                        </div>
                    </div>
                    <LiveFaceDetection title={this.state.title} action={this.titlesetState} imgSetter={this.imgUrlsetState}/>
                    <FaceDetect box={this.state.box} imageUrl={this.state.imageUrl} />
                </div>
            </div>
          </div>
        );
    }

}

export default Main;
