const Dashboard = () => {
    return (
      <div className="space-y-6">
        <h1 className="text-4xl font-bold text-gray-800">Tableau de Bord</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-xl font-semibold text-blue-800">Véhicules Actifs</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">24</p>
          </div>
          <div className="p-6 bg-green-50 rounded-lg border border-green-200">
            <h3 className="text-xl font-semibold text-green-800">En Service</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">18</p>
          </div>
          <div className="p-6 bg-orange-50 rounded-lg border border-orange-200">
            <h3 className="text-xl font-semibold text-orange-800">En Maintenance</h3>
            <p className="text-3xl font-bold text-orange-600 mt-2">6</p>
          </div>
        </div>
      </div>
    );
  };
  export default Dashboard;