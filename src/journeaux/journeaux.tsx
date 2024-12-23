const Journeaux = () => {
    return (
      <div className="space-y-6">
        <h1 className="text-4xl font-bold text-gray-800">Journaux d'Activité</h1>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <h2 className="text-xl font-semibold text-gray-700">
              Dernières Activités
            </h2>
          </div>
          <div className="divide-y">
            {[
              {
                time: "10:30",
                event: "Maintenance programmée - Véhicule #A123",
                type: "maintenance"
              },
              {
                time: "09:15",
                event: "Nouveau trajet enregistré - Véhicule #B456",
                type: "journey"
              },
              {
                time: "08:00",
                event: "Alerte carburant bas - Véhicule #C789",
                type: "alert"
              }
            ].map((journal, index) => (
              <div key={index} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{journal.time}</span>
                  <span className={`text-sm px-2 py-1 rounded ${
                    journal.type === 'maintenance' ? 'bg-blue-100 text-blue-800' :
                    journal.type === 'journey' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {journal.type}
                  </span>
                </div>
                <p className="mt-1 text-gray-700">{journal.event}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default Journeaux;