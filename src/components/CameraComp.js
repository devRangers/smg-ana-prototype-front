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
    const res = await axios.post("https://ana-prototype-back.herokuapp.com/photos", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    setResult(res.data.species);
  };

  useEffect(() => {
    if (result) {
      async function getList() {
        const res = await axios.get(`https://ana-prototype-back.herokuapp.com/photos/${result}`);
        setList(res.data);
      }
      getList();
    }
  }, [result]);

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

      {list.length > 0 && (
        <table border="1">
          <th>종</th>
          <th>이름</th>
          <th>발견 위치</th>
          <th>특징</th>
          <th>사진</th>
          {list.map((item) => (
            <tr>
              <td>{item.species}</td>
              <td>{item.name}</td>
              <td>{item.location}</td>
              <td>{item.feature}</td>
              <td>
                <img src={item.imageURL} alt="animal" width="200" />
              </td>
            </tr>
          ))}
        </table>
      )}
    </div>
  );
}

export default CameraComp;
