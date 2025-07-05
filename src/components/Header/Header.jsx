// Header.js
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Logo/G1.png";

function Header({ section, setSection }) {
  const navigate = useNavigate();

  return (
    <header className="w-full flex justify-between items-center px-6 py-3 fixed top-0 left-0 bg-[#a20000] shadow-md z-50">
      {/* Logo */}
      <div className="flex items-center cursor-pointer" onClick={() => navigate("/dashboard")}>
        <img src={logo} alt="Company Logo" className="h-10 w-auto object-contain" />
      </div>

      {/* Middle Heading */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <h2 className="text-white font-semibold text-xl">{section}-Section</h2>
      </div>

      {/* Section Buttons */}
      <div className="flex space-x-2">
        {["A", "C", "D"].map((sec) => (
          <button
            key={sec}
            onClick={() => setSection(sec)}
            className={`px-4 py-1 rounded-md text-sm font-semibold ${
              section === sec ? "bg-white text-[#a20000]" : "bg-[#a20000] text-black border border-white"
            }`}
          >
            Section {sec}
          </button>
        ))}
      </div>
    </header>
  );
}

export default Header;
