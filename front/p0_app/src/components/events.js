import { useEffect, useState } from "react";
import authService from "../services/authService";
import EventDetail from "./eventDetail";

function Events(props) {
  const url_back = "http://localhost:5000";
  const [listEvent, setEvents] = useState([]);
  function eventos() {
    let user = JSON.parse(localStorage.getItem("user"));
    console.log(user);
    if (user) {
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("x-access-token", user["token"]);
      fetch(url_back + "/events", {
        headers: myHeaders,
        method: "GET",
      })
        .then((res) => res.json())
        .then((json) => {
          let lista = json.events;
          console.log(lista);
          setEvents(lista);
          console.log(listEvent);
        });
    }
  }
  useEffect(() => {
    setTimeout(() => {
      let user = JSON.parse(localStorage.getItem("user"));
      console.log(user);
      if (user) {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("x-access-token", user["token"]);
        fetch(url_back + "/events", {
          headers: myHeaders,
          method: "GET",
        })
          .then((res) => res.json())
          .then((json) => {
            //setEvents(json.events);
          });
      }
      eventos();
    }, 2000);
  }, []);

  return (
    <div className="container-fluid">
      <div className="container-fluid" style={{ textAlign: "center" }}>
        <h3>Eventos</h3>
      </div>
      {listEvent.map((e) => (
        <EventDetail event={e} key={e.id} />
      ))}
    </div>
  );
}

export default Events;
