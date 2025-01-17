import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";

function ShoppingLayout() {
  return (
    <div className="flex flex-col overflow-hidden bg-gradient-to-r from-orange-100 to-orange-200">
      {/* common header */}
      <main className="flex flex-col w-full">
      <ShoppingHeader />
        <Outlet />
      </main>
    </div>
  );
}

export default ShoppingLayout;
