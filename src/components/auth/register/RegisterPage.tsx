import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IRegister } from "../../model";
import http from "../../../http";
import { Button, Form } from "react-bootstrap";

const RegisterPage = ()=>{ 
 const navigate = useNavigate();
    const [validated, setValidated] = useState(false);
    const [user, setUser] = useState<IRegister>({
        email: "",
        password: "",
        name: "",
        number: "",
        photo: null,
        surname: "",
        firstname: "",
    });
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === false) {
            setValidated(true);
            return;
        }
        console.log(user);
        http
            .post<IRegister>("/api/auth/register", user, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                setUser({
                    email: "",
                    password: "",
                    name: "",
                    number: "",
                    photo: null,
                    surname: "",
                    firstname: "",
                });
                navigate("/Login");
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

    return (
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
                        <Form.Group className="mb-3" controlId="formCategoryName" >
                            <Form.Label style={{
                                color: 'white',
                                fontSize: "30px"
                            }}>Nick</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter nick"
                                name="name"
                                value={user.name}
                                required
                                onChange={handleChange}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter a nick.
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
                        <Form.Group className="mb-3" controlId="formCategoryName" >
                            <Form.Label style={{
                                color: 'white',
                                fontSize: "30px"
                            }}>Number</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter number"
                                name="number"
                                value={user.number}
                                required
                                onChange={handleChange}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter a number.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formCategoryName" >
                            <Form.Label style={{
                                color: 'white',
                                fontSize: "30px"
                            }}>Surname</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter surname"
                                name="surname"
                                value={user.surname}
                                required
                                onChange={handleChange}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter a surname.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formCategoryName" >
                            <Form.Label style={{
                                color: 'white',
                                fontSize: "30px"
                            }}>First name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter firstname"
                                name="firstname"
                                value={user.firstname}
                                required
                                onChange={handleChange}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter a firstname.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formItemImage">
                            <Form.Label style={{
                                color: 'white',
                                fontSize: "30px"
                            }}>Photo</Form.Label> 
                            <Form.Control
                                type="file"
                                accept=".jpg,.png,.jpeg"
                                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                    const file = event.target.files?.[0];
                                    if (file) {
                                        setUser({
                                            ...user,
                                            photo: file
                                        });
                                    }
                                }}
                                required  
                            />
                        </Form.Group> 
                        <Button className="ButtonShop" style={{ margin: "0" }} type="submit">Login</Button>
                    </Form>
                </div>
            </div>
        </>
);
};
export default RegisterPage;