    import { useState, useEffect, useRef } from 'react';
    import L from 'leaflet';
    import marker from '../../../assets/marker.png'
    import 'leaflet/dist/leaflet.css';
    import supabase from "../../../../utils/supabase";
    import 'leaflet.markercluster/dist/MarkerCluster.css';
    import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
    import 'leaflet.markercluster';
    import 'leaflet.fullscreen/Control.FullScreen.css';
    import 'leaflet.fullscreen';



    // Définition du type pour un spot
    interface Spot {
    latitude: number;
    longitude: number;
    model: string;
    brand: string;
    id?: number;
    }

    const SpotMap = () => {
    const [spots, setSpots] = useState<Spot[]>([]);
    const mapRef = useRef<L.Map | null>(null); // Référence pour la carte Leaflet

    useEffect(() => {
        const fetchData = async () => {
          // Étape 1 : Récupérer les spots et leurs modèles
          const { data: userCollections, error: userCollectionsError } = await supabase
            .from('user_collections')
            .select('latitude, longitude, model_id'); // On récupère les spots avec le model_id

          if (userCollectionsError) {
            console.error("Erreur lors de la récupération des spots:", userCollectionsError);
            return;
          }

          // Étape 2 : Récupérer les modèles associés avec leurs marques
          const { data: models, error: modelsError } = await supabase
            .from('models')
            .select('id, name, brand_id'); // Récupérer le nom du modèle et son brand_id

          if (modelsError) {
            console.error("Erreur lors de la récupération des modèles:", modelsError);
            return;
          }

          // Étape 3 : Récupérer les marques associées
          const { data: brands, error: brandsError } = await supabase
            .from('brands')
            .select('id, name'); // Récupérer le nom de la marque

          if (brandsError) {
            console.error("Erreur lors de la récupération des marques:", brandsError);
            return;
          }

          // Étape 4 : Associer les modèles et les marques aux spots
          const formattedSpots: Spot[] = userCollections.map((spot: any) => {
            // Trouver le modèle associé au model_id
            const model = models.find((model: any) => model.id === spot.model_id);
            // Trouver la marque associée au brand_id du modèle
            const brand = model ? brands.find((brand: any) => brand.id === model.brand_id) : null;

            return {
              latitude: spot.latitude,
              longitude: spot.longitude,
              model: model ? model.name : 'Modèle inconnu',
              brand: brand ? brand.name : 'Marque inconnue',
            };
          });

          setSpots(formattedSpots);
        };

        fetchData();
      }, []);

    useEffect(() => {
        if (!mapRef.current) {
          mapRef.current = L.map('map', {
            fullscreenControl: true, // Active le bouton de plein écran
            fullscreenControlOptions: {
              position: 'topright' // Position du bouton
            },
            minZoom: 3, // Empêche de trop dézoomer
            maxZoom: 18, // Zoom max autorisé
            maxBounds: [
                [85, -180],  // Limite nord-ouest
                [-85, 180]   // Limite sud-est
      ],
      maxBoundsViscosity: 1.0 // Empêche de sortir des limites
          }).setView([46.603354, 1.888334], 6);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
          }).addTo(mapRef.current);
        }

        // Ajout du regroupement de marqueurs
        const markerClusterGroup = (L as any).markerClusterGroup();

        const myIcon = L.icon({
          iconUrl: marker,
          iconSize: [38, 45],
        });

        spots.forEach((spot) => {
          if (spot.latitude && spot.longitude) {
            const marker = L.marker([spot.latitude, spot.longitude], { icon: myIcon })
              .bindPopup(`<strong>${spot.brand + " " + spot.model}</strong>`);

            markerClusterGroup.addLayer(marker);
          }
        });

        mapRef.current.addLayer(markerClusterGroup);

        return () => {
          if (mapRef.current) {
            mapRef.current.removeLayer(markerClusterGroup);
          }
        };
      }, [spots]);



    return (
        <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg z-[2]">
        <div id="map" className="w-full h-full" />
        </div>
    );
    };

    export default SpotMap;
