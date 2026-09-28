import { useEffect } from "react";
import { useNavigate } from "react-router";

export function TablesPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/tables/owners", { replace: true });
  }, [navigate]);

  return null;
}
