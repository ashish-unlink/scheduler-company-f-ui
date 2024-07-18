import LOADER from "../../assets/appointimize-loader.gif";
import "./loderStyle.css";

export const Loader = () => {
  return (
    <div className="loader-container">
      <img className="loader-gif" src={LOADER} alt="Loader" />
    </div>
  );
};

export default Loader;
