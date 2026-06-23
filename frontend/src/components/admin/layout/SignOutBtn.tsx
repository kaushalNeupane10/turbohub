import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Loading from "@/components/common/Loading";
export default function SignOutBtn({ showLabel = true }) {
  const { logout, isLoggingOut } = useAuth();
  return (
    <>
      <div className="px-4 py-4 border-t">
        {isLoggingOut ? (
          <Loading />
        ) : (
          <button
            className="flex w-full items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-sm text-(--color-secondary-500) hover:bg-(--color-secondary-500)/10 transition-all duration-200 group"
            onClick={!isLoggingOut ? logout : null}
          >
            <LogOut
              size={20}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            {showLabel && <span>Sign Out</span>}
          </button>
        )}
      </div>
    </>
  );
}
