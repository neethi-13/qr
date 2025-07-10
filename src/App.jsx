import { Analytics } from "@vercel/analytics/react"
import { useState , useEffect } from 'react'

import './App.css'


function App() {
  

  const [img , setImg] = useState("");
    const [loading , setLoading] = useState(false);
    const [qrdata, setQrdata] = useState("https://www.instagram.com/neethi__krishnan__13");
    
    async function GenerateQR(){
        setLoading(true);
        try { 
          if(qrdata == ""){
            alert("Please enter a valid URL");
            return;
          }
            const url = `https://api.qrserver.com/v1/create-qr-code/?size=150X150&data=${encodeURIComponent(qrdata)}`;
            setImg(url);
        } catch (error) {
            console.error("Error generating QR code:", error);
        }
        finally{
            setLoading(false);
        }
        
        
    }

    useEffect(() =>{
      GenerateQR();
    },[]);

    const EnterClick = (e) =>{
      if(e.key == 'Enter'){
        if(qrdata ==""){
          alert("Please enter a valid URL");
        }else{

          GenerateQR();
        }
      }
    }

    function DownloadQR(){  
        fetch(img)
        .then((response)=>response.blob())
        .then((blob)=>{
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "QRcode.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }).catch((error)=>{
            console.error("Error downloading QR code:", error);
        });
    }
  return (
    <div className='app-container'>
      <h2>QR Code Generator</h2>
        
        <img src={img} className='qr-code-img' alt="" /> <br /> <br />
        {loading && <p>Please Wait....</p> }
      <div>
        <label htmlFor="datainput" className='input-label'>
            Enter Link 
        </label>
        <input type="text" id="datainput" value={qrdata} onChange={(e)=>setQrdata( e.target.value)} onKeyDown={EnterClick} placeholder='Give Link Here' /> <br />
         <button type="button" className='btnQ Generate' disabled={loading} onClick={GenerateQR}>Generate QR code</button>
        <button type="button" className='btnQ Download' onClick={DownloadQR}>Download QR code</button>
      </div> <br />
      <Analytics />
    </div>
    
  )
}

export default App
