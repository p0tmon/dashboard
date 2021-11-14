import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { Map, Marker } from "pigeon-maps";
import { useTable } from 'react-table';


function deviceIdAlert(marker: any) {
  alert("Device Id: " + marker.id);
}

function Table(prop: { columns: any; data: any }) {
  const { columns, data } = prop;
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  });

  // Render the UI for your table
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function App() {
  const [markers, setMarkers] = useState([
    { id: "0", position: [50.935947, -1.3983617] },
    { id: "1", position: [50.935447, -1.3983617] },
  ]);

  const [currentId, setCurrentId] = useState<String | null>(null);
  const [logData, setLogData] = useState([
    { id: "0", time: "2021-11-14 09:45:57.140698"}
  ]);

  const tableData = useMemo(() =>
    currentId === null ? logData : logData.filter((log: any) =>
      log.id == currentId),
    [logData, currentId]);

  const center = useMemo(() =>
    markers
      .reduce((res, m) => [res[0] + m.position[0], res[1] + m.position[1]], [0, 0])
      .map((v) => v / markers.length),
    [markers]);

  useEffect(() => {
    // console.log(markers);
    // here you should fetch the markers and use setMarkers to update the value
    setTimeout(() => {
      // alert("data saved");
      fetch('https://potmon-api.tdom.dev/get?type=geo')
        .then(response => response.json())
        .then(data => {
          const newMarkers = data.response.map((entry: any) => ({
            id: entry.id,
            position: [entry.lon, entry.lat]
          }));
          setMarkers(newMarkers);
          console.log(data.response, newMarkers);
        });

      fetch('https://potmon-api.tdom.dev/get?type=log')
        .then(response => response.json())
        .then(data => {
          console.log("log: ", data.response);
          setLogData(data.response);
        });
    }, 500);
    console.log(markers);
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: 'Id',
        accessor: 'id',
      },
      {
        Header: 'Time',
        accessor: 'time',
      },
    ],
    []
  );

  return (
    <div className="container">
      <h1>Potmon</h1>
      <div className="map-container">
        <h3>Sensor position map</h3>
        <Map height={480} center={center as [number, number]} defaultZoom={11}>
          { markers.map((m, i) =>
            <Marker key={i}
                    width={50}
                    anchor={m.position as [number, number]}
                    onClick={() => {
                      setCurrentId(m.id === currentId ? null : m.id);
                      return deviceIdAlert(m);
                    }}
            />
          )}
        </Map>
      </div>
      <div className="log-container">
        <h3>Event log</h3>
        <Table columns={columns} data={tableData} />
      </div>

    </div>
  );
}

export default App;
