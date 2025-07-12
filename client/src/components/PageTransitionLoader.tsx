import { ParaFortLoader } from "./ParaFortLoader";

interface PageTransitionLoaderProps {
  isLoading: boolean;
  children: React.ReactNode;
}

export default function PageTransitionLoader({ isLoading, children }: PageTransitionLoaderProps) {
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gray-50 z-[9999] flex items-center justify-center">
        <div className="text-center">
          <ParaFortLoader size="xl" />
          <p className="mt-4 text-gray-600 text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}