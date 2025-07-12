import LeftNavigation from "@/components/left-navigation";
import ClientSCorpElection from "@/components/ClientSCorpElection";

export default function SCorpElectionPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <LeftNavigation />
      <div className="pt-36">
        <ClientSCorpElection />
      </div>
    </div>
  );
}
