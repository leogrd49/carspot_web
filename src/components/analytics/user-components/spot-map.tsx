import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import supabase from "../../../../utils/supabase";

// Définition du type pour un spot
interface Spot {
  latitude: number;
  longitude: number;
  name: string;
  id?: number;
}

const SpotMap = () => {
  const [spots, setSpots] = useState<Spot[]>([]);
  const mapRef = useRef<L.Map | null>(null); // Référence pour la carte Leaflet

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('user_collections')
        .select("*");

      if (error) {
        console.error("Erreur lors de la récupération des spots:", error);
        return;
      }

      const formattedSpots: Spot[] = data.map((spot: any) => ({
        latitude: spot.latitude,
        longitude: spot.longitude,
        name: spot.location,
      }));

      setSpots(formattedSpots);
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Initialisation de la carte
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView([46.603354, 1.888334], 6);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(mapRef.current);
    }

    // Ajout des marqueurs sur la carte
    if (mapRef.current && spots.length) {
      spots.forEach((spot) => {
        if (spot.latitude && spot.longitude) {
          L.marker([spot.latitude, spot.longitude])
            .addTo(mapRef.current!)
            .bindPopup(`<strong>${spot.name}</strong>`);
        } else {
          console.warn(`Coordonnées invalides pour le spot: ${spot.name}`);
        }
      });
    }

    // Nettoyage lors de la suppression du composant
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null; // Réinitialisation
      }
    };
  }, [spots]);

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
      <div id="map" className="w-full h-full" />
    </div>
  );
};

export default SpotMap;
