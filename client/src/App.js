import { useState, useEffect, useRef } from 'react';
import './App.css';
import { uploadFile } from './service/api';
import Alert from './Alert';

function App() {
  const [file, setFile] = useState('');
  const [result, setResult] = useState('');

  const fileInputRef = useRef();

  useEffect(() => {
    const getImage = async () => {
      if (file) {
        const data = new FormData();
        data.append("name", file.name);
        data.append("file", file);

        const response = await uploadFile(data);
        setResult(response.path);
      }
    }
    getImage();
  }, [file])

  const onUploadClick = () => {
    fileInputRef.current.click();
  }

  const [alert, setalert] = useState(null);

  const showAlert = (message, type) => {
    setalert({
      msg: message,
      type: type
    })
    setTimeout(() => {
      setalert(null);
    }, 2000);
  }

  const handleCopy = () => {
    const text = result;
    navigator.clipboard.writeText(text)
      .then(() => {
        showAlert("Copied to Clipboard!", "success");
      })
      .catch(err => {
        showAlert("Unable to copy to Clipboard", "error");
        console.error('Could not copy text: ', err);
      });
  };


  return (
    <>
      {alert && <Alert alert={alert} />}
      <video id="background-video" autoPlay loop muted poster="../media/bg-image.jpg">
        <source src="../media/bg-video-3.mp4" type="video/mp4" />
      </video>
      <div className='wrapper'>
        <h1>Welcome to File Sharing!</h1>
        <p>Share files effortlessly. Simply upload your file and get the download link.</p>

        <button onClick={() => onUploadClick()}>Select File</button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) => setFile(e.target.files[0])}
        />
        {result ?
          <>
            <div className='download-container'>
              <div>
                <p>Your file is ready to download:</p>
                <a href={result} target='__blank'>{result}</a>
              </div>
              <button className='copy' onClick={handleCopy}>Copy Download Link</button>
            </div>
          </>
          : <p>No File Selected! Please choose a file to upload.</p>
        }
      </div>
    </>

  );
}

export default App;
