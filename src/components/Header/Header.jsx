import { useNavigate } from "react-router-dom";
import logo from "../../assets/Logo/G1.png";

function Header() {
  const navigate = useNavigate();

  //   const handleLogout = () => {
  //     console.log("Logging out...");
  //   };

  return (
    <header className="w-full flex justify-between items-center px-6 py-3 fixed top-0 left-0 bg-[#a20000] shadow-md z-50">
      {/* Logo */}
      <div
        className="flex items-center cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        <img
          src={logo}
          alt="Company Logo"
          className="h-10 w-auto object-contain"
        />
      </div>

      {/* Heading in the middle */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <h2 className="text-white font-semibold text-xl">A-Section</h2>
      </div>

      {/* Logout Button */}
      {/* <button
        onClick={handleLogout}
        className="bg-white text-[#a20000] w-28 h-9 rounded-md font-semibold text-sm transition-all duration-300 ease-in-out shadow-md hover:bg-gray-200"
      >
        Log Out
      </button> */}
    </header>
  );
}

export default Header;
