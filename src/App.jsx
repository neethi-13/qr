import { Analytics } from "@vercel/analytics/react"
import { useState , useEffect } from 'react'
import axios from "axios";
import './App.css'


function App() {
  

  const [img , setImg] = useState("");
    const [loading , setLoading] = useState(false);
    const [qrdata, setQrdata] = useState("https://www.instagram.com/neethi__krishnan__13");
   const [shortbtn , setShortbtn] = useState(true);
   const [longurl , setLongurl] = useState("https://www.linkedin.com/in/neethi-krishnan-v");
   const [shorturl , setShorturl] = useState("");
    
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
    
    const API_KEY = 'd46b985b3c884217005017e23ed5f6b23447b';
    const shorturlbtn = async ()=>{
       try {
      const res = await axios.get(`https://cutt.ly/api/api.php?key=${API_KEY}&short=${longurl}`);
      if(res.data.url.status === 7){
        setShorturl(res.data.url.shortLink);
      }

      
    } catch (error) {
      console.error('Error shortening URL:', error);
    }

    }

  return (
   <> <div className="shortdiv">
   <button className='btnQ short' onClick={()=>setShortbtn(!shortbtn)}>
    {shortbtn ?"QR generator" :"Shorten URL" }
   </button>
   </div>
   {!shortbtn &&
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
    </div>}  
    {shortbtn &&
    <>
    <div className="app-container">
      <h2>Shorten URL</h2>
     <div>
      <label htmlFor="inputdata1" className='input-label'>
      Enter Long URL:
     </label>
     <input type="text" id ="inputdata1" placeholder="Enter Link" value={longurl} onChange={(e)=>{setLongurl(e.target.value)}}/>
      <label htmlFor="inputdata2" className='input-label' >
      Shorten URL:
     </label>
     <input type="text" id ="inputdata2" value={shorturl}  readOnly/>
     <button type="button" className='btnQ Generate' onClick={shorturlbtn}>Generate Short URL</button>
     <button type="button" className='btnQ Download' >Copy Short URL</button>


     </div> <br /> <br />
    </div>
    
    </>} 
   </>
    
  )
}

export default App
