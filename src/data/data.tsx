import { NavLink } from 'react-router-dom';


const Data = () => {
    return (
      <div className="space-y-6">
        <h1 className="text-4xl font-bold text-gray-800">
          Gestion des données
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <NavLink to="users">
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-700">Accès a la base des Users</h2>
                    <p className="mt-2 text-gray-600">
                    Accédez à toutes les informations de votre flotte en un seul endroit.
                    </p>
                </div>
            </NavLink>
            <NavLink to="models">
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-700">Accès a la base des Models</h2>
                    <p className="mt-2 text-gray-600">
                    Accédez à toutes les informations de votre flotte en un seul endroit.
                    </p>
                </div>
            </NavLink>
            <NavLink to="brands">
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-700">Accès a la base des Brands</h2>
                    <p className="mt-2 text-gray-600">
                    Accédez à toutes les informations de votre flotte en un seul endroit.
                    </p>
                </div>
            </NavLink>
        </div>
      </div>
    );
  };

  export default Data;