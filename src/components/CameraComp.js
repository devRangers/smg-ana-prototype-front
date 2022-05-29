import React, { useState, useEffect } from "react";
import { AiFillCamera } from "react-icons/ai";
import axios from "axios";

function CameraComp() {
  const [file, setFile] = useState(null);
  const [source, setSource] = useState(null);
  const [result, setResult] = useState(null);
  const [list, setList] = useState([]);

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
    const res = await axios.post(
      "https://ana-prototype-back.herokuapp.com/photos",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    setResult(res.data.species);
  };

  useEffect(() => {
    if (result) {
      async function getList() {
        const res = await axios.get(
          `https://ana-prototype-back.herokuapp.com/photos/${result}`
        );
        setList(res.data);
      }
      getList();
    }
  }, [result]);

  return (
    <div className="flex items-center justify-center flex-col">
      <h1>사진 업로드</h1>
      <input
        accept="image/*"
        id="icon-button-file"
        type="file"
        name="imageURL"
        onChange={(e) => handleCapture(e.target)}
        className="hidden"
      />
      <div className="w-20 h-6 bg-camera-color rounded ">
        <label
          htmlFor="icon-button-file"
          className=" text-white w-full h-full cursor-pointer flex justify-center items-center"
        >
          <AiFillCamera />
        </label>
      </div>

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

      {list.length > 0 && (
        <table border="1">
          <thead>
            <tr>
              <th>종</th>
              <th>이름</th>
              <th>발견 위치</th>
              <th>특징</th>
              <th>사진</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => (
              <tr key={`table ${index}`}>
                <td>{item.species}</td>
                <td>{item.name}</td>
                <td>{item.location}</td>
                <td>{item.feature}</td>
                <td>
                  <img src={item.imageURL} alt="animal" width="200" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CameraComp;
