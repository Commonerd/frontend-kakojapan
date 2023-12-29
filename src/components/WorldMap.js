import React, { useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { marker } from "leaflet";
import iconUrl from "../assets/camera.png"; // marker-icon.png 파일 경로
import axios from "axios"; // Axios 라이브러리 import


const customIcon = new L.Icon({
  iconUrl,
  iconSize: [41, 41], // 아이콘 크기 조정 (가로, 세로)
  iconAnchor: [12, 41], // 아이콘 앵커 설정
  popupAnchor: [1, -34], // 팝업 앵커 설정
  shadowSize: [41, 41], // 그림자 크기
});

const WorldMap = () => {
  const [clickedPosition, setClickedPosition] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const modalRef = useRef(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // 추가된 상태
  const [markerExists, setMarkerExists] = useState(false);

  const handleMapClick = (e) => {
    setClickedPosition(e.latlng);
    if (markerExists) {
      setClickedPosition(null);
      setMarkerExists(false);
      return;
    }
  };

  const handleMapRightClick = (e) => {
    const { lat, lng } = e.latlng;
    setClickedPosition({ lat, lng });
    setMarkerExists(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        setSelectedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    const data = new FormData();
    data.append("image", selectedImage);
    data.append("lat", clickedPosition.lat);
    data.append("lng", clickedPosition.lng);
    data.append("title", title);
    data.append("description", description);
    data.append("date", date);

    // requst through by axios
    axios.post('http://example.com/api/endpoint', data)
    .then((response) => {
      console.log('Success', response.data);
    })
    .catch((error) => {
      console.log('Error', error);
    });
  };

  const handleCloseModal = () => {
    // 모달이 닫힐 때 상태 초기화
    setClickedPosition(null);
    setSelectedImage(null);
    setTitle("");
    setDescription("");
    setDate("");
    setIsPopupOpen(false);
    console.log(title);

  };

  return (
    <div
      style={{ height: "calc(100vh - 10px)", width: "100%", overflowY: "auto" }}
    >
      {/* 네비게이션 바 */}
      <nav
        style={{
          backgroundColor: "#3A2922",
          padding: "10px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", width: "50%" }}>
          <span style={{ color: "white" }}>KakoJapan - Show Your History</span>
        </div>
        <div
          style={{
            width: "50%",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder="Search"
            style={{ marginRight: "10px" }}
          />
          <button>Login</button>
        </div>
      </nav>

      <div style={{ position: "relative", height: "calc(100% - 40px)" }}>
        <MapContainer
          center={[35.6895, 139.6917]}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
          onClick={handleMapClick}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapEvents handleMapRightClick={handleMapRightClick} />
          {clickedPosition && (
            <Marker position={clickedPosition} icon={customIcon}>
              <Popup
                position={clickedPosition}
                onClose={handleCloseModal}
                ref={modalRef}
              >
                <div>
                  <p>lang: {clickedPosition.lat}</p>
                  <p>lat: {clickedPosition.lng}</p>
                  <p>
                    Title:{" "}
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </p>
                  <p>
                    Description:{" "}
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </p>
                  <p>
                    Date:{" "}
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {selectedImage && (
                    <img
                      src={selectedImage}
                      alt="Selected"
                      style={{
                        maxWidth: "200px",
                        maxHeight: "200px",
                        marginTop: "20px",
                      }}
                    />
                  )}
                </div>
                <button onClick={handleSubmit}>Submit</button>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

// Leaflet 이벤트 처리를 위한 MapEvents 컴포넌트
const MapEvents = ({ handleMapRightClick }) => {
  useMapEvents({
    contextmenu: (e) => {
      handleMapRightClick(e);
    },
  });
  return null;
};

export default WorldMap;
