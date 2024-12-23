const Home = () => {
    return (
      <div className="space-y-6">
        <h1 className="text-4xl font-bold text-gray-800">
          Bienvenue sur CarSpot
        </h1>
        <p className="text-xl text-gray-600">
          Votre solution complète pour la gestion de flotte automobile. 
          Découvrez nos fonctionnalités avancées pour optimiser votre parc de véhicules.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700">Gestion Simplifiée</h2>
            <p className="mt-2 text-gray-600">
              Accédez à toutes les informations de votre flotte en un seul endroit.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700">Suivi en Temps Réel</h2>
            <p className="mt-2 text-gray-600">
              Visualisez l'état de vos véhicules et leur disponibilité instantanément.
            </p>
          </div>
        </div>
      </div>
    );
  };

  export default Home;