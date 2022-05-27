import React, { useState } from "react";
import { AiFillCamera } from "react-icons/ai";
import axios from "axios";

function CameraComp() {
  const [file, setFile] = useState(null);
  const [source, setSource] = useState(null);
  const [result, setResult] = useState(null);

  const handleCapture = (target) => {
    if (target.files) {
      if (target.files.length !== 0) {
        const file = target.files[0];
        const newUrl = URL.createObjectURL(file);

        setFile(file);
        setSource(newUrl);
      }
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("imageURL", file);
    const res = await axios.post("http://localhost:5005/photos", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(res.data);
    setResult(res.data.species);
  };

  return (
    <div>
      <h1>사진 업로드</h1>
      <input
        accept="image/*"
        id="icon-button-file"
        type="file"
        name="imageURL"
        onChange={(e) => handleCapture(e.target)}
        style={{ display: "none" }}
      />
      <label
        htmlFor="icon-button-file"
        style={{
          padding: "6px 25px",
          backgroundColor: "#FF6600",
          borderRadius: "4px",
          color: "white",
          cursor: "pointer",
        }}
      >
        <AiFillCamera />
      </label>

      {source && <img src={source} alt="animal" width="200" />}

      <button
        onClick={handleSubmit}
        style={{
          padding: "6px 25px",
          backgroundColor: "#ffbf69",
          borderRadius: "4px",
          color: "white",
          cursor: "pointer",
          border: "none",
          margin: "0 10px",
        }}
      >
        결과 가져오기
      </button>
      {result && <h1>종 : {result}</h1>}
    </div>
  );
}

export default CameraComp;
