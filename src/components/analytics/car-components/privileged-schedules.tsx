import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const Heatmap = () => {
  // Données de test (7 jours x 24 heures)
  const data = Array(7).fill().map(() => 
    Array(24).fill().map(() => Math.floor(Math.random() * 100))
  );

  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  const hours = Array(24).fill().map((_, i) => `${String(i).padStart(2, '0')}h`);

  // Trouver la valeur maximale
  const maxValue = Math.max(...data.flat());

  // Fonction pour déterminer la couleur
  const getColor = (value) => {
    const intensity = (value / maxValue);
    return `rgb(${Math.round(255 * (1 - intensity))}, ${Math.round(255 * (1 - intensity))}, 255)`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Analyse de fréquentation par jour et heure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex">
            {/* Colonne des jours */}
            <div className="flex flex-col mr-2">
              <div className="h-8" /> {/* Espace pour aligner avec l'en-tête des heures */}
              {days.map((day) => (
                <div key={day} className="h-12 flex items-center font-medium min-w-24">
                  {day}
                </div>
              ))}
            </div>

            {/* Zone de défilement pour les heures */}
            <div className="overflow-x-auto">
              <div className="inline-block">
                {/* En-tête des heures */}
                <div className="flex mb-2">
                  {hours.map(hour => (
                    <div key={hour} className="w-12 text-center">
                      {hour}
                    </div>
                  ))}
                </div>

                {/* Cellules de données */}
                {data.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex">
                    {row.map((value, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className="w-12 h-12 flex items-center justify-center border border-gray-200"
                        style={{
                          backgroundColor: getColor(value),
                          color: value > maxValue / 2 ? 'white' : 'black',
                        }}
                      >
                        {value}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Légende */}
          <div className="mt-6 flex items-center gap-4">
            <span className="font-medium">Légende:</span>
            <div className="flex gap-1">
              {[0, 0.25, 0.5, 0.75, 1].map((fraction) => (
                <div
                  key={fraction}
                  className="w-8 h-8 border border-gray-200 flex items-center justify-center text-xs"
                  style={{
                    backgroundColor: getColor(fraction * maxValue)
                  }}
                >
                  {Math.round(fraction * 100)}%
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Heatmap;