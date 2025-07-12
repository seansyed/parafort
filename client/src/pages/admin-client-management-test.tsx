import { useQuery } from "@tanstack/react-query";

export default function AdminClientManagementTest() {
  // Fetch clients from the API
  const { data: clients = [], isLoading: isLoadingClients, error } = useQuery({
    queryKey: ["/api/admin/clients"],
    retry: false,
  });

  if (isLoadingClients) {
    return <div className="p-6">Loading clients...</div>;
  }

  if (error) {
    return <div className="p-6">Error loading clients: {error.message}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Client Management Test</h1>
          <p className="text-gray-600">Manage and monitor all client accounts</p>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Clients ({clients.length})
          </h3>
          <div className="mt-5">
            {clients.length === 0 ? (
              <p className="text-gray-500">No clients found.</p>
            ) : (
              <div className="space-y-4">
                {clients.map((client: any) => (
                  <div key={client.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-medium">{client.firstName} {client.lastName}</h4>
                        <p className="text-gray-600">{client.email}</p>
                        <p className="text-sm text-gray-500">Client ID: {client.clientId}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">${client.totalRevenue}</p>
                        <p className="text-sm text-gray-500">{client.totalBusinesses} businesses</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}