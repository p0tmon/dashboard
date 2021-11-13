import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { Map, Marker } from "pigeon-maps"


function App() {
  const [markers, setMarkers] = useState([
    { position: [50.935947, -1.3983617] },
    { position: [50.935447, -1.3983617] },
  ]);

  const center = useMemo(() => markers.reduce((res, m) => [res[0] + m.position[0], res[1] + m.position[1]], [0, 0]).map((v) => v / markers.length), [markers])

  useEffect(() => {
    // here you should fetch the markers and use setMarkers to update the value
  }, [])

  return (
    <div>
      <div className="container">
        <Map height={480} defaultCenter={center as [number, number]} defaultZoom={11}>
          {markers.map((m, i) => <Marker key={i} width={50} anchor={m.position as [number, number]} />)}
        </Map>
      </div>
    </div>
  )
}

export default App
