import { logout } from "@/app/login/actions";

const LogouButton = () => {
  return (
    <button
      onClick={() => logout()}
      className="bg-red-500 hover:bg-red-600 hover:cursor-pointer text-white text-sm rounded-xs px-1.5 py-1"
    >
      Log out
    </button>
  );
};

export default LogouButton;
