import { useNavigate } from "react-router-dom";
import { ILogin } from "../../model";
import { Button, Form } from "react-bootstrap";
import { useState } from "react";
import http from "../../../http";

const LoginPage = ()=>{
    const navigate = useNavigate();
    const [validated, setValidated] = useState(false);
    const [user, setUser] = useState<ILogin>({  
        email: "",
        password: "" 
    });
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === false) {
            setValidated(true);
            return;
        }
        http
            .post<ILogin>("/api/auth/login", user)
            .then((response) => {
                setUser({
                    email: "",
                    password: "" 
                });
                navigate("/Admin/DefaultCategory");
            })
            .catch((error) => console.log(error));
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