import { useNavigate } from "react-router-dom";
import { AuthUserActionType, ILogin, IUser } from "../../model";
import { Button, Form } from "react-bootstrap";
import { useState } from "react";
import http from "../../../http";
import { useDispatch } from "react-redux";
import jwtDecode from "jwt-decode";
export interface ILoginResult {
    access_token: string
}
const LoginPage = ()=>{
    const navigate = useNavigate();
    const [validated, setValidated] = useState(false);
    const [user, setUser] = useState<ILogin>({  
        email: "",
        password: "" 
    });
    const dispatch = useDispatch();
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === false) {
            setValidated(true);
            return;
        }
        const result = await http.post<ILoginResult>("api/auth/login", user);
        const { access_token } = result.data;
        const userJwt = jwtDecode(access_token) as IUser; 
        localStorage.token = access_token;
        http.defaults.headers.common['Authorization'] = `Bearer ${localStorage.token}`;
        dispatch({
            type: AuthUserActionType.LOGIN_USER, payload: {
                image: userJwt.image,
                email: userJwt.email,
                name: userJwt.name
            } 
        }); 
    };
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUser((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    return(
        <>
            <div className="MainHome">
                <div className="CenterContent">
                    <Form noValidate validated={validated} onSubmit={handleSubmit} style={{ margin: "0 auto" }}>
                        <Form.Group className="mb-3" controlId="formCategoryName" >
                            <Form.Label style={{
                                color: 'white',
                                fontSize: "30px"
                            }}>Email</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter email"
                                name="email"
                                value={user.email}
                                required
                                onChange={handleChange}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter a email.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formCategoryDescription">
                            <Form.Label style={{
                                color: 'white',
                                fontSize: "30px"
                            }}>Password</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter password"
                                name="password"
                                value={user.password}
                                required
                                onChange={handleChange}
                            />
                            <Form.Control.Feedback
                                type="invalid">
                                Please enter a password.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Button className="ButtonShop" style={{ margin: "0" }} type="submit">Login</Button>
                    </Form>
                </div>
            </div>
        </>
    );
};
export default LoginPage;