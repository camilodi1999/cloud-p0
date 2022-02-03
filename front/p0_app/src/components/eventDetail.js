import { useEffect, useState } from "react";
import authService from "../services/authService";

function EventDetail(props) {
  function clickDetalle() {
    setDetalle(true);
  }
  function clickEliminar() {
    const url_back = "http://localhost:5000";
    setDetalle(false);
    let user = JSON.parse(localStorage.getItem("user"));
    console.log(user);
    if (user) {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("x-access-token", user["token"]);
      fetch(url_back + "/events/" + event.id, {
        headers: myHeaders,
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((json) => {
          setEvent({});
          setEliminado(true);
        });
    }
  }

  console.log(props.event);
  const [event, setEvent] = useState({});
  const [detalle, setDetalle] = useState(false);
  const [eliminado, setEliminado] = useState(false);
  useEffect(() => {
    setEvent(props.event);
  }, []);
  if (!eliminado) {
    return (
      <div className="row">
        <div className="col-8">
          <div className="card" style={{ width: "10rem" }}>
            <div className="card-body">
              <h5 className="card-title">{event.name}</h5>
              <p className="card-text">{event.place}</p>
              <button
                type="button"
                class="btn btn-primary"
                onClick={clickDetalle}
              >
                Mas Info
              </button>
              <button
                type="button"
                class="btn btn-danger"
                onClick={clickEliminar}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
        <div className="col-4">
          {detalle ? (
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Direccion: </th>
                  <th scope="col">{event.address}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Fecha Inicio</th>
                  <th scope="row">{event.date_start.split("T")[0]}</th>
                </tr>
                <tr>
                  <th scope="row">Fecha Fin</th>
                  <th scope="row">{event.date_end.split("T")[0]}</th>
                </tr>
                <tr>
                  <th scope="row">Lugar</th>
                  <th scope="row">{event.place}</th>
                </tr>
                <tr>
                  <th scope="row">Virtual</th>
                  <th scope="row">{event.virtual ? "Si" : "No"}</th>
                </tr>
              </tbody>
            </table>
          ) : null}
        </div>
      </div>
    );
  } else {
    return null;
  }
}

export default EventDetail;
