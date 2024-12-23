const Analytics = () => {
    return (
      <div className="space-y-6">
        <h1 className="text-4xl font-bold text-gray-800">Analyses et Statistiques</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Performance de la Flotte
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="text-lg font-medium text-gray-700">Taux d'Utilisation</h3>
              <p className="text-3xl font-bold text-purple-600">75%</p>
            </div>
            <div className="border-l-4 border-teal-500 pl-4">
              <h3 className="text-lg font-medium text-gray-700">Économie de Carburant</h3>
              <p className="text-3xl font-bold text-teal-600">12%</p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  export default Analytics;