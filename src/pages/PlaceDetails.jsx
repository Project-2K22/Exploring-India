import { useLocation } from "react-router-dom";
import PlaceViewTop from "../components/PlaceViewTop";

const PlaceDetails = () =>{
    const location = useLocation();
    const props = location.state;
    
    return (
        <div className="placeDetails">
            <PlaceViewTop value={props}/>
        </div>
    );

}

export default PlaceDetails;