import Layout from "../components/Layout"; 

function Demo(){
  return (
    <div className="flex">
      <Layout />

      <main className="flex-1 p-6 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Welcome to the Clinic Management System</h1>
        <p className="text-gray-700 mb-4">
          This is a demo page. Use the sidebar to navigate through different sections of the system.
        </p>
      </main>
    </div>
  );
}

export default Demo