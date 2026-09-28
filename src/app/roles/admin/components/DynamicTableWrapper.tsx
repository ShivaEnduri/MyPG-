import { useParams } from "react-router";
import { DynamicTableDataPage } from "./DynamicTableDataPage";

export function DynamicTableWrapper() {
  const { tableId } = useParams<{ tableId: string }>();
  
  if (!tableId) {
    return (
      <div className="p-4 md:p-8">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Table ID not found</p>
        </div>
      </div>
    );
  }
  
  return <DynamicTableDataPage tableId={tableId} />;
}
