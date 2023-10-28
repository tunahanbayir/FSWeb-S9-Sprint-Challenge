import React, { useState } from 'react'
import axios from 'axios';
import { response } from 'msw';


// önerilen başlangıç stateleri
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 //  "B" nin bulunduğu indexi

const initialState = {
  message: "",
  email: "",
  steps: 0,
  index: 4,

};

export default function AppFunctional(props) {
  // AŞAĞIDAKİ HELPERLAR SADECE ÖNERİDİR.
  // Bunları silip kendi mantığınızla sıfırdan geliştirebilirsiniz.
  const [state, setState] = useState(initialState)

  function getXY() {
    // Koordinatları izlemek için bir state e sahip olmak gerekli değildir.
    // Bunları hesaplayabilmek için "B" nin hangi indexte olduğunu bilmek yeterlidir.
    let x = (state.index % 3) + 1
    let y = Math.floor(state.index / 3) + 1

    return {x, y};
  }

  function getXYMesaj() {
    // Kullanıcı için "Koordinatlar (2, 2)" mesajını izlemek için bir state'in olması gerekli değildir.
    // Koordinatları almak için yukarıdaki "getXY" helperını ve ardından "getXYMesaj"ı kullanabilirsiniz.
    // tamamen oluşturulmuş stringi döndürür.
  }

  function reset() {
    // Tüm stateleri başlangıç ​​değerlerine sıfırlamak için bu helperı kullanın.
    setState(initialState);
  }

  function sonrakiIndex(yon) {
    // Bu helper bir yön ("sol", "yukarı", vb.) alır ve "B" nin bir sonraki indeksinin ne olduğunu hesaplar.
    // Gridin kenarına ulaşıldığında başka gidecek yer olmadığı için,
    // şu anki indeksi değiştirmemeli.
    if (yon === "left" && getXY().x !== 1) {
      setState({
        ...state, 
        index : state.index - 1,
        steps : state.steps + 1,
        message: "",
  
      });
    }else if (yon === "right" && getXY().x !== 3) {
      setState({
        ...state, 
        index : state.index + 1,
        steps : state.steps + 1,
        message: "",
  
      });
  }else if (yon === "up" && getXY().y !== 1) {
    setState({
      ...state, 
      index : state.index - 3,
      steps : state.steps + 1,
      message: "",

    });
  }else if (yon === "down" && getXY().y !== 3) {
    setState({
      ...state, 
      index : state.index + 3,
      steps : state.steps + 1,
      message: "",

    });
  }
  }

  function ilerle(evt) {
    // Bu event handler, "B" için yeni bir dizin elde etmek üzere yukarıdaki yardımcıyı kullanabilir,
    // ve buna göre state i değiştirir.
    const {id: yon} = evt.target;
    if (getXY().x === 1 && yon === "left") {
      setState({
        ...state,
        message: "Sola gidemezsiniz",
      })
    }else if (getXY().x === 3 && yon === "right") {
      setState({
        ...state,
        message: "Sağa gidemezsiniz",
      })
    }else if (getXY().y === 1 && yon === "up") {
      setState({
        ...state,
        message: "Yukarıya gidemezsiniz",
      })
    }else if (getXY().y === 3 && yon === "down") {
      setState({
        ...state,
        message: "Aşağıya gidemezsiniz",
      })
    }else {
      sonrakiIndex(yon);
    }
  }

  function onChange(evt) {
    // inputun değerini güncellemek için bunu kullanabilirsiniz
    const {name, value} = evt.target;

    setState({
      ...state,
      email: value,
    })
    
  }

  function onSubmit(evt) {
    // payloadu POST etmek için bir submit handlera da ihtiyacınız var.
    evt.preventDefault();
    axios
    .post("http://localhost:9000/api/result", {
      x: getXY().x,
      y: getXY().y,
      email: state.email,
      steps: state.steps,
    })
    .then((response) => {
      setState({
        ...state,
        message: response.data.message,
        email: "",
      }).catch((error) => {
        setState({
          ...state,
          message: error.response.data.message,
        });
      });
    });
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">Koordinatlar ({getXY().x}, {getXY().y})</h3>
        <h3 id="steps">{state.steps} kere ilerlediniz</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === state.index ? ' active' : ''}`}>
              {idx === state.index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{state.message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick= {ilerle}>SOL</button>
        <button id="up" onClick= {ilerle}>YUKARI</button>
        <button id="right" onClick= {ilerle}>SAĞ</button>
        <button id="down" onClick= {ilerle}>AŞAĞI</button>
        <button id="reset" onClick= {reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" onChange={onChange} value={state.email} type="email" placeholder="email girin"></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
