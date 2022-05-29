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
      },
    );
    setResult(res.data.species);
  };

  useEffect(() => {
    if (result) {
      async function getList() {
        const res = await axios.get(
          `https://ana-prototype-back.herokuapp.com/photos/${result}`,
        );
        setList(res.data);
      }
      getList();
    }
  }, [result]);

  return (
    <div className="flex items-center justify-center flex-col">
      <h1 className="border-gray-800 text-2xl font-bold mb-4 mt-4">
        사진 업로드
      </h1>
      <input
        accept="image/*"
        id="icon-button-file"
        type="file"
        name="imageURL"
        onChange={(e) => handleCapture(e.target)}
        className="hidden"
      />
      <div className="w-20 h-6 bg-camera-color rounded mb-4">
        <label
          htmlFor="icon-button-file"
          className=" text-white w-full h-full cursor-pointer flex justify-center items-center "
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
          margin: "10px",
        }}
      >
        결과 가져오기
      </button>

      {result && (
        <h1 className="border-gray-800 text-2xl font-bold mb-4 mt-4">
          종 : {result}
        </h1>
      )}

      {list.length > 0 && (
        <div className="min-h-screen  flex justify-center items-center flex-col">
          {list.map((item, index) => (
            <div
              className="max-w-2xl bg-white border-2 border-gray-800 p-5 rounded-md tracking-wide shadow-lg mb-4"
              key={`table ${index}`}
            >
              <h4 className="text-2xl font-bold mb-2 text-center">
                {item.name}
              </h4>

              <img
                alt="animal"
                className="w-45 rounded-md border-2"
                src={item.imageURL}
                width="100%"
              />

              <div className="flex flex-col ml-5">
                <ul className="list-disc mt-2">
                  <li>
                    <p>
                      <span className="text-lg font-semibold">종 </span> <br />{" "}
                      {item.species}
                    </p>
                  </li>
                  <li>
                    <p>
                      <span className="text-lg font-semibold">발견 위치 </span>
                      <br /> {item.location}
                    </p>
                  </li>
                  <li>
                    <p>
                      <span className="text-lg font-semibold">특징 </span>
                      <br />
                      {item.feature}
                    </p>
                  </li>
                  <li>
                    {" "}
                    <button
                      style={{
                        padding: "6px 25px",
                        backgroundColor: "#ffbf69",
                        borderRadius: "4px",
                        color: "white",
                        cursor: "pointer",
                        border: "none",
                        margin: "10px",
                      }}
                    >
                      연락하기
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CameraComp;
