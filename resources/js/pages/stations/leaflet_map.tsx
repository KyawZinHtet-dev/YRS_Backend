import { LatLng } from 'leaflet';
import moment from 'moment';
import { MapContainer, TileLayer } from 'react-leaflet';
import LocationMarker from './location_marker';

const LeafletMap = ({
    setLatLngPosition,
    centerPosition,
    data,
}: {
    setLatLngPosition?: React.Dispatch<React.SetStateAction<LatLng | null>>;
    centerPosition: LatLng | null;
    data: { latLngPosition: LatLng | null; title?: string; time?: string }[];
}) => {
    return (
        <div>
            <MapContainer
                className="h-[450px] w-full"
                center={[centerPosition?.lat ?? 16.781053, centerPosition?.lng ?? 96.161943]}
                zoom={14}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {data.length > 1 ? (
                    data.map((d) => (
                        <LocationMarker
                            key={d.title}
                            time={moment(d.time, 'HH:mm').toDate()}
                            title={d.title}
                            setLatLngPosition={setLatLngPosition}
                            latLngPosition={d.latLngPosition}
                        />
                    ))
                ) : (
                    <LocationMarker
                        key={data[0].title}
                        title={data[0].title}
                        setLatLngPosition={setLatLngPosition}
                        latLngPosition={data[0].latLngPosition}
                    />
                )}
            </MapContainer>
        </div>
    );
};

export default LeafletMap;
