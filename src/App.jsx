import axios from 'axios';
import { useEffect, useState } from 'react';
const App = () => {

  const [images, setImages] = useState('');
  const [uploadObject, setUploadObject] = useState("");
  const baseURL = "http://13.51.135.173:3000";
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    const getImages =async () => {
    axios.get(`${baseURL}/s3/get`).then(response => {
        if(response){
          setImages(response.data);
        }
    }) }

    getImages();
  },[])

  const handleView = async(key) => {
    axios.post(`${baseURL}/s3/show`,{
      key
    }).then((response)=>{
      if(response.data){
        console.log(response)
       window.open(response.data,"_blank")
      }
    }).catch(err=>{
      console.log(err);
    })
  }

  const s3Put = async(url, formData) => {
    setLoading(true);
    axios.put(url, formData).then(response => {
      console.log(response)
    }).catch(err => {
      console.log(err);
    }).finally(() =>
      setLoading(false)
    )
  }

  const handleUpload = async(e) => {
    e.preventDefault();
    setLoading(true)
    console.log("uploading...")
    const formData = new FormData();
    formData.append("file",uploadObject);
    axios.post(`${baseURL}/s3/upload`,
      formData
    ).then(response => {
      console.log(response.data);
      s3Put(response.data, formData);
    }).catch(err => {
      console.log(err);
    }).finally(() => {
      setImages("")
    })
  }

  return(
    <>
    { loading ? <div className='w-screen h-screen bg-gray-200 flex justify-center items-center text-2xl'>loading...</div> : 
    <div className="flex justify-center bg-gray-200 h-screen overflow-auto">
   <div className='flex-column items-center w-7/12 bg-orange-300 p-5'>
    <div className="text-2xl font-bold text-gray-500 p-3 rounded bg-blue-400 w-full">My cloud photo storage</div>
    <form className="text-sm p-3">
      <label htmlFor='img' className='block font-bold'>Select your photo:</label>
      <input type="file" id="img" onChange={(e)=> {setUploadObject(e.target.files[0])}}/>
      <button onClick={(e) => handleUpload(e)} className="bg-blue-500 p-1 rounded hover:bg-blue-300">upload</button>
    </form>
      <section className=''>
      {images ? images.Contents.map( (image,i) => (
        <div className='p-2' key={i}>
          <button onClick={() => handleView(image.Key)} className='hover:bg-blue-200'>{i+1}: {image.Key} </button>
        </div>
      )) :
      <>No images uploaded yet</>}
    </section>
    </div>
    </div>}
    </>
  )
}

export default App;