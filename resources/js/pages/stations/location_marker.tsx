import { icon, LatLng } from 'leaflet';
import { useState } from 'react';
import { Marker, Tooltip, useMapEvents } from 'react-leaflet';

function LocationMarker({
    setLatLngPosition,
    latLngPosition,
    title,
    time,
}: {
    setLatLngPosition?: React.Dispatch<React.SetStateAction<LatLng | null>>;
    latLngPosition: LatLng | null;
    title?: string;
    time?: Date;
}) {
    const [tooltip, setTooltip] = useState(true);
    useMapEvents({
        click(e) {
            if (setLatLngPosition) {
                setLatLngPosition(e.latlng);
                setTooltip(false);
            }
        },
    });

    return latLngPosition === null ? null : (
        <Marker position={latLngPosition} icon={icon({ iconSize: [45, 45], iconAnchor: [22, 45], iconUrl: '/storage/images/station-marker.png' })}>
            {title && tooltip && (
                <Tooltip sticky>
                    <div className="flex flex-col items-center justify-center">
                        <span>{title}</span>
                        <span>{time ? time?.toLocaleTimeString() : ''}</span>
                    </div>
                </Tooltip>
            )}
        </Marker>
    );
}

export default LocationMarker;
