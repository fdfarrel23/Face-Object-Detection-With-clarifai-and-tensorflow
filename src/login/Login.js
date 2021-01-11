import './style.css';
import React,{Component} from 'react';
import apps from '../firebaseConfig';
import eye from '../svg/eye.svg';
import eye_closed from '../svg/eye-closed.svg';
import email from '../svg/email-change.svg';
import password from '../svg/password-change.svg';
import right_arrow from '../svg/right-arrow.svg';
import team_logo from '../team_logo.svg';
import name from '../svg/id-card.svg';
import { withRouter } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert'; // Import
import app from '../firebaseConfig';


function InputComponent(props){
  return (
    <div className="input_wraper">
      <img className="input_logo" src={props.src} alt="input_logo" id={props.id}/>
      <div className="InputField">
        <input type="text" className="inputText" required  onChange={props.onchange}/>
        <span className="floating-label">{props.title}</span>
      </div>
    </div>
  )
}


class App extends Component{
  constructor(props){
    super(props)
    this.state={
      title_btn:'Login',
      btn_title:'Sign Up',
      end_title:'Don’t have an account?',
      name:'',
      email:'',
      password:''
    }
  }

  
  clickHandeler_Login=(event)=>{
    event.preventDefault();
    document.getElementById('Login_Btn').style.textDecoration = 'underline';
    document.getElementById('SignUp_Btn').style.textDecoration = 'none';
    document.getElementById('inputName_view').style.display = 'none';
    this.setState({btn_title:'Sign Up',end_title:'Don’t have an account?',title_btn:'Login'})
  }

  clickHandeler_SignUp=(event)=>{
    event.preventDefault();
    document.getElementById('Login_Btn').style.textDecoration = 'none';
    document.getElementById('SignUp_Btn').style.textDecoration = 'underline';
    document.getElementById('inputName_view').style.display = 'block';
    this.setState({btn_title:'Login',end_title:'Have an account?',title_btn:'Sign Up'})
  }

  endClickHandler=(event)=>{
    event.preventDefault();
    if(this.state.btn_title==='Login'){
      document.getElementById('Login_Btn').style.textDecoration = 'underline';
      document.getElementById('SignUp_Btn').style.textDecoration = 'none';
      document.getElementById('inputName_view').style.display = 'none';
      this.setState({btn_title:'Sign Up',end_title:'Don’t have an account?',title_btn:'Login'})
    }else{
      document.getElementById('Login_Btn').style.textDecoration = 'none';
      document.getElementById('SignUp_Btn').style.textDecoration = 'underline';
      document.getElementById('inputName_view').style.display = 'block';
      this.setState({btn_title:'Login',end_title:'Have an account?',title_btn:'Sign Up'})
    }
   
  }


  clickHandelerSubBtn=(event)=>{
    event.preventDefault()
    document.getElementsByClassName('black_background')[0].style.display = "block"
    document.getElementsByClassName('inputText')[0].style.display = "none"
    document.getElementsByClassName('inputText')[1].style.display = "none"
    document.getElementsByClassName('inputText')[2].style.display = "none"
    if(this.state.title_btn==='Login'){
      apps.auth().signInWithEmailAndPassword(this.state.email,this.state.password).then((user) => {
        // Signed in
        // ...
        document.getElementsByClassName('black_background')[0].style.display = "none"
        document.getElementsByClassName('inputText')[0].style.display = "block"
        document.getElementsByClassName('inputText')[1].style.display = "block"
        document.getElementsByClassName('inputText')[2].style.display = "block"
        
        let path = '/main'
        this.props.history.push(path);
        var uid = app.auth().currentUser.uid
        localStorage.setItem('uid', uid);
      })
      .catch((error) => {
        var errorMessage = error.message;
        // ..
        confirmAlert({
          title:"Peringatan",
          message:errorMessage,
          buttons:[
            {
              label:'Iya',
            }
          ]
        })
        document.getElementsByClassName('black_background')[0].style.display = "none"
        document.getElementsByClassName('inputText')[0].style.display = "block"
        document.getElementsByClassName('inputText')[1].style.display = "block"
        document.getElementsByClassName('inputText')[2].style.display = "block"
      });
    }else{
      apps.auth().createUserWithEmailAndPassword(this.state.email,this.state.password)
    .then((user) => {
      // Signed in
      // ...
      var database = app.database().ref('/user')
      var uid = app.auth().currentUser.uid
      database.child(uid).set({
        name: this.state.name
      })
      confirmAlert({
        title:"Pesan",
        message:"Berhasil Membuat Akun, Silahkan Login!!",
        buttons:[
          {
            label:'Iya',
          }
        ]
      })
      document.getElementsByClassName('black_background')[0].style.display = "none"
      document.getElementsByClassName('inputText')[0].style.display = "block"
      document.getElementsByClassName('inputText')[1].style.display = "block"
      document.getElementsByClassName('inputText')[2].style.display = "block"
    })
    .catch((error) => {
      var errorMessage = error.message;
      // ..
      confirmAlert({
        title:"Pesan",
        message:errorMessage,
        buttons:[
          {
            label:'Iya',
          }
        ]
      })
      document.getElementsByClassName('black_background')[0].style.display = "none"
      document.getElementsByClassName('inputText')[0].style.display = "block"
      document.getElementsByClassName('inputText')[1].style.display = "block"
      document.getElementsByClassName('inputText')[2].style.display = "block"
    });
    }
  }

  nameOnChange=(event)=>{
    console.log( event.target.value)
    this.setState({
      name: event.target.value
    })
  }

  emailOnChange=(event)=>{
    this.setState({
      email: event.target.value
    })
  }

  passwordOnChange=(event)=>{
    this.setState({
      password: event.target.value
    })
  }

  passwordChanger=(event)=>{
    var x = document.getElementById("inputpassword");
    var y = document.getElementById("image_eye");
    if (x.type === "password") {
      x.type = "text";
      y.src = eye;
    } else {
      x.type = "password";
      y.src = eye_closed;
    }
  }

  render(){
    return(
      <div>
        <div className="black_background">
          <div className="loader"></div>
        </div>
        <div className="Login_holder">
          <img src={team_logo} className="Logo" alt="Logo"></img>
          <div className="App-TypeBtn">
            <a href="/" id="Login_Btn" onClick={this.clickHandeler_Login}>LOGIN</a>
            <a href="/" id="SignUp_Btn" onClick={this.clickHandeler_SignUp}>SIGN UP</a>
          </div>
          <div className="Form_Holder">
            <div id="inputName_view">
              <InputComponent title="Your name" src={name} onchange={this.nameOnChange} id="name_input" />
            </div>
            <InputComponent title="Your email address" src={email} onchange={this.emailOnChange} id="email_input"/>
            <div className="input_wraper">
              <img className="input_logo" src={password} alt="password_logo" id="password_input" />
              <div className="InputField">
                <input type='password' id="inputpassword" className="inputText" 
                required name="password" onChange={this.passwordOnChange}/>
                <span className="floating-label">Your Password</span>
              </div>
              <img id="image_eye" src={eye_closed} alt="visible_logo" width="5%" onClick={this.passwordChanger}/>
            </div>
            <div className="parent_btn">
              <div className="Button" onClick={this.clickHandelerSubBtn}>
                <p>{this.state.title_btn}</p>
                <img src={right_arrow} alt="arrow"/>
              </div>
            </div>
            <div className="footer_page">
              <div className="footer_holder">
                <p className="p1">{this.state.end_title}</p>
                <p className="p2" onClick={this.endClickHandler}>{this.state.btn_title}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default withRouter(App);
