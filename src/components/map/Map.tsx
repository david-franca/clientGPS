import 'leaflet-defaulticon-compatibility'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import 'leaflet/dist/leaflet.css'
import { Fragment } from 'react'

import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'

import { config } from '../../config/config'
import { Vehicle } from '../../models'

const MapPlaceholder = () => {
  return (
    <p>
      Map of Brazil.{' '}
      <noscript>You need to enable JavaScript to see this map.</noscript>
    </p>
  )
}

interface MapProps {
  vehicles: Vehicle[]
  center?: { lat: number; lng: number }
}

const FlyTo: React.FC<MapProps> = ({ center, vehicles }) => {
  const map = useMap()

  if (center) {
    map.flyTo([center.lat, center.lng], 10)
  }

  return (
    <Fragment>
      <TileLayer
        url={`https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${config.mapboxKey}`}
        attribution='Map data &copy; <a href="https://www.mapbox.org/">MapBox</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
      />
      {vehicles.map(vehicle => (
        <Marker
          position={[
            vehicle.device?.location[0]?.latitude ?? 0,
            vehicle.device?.location[0]?.longitude ?? 0,
          ]}
          draggable={true}
          key={vehicle.id}
        >
          <Popup>Hey ! you found me</Popup>
        </Marker>
      ))}
    </Fragment>
  )
}

const ContainerMap: React.FC<MapProps> = ({ vehicles, center }) => {
  return (
    <MapContainer
      center={[-3.8580372, -38.495503]}
      zoom={6}
      scrollWheelZoom={false}
      placeholder={<MapPlaceholder />}
    >
      <FlyTo center={center} vehicles={vehicles} />
    </MapContainer>
  )
}

export default ContainerMap
