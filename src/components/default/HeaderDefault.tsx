import { Link } from "react-router-dom";
import "./HeaderDefault.css"
import "bootstrap/dist/css/bootstrap.css";
import { useDispatch, useSelector } from "react-redux";
import { AuthUserActionType, IAuthUser } from "../model";
import http from "../../http";
import { APP_ENV } from "../../env";
const HeaderDefault = () =>{
    const dispatch = useDispatch();
    const { isAuth, user } = useSelector((store: any) => store.auth as IAuthUser);

    const logout = () => {
        delete http.defaults.headers.common["Authorization"];
        localStorage.removeItem("token");
        dispatch({ type: AuthUserActionType.LOGOUT_USER });
    }

    console.log("is Auth", isAuth);
    return(
        <div >
            <nav className="navbar navbar-expand-lg header">
                <div className="collapse navbar-collapse mr-auto" id="navbarText">
                    <a className="Name" href="#">Refrigerador shop</a>  
                </div>
                <ul className="navbar-text">
                    <li><Link to="/"><a>Home</a></Link></li>
                    <li><a>About</a></li>
                    <li> <Link to="/DefaultCategory"><a>Shop</a></Link></li>
                    {isAuth ? (
                        <>
                            <img src={`${APP_ENV.BASE_URL}storage/uploads/${user?.image}`} alt="Фотка" width={50} /> 
                            <li className="nav-item">
                                <Link
                                    className="nav-link"
                                    aria-current="page"
                                    to="/profile"
                                >
                                    {user?.email}
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link 
                                    aria-current="page"
                                    to="/logout"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        logout();
                                    }}
                                >
                                    logout
                                </Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="nav-item">
                                <Link
                                    className="nav-link"
                                    aria-current="page"
                                    to="/register"
                                >
                                    Реєстрація
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    className="nav-link"
                                    aria-current="page"
                                    to="/login"
                                >
                                    Вхід
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </div>
      

    );
}
export default HeaderDefault;