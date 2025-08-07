import { Analytics } from "@vercel/analytics/react"
import { useState , useEffect } from 'react'
import axios from "axios";
import './App.css'


function App() {
  
  const API_KEY = 'nhyf8mhgOJJPEbzcX5lnGWq3kcQDbRhFDiLwZa9UkBZzNzcT1QhgRZXBlkrP';
  const [img , setImg] = useState("");
    const [loading , setLoading] = useState(false);
    const [qrdata, setQrdata] = useState("https://www.instagram.com/neethi__krishnan__13");
   const [shortbtn , setShortbtn] = useState(false);
   const [longUrl , setLongUrl] = useState("https://www.linkedin.com/in/neethi-krishnan-v");
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
      shorturlbtn();

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
    function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
    const shorturlbtn = async ()=>{
       try {
          //const response = await axios.post("http://localhost:3000/shorten", {longUrl});
          if (!isValidUrl(longUrl)) {
              alert("Please enter a valid URL (starting with http:// or https://)");
              return;
          }
          const response = await axios.post(
            'https://api.tinyurl.com/create',
              {
                url : longUrl,
                domain: "tinyurl.com",
              },
              {
                headers: {
                      Authorization: "Bearer nhyf8mhgOJJPEbzcX5lnGWq3kcQDbRhFDiLwZa9UkBZzNzcT1QhgRZXBlkrP", // <--- Put your TinyURL API key
                      "Content-Type": "application/json"
                    }
              }
        );

          console.log("Shortened URL:", response.data.data.tiny_url);
          setShorturl(response.data.data.tiny_url);
      } catch (error) {
        console.error("Error shortening URL:", error.message);
      }

    }
    
    const copyshrotlink = ()=>{
      if(!shorturl){
        alert("There is no Short Url");
        return;
      }
      navigator.clipboard.writeText(shorturl).then(()=>{
        alert("Link is Copied to clipboard");
      }).catch((err)=>{console.error(err)})
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
      
    </div>}  
    {shortbtn &&
    
    <div className="app-container">
      <h2>Shorten URL</h2>
     <div>
      <label htmlFor="inputdata1" className='input-label'>
      Enter Long URL:
     </label>
     <input type="text" id ="inputdata1" placeholder="Enter Link" value={longUrl} onChange={(e)=>{setLongUrl(e.target.value)}}/>
      <label htmlFor="inputdata2" className='input-label' >
      Shorten URL:
     </label> <a href={shorturl} target="_blank" rel="noopener noreferrer">
     <input type="text" id ="inputdata2" value={shorturl}  className="linkshort" readOnly/> </a>
     <button type="button" className='btnQ Generate' onClick={shorturlbtn}>Generate Short URL</button>
     <button type="button" className='btnQ Download' onClick={copyshrotlink}>Copy Short URL</button>


     </div> <br /> <br />
    </div>
    
    } 
    <Analytics />
   </>
    
  )
}

export default App
