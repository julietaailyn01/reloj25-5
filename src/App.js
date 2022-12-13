import { useState, useEffect } from 'react';
import './App.css';


function App() {

  const [ breakLength, setBreakLength ] = useState(5);
  const [ sessionLength, setSessionLength ] = useState(25);
  const [ current, setCurrent ] = useState(["session", "Sesión"]);
  const [ start, setStart ] = useState(false);
  const [ timeLeft, setTimeLeft ] = useState("");
  const [ timeRun, setTimeRun ] = useState("");
  const [ running, setRunning ] = useState(false);
  const [ reset, setReset ] = useState(false);
  const [ second, setSecond ] = useState(0);

  const transformTime = (value) => {
    const getTime = () => value * 60;
    const getTwoNum = (num) => num.toString().substring(0,2);
    let time = getTime();
    let minutes = Math.floor(time / 60);
    let seconds = time - minutes * 60;
    if(minutes<10) minutes = `0${minutes}`;
    if(seconds<10) seconds = `0${seconds}`;
    minutes = getTwoNum(minutes);
    seconds = getTwoNum(seconds);
    time = `${minutes}:${seconds}`;
    setTimeLeft(time);
  }

  const addClass = (classForRemove1, classForRemove2, classForAdd, element) => {
    const classRemoveRegex1 = new RegExp(`${classForRemove1}`);
    const classRemoveRegex2 = new RegExp(`${classForRemove2}`);
    const classAddRegex = new RegExp(`${classForAdd}`);
    if(classRemoveRegex1.test(element.classList)){
      element.classList.remove(classForRemove1);
    }
    if(classRemoveRegex2.test(element.classList)){
      element.classList.remove(classForRemove2);
    }
    if(!classAddRegex.test(element.classList)){
      element.classList.add(classForAdd);
    }
  };

  const countdown = (sec, audio, timeLeft) => {
    setRunning(true);
    if(timeRun>0){
      if(timeRun<61){addClass("time-run", "time-pause", "time-finish", timeLeft);}
      else{addClass("time-finish", "time-pause", "time-run", timeLeft);}
      setTimeout(()=>{ 
        setSecond(sec + 1); 
        let test = /[0-9][00]$/.test(sec);
        test && setTimeRun(timeRun => timeRun - 1);
        test && transformTime((timeRun - 1) / 60);
      }, 100);
    }else if(timeRun===0){
      audio.play();
      setTimeRun("");
      current[0]==="session" && setCurrent(["break", "Pausa"]);
      current[0]==="break" && setCurrent(["session", "Sesión"]);
      setRunning(false);
    }
  }
  
  const addAndSubtract = (state, operation) => {
    const getValue = (state) => eval(`${state}${operation}1`);
    const getLimit = (state) => operation==="-" ? state>1 : state<60;
    if(!start){
      if(state==="break"){
        let value = getValue(breakLength);
        let limit = getLimit(breakLength);
        if(limit){ setBreakLength(value);
          if(current[0]==="break"){
            setTimeRun(value * 60);
            transformTime(value);
          }
        }
      } else if(state==="session"){
        let value = getValue(sessionLength);
        let limit = getLimit(sessionLength);
        if(limit){ setSessionLength(value);
          if(current[0]==="session"){
            transformTime(value);
            setTimeRun(value * 60);
          }
        }
      }
    }
  }
  
  const resetClock = (audio, timeLeft) => {
    setCurrent(["session", "Sesión"]);
    audio.pause();
    audio.currentTime=0;
    addClass("time-finish", "time-run", "time-pause", timeLeft);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft("");
    setTimeRun("");
    setStart(false);
    setRunning(false);
    setReset(false);
    setSecond(0);
  }

  useEffect(()=>{
    const timeLeft = document.querySelector("#time-left");
    const audio = document.querySelector("#beep");
    audio.volume=".6";
    reset && resetClock(audio, timeLeft);
    if(!running){  
      if(current[0]==="session"){
        transformTime(sessionLength);
        setTimeRun(sessionLength * 60);
      } else if(current[0]==="break"){
        transformTime(breakLength);
        setTimeRun(breakLength * 60);
      }
    }
    start && countdown(second, audio, timeLeft);
    !start && addClass("time-finish", "time-run", "time-pause", timeLeft);
  },[current, start, running, sessionLength, breakLength, reset, second]);
  
  return(
    <div className="bg-pink-900 h-screen flex justify-center items-center">
      <audio id="beep" src="https://project-web-sound2.s3.us-east-2.amazonaws.com/campana-box.mp3"> 
        Audio not soported.
      </audio>
      <div className="flex flex-row justify-around grid grid-cols-6 gap-4">

        <div className="p-30 max-h-max text-center bg-slate-50 rounded-md shadow-lg col-start-1 col-end-3">
          <div id="break-label">
            Tiempo de pausa
          </div>
          <div id="break-length" className="num-length">
            {breakLength}
          </div>
          <div className="btn-group flex justify-around">
            <div id="break-decrement" className=" m-2 rounded-full h-10 w-10 flex items-center bg-pink-200 justify-center shadow-lg border-2 border-pink-400 hover:border-2 hover:border-gray-500 focus:outline-none " onClick={()=> addAndSubtract("break", "-")}>
              -
            </div>
            <div id="break-increment" className="btn m-2 rounded-full h-10 w-10 flex items-center bg-pink-200 justify-center shadow-lg border-2 border-pink-400 hover:border-2 hover:border-gray-500 focus:outline-none" onClick={()=> addAndSubtract("break", "+")}>
              +
            </div>
          </div>
        </div>

        <div className="p-30 max-h-max text-center bg-slate-50 rounded-md shadow-lg col-end-7 col-span-2">
          <div id="session-label">
            Tiempo de sesión 
          </div>
          <div id="session-length" className="num-length">
            {sessionLength}
          </div>
          <div className="btn-group flex justify-around">
            <div id="session-decrement" className="btn m-2 rounded-full h-10 w-10 flex items-center bg-pink-200 justify-center shadow-lg border-2 border-pink-400 hover:border-2 hover:border-gray-500 focus:outline-none" onClick={()=> addAndSubtract("session", "-")}>
              -
            </div>
            <div id="session-increment" className="btn m-2 rounded-full h-10 w-10 flex items-center bg-pink-200 justify-center shadow-lg border-2 border-pink-400 hover:border-2 hover:border-gray-500 focus:outline-none" onClick={()=> addAndSubtract("session", "+")}>
              +
            </div>
          </div>
        </div>
        
        <div className="rounded-full h-50 w-50 text-center bg-slate-50 shadow-lg col-start-1 col-end-7 items-center">
          <div id="timer-label" className='mb-10 text-xl'>
            { current[1] }
          </div>
          <div id="time-left">
            {timeLeft}
          </div>
          <div className="flex justify-around items-center ">
            <div id="start_stop" onClick={()=> setStart(!start)}>
              <img src = "https://i.postimg.cc/tZHMmCLH/playstop.png"alt="playstop" width="50px" />
            </div>
            <div id="reset" onClick={()=> {setStart(false); setReset(true)}}>
              <img src="https://i.postimg.cc/mc9nwFpw/resete.png" alt="reset" width="50px" />
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default App;


