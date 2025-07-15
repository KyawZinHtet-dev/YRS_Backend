import { LatLng } from 'leaflet';
import { Marker, useMapEvents } from 'react-leaflet';

function LocationMarker({
    setLatLngPosition,
    latLngPosition,
}: {
    setLatLngPosition: React.Dispatch<React.SetStateAction<LatLng | null>>;
    latLngPosition: LatLng | null;
}) {
    useMapEvents({
        click(e) {
            setLatLngPosition(e.latlng);
        },
    });

    return latLngPosition === null ? null : <Marker position={latLngPosition}></Marker>;
}

export default LocationMarker;
