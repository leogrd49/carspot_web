const Home = () => {
    return (
      <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 md:p-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
          Bienvenue sur CarSpot
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600">
          Votre solution complète pour la gestion de flotte automobile.
          Découvrez nos fonctionnalités avancées pour optimiser votre parc de véhicules.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-8">
          <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">Gestion Simplifiée</h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Accédez à toutes les informations de votre flotte en un seul endroit.
            </p>
          </div>
          <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">Suivi en Temps Réel</h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Visualisez l'état de vos véhicules et leur disponibilité instantanément.
            </p>
          </div>
        </div>
      </div>
    );
  };

  export default Home;
