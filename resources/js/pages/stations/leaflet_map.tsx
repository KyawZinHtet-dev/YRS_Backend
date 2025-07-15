import { LatLng } from 'leaflet';
import { MapContainer, TileLayer } from 'react-leaflet';
import LocationMarker from './location_marker';

const LeafletMap = ({
    setLatLngPosition,
    latLngPosition,
    centerPosition,
}: {
    setLatLngPosition: React.Dispatch<React.SetStateAction<LatLng | null>>;
    latLngPosition: LatLng | null;
    centerPosition: LatLng | null;
}) => {
    return (
        <div>
            <MapContainer
                className="w-ful h-[345px]"
                center={[centerPosition?.lat ?? 16.781053, centerPosition?.lng ?? 96.161943]}
                zoom={15}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker setLatLngPosition={setLatLngPosition} latLngPosition={latLngPosition} />
            </MapContainer>
        </div>
    );
};

export default LeafletMap;
