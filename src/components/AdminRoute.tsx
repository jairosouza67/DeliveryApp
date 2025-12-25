import { Navigate, useLocation } from "react-router-dom";
import { Skeleton } from "./ui/skeleton";
import { useAuthRole } from "@/hooks/useAuthRole";

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, loading, isAuthenticated } = useAuthRole();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md p-6">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
