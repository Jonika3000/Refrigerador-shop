import React, { ChangeEvent, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import { ICategoryItem, IItem } from "../../model";
import { useNavigate } from "react-router-dom";
import { APP_ENV } from "../../env";
import http from "../../http";

const AddItemForm = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [validated, setValidated] = useState(false);
    const [item, setItem] = useState<IItem>({
        id: 0,
        name: "",
        description: "",
        imagePrev:"",
        price:0,
        categoryId: 0
    });
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            setValidated(true);
            return;
        }
        const formData = new FormData();
        formData.append('name', item.name);
        formData.append('description', item.description);
        formData.append('price', item.price.toString());
        formData.append('categoryId', item.categoryId.toString());
        
        if (imageFile != null) { 
            formData.append('imagePrev', imageFile);
            console.log(item);
        } 
        http.post<IItem>('api/AddItem', formData)
            .then((response) => {
                setItem({
                    id: 0,
                    name: "",
                    description: "",
                    imagePrev: "",
                    price: 0,
                    categoryId: 0
                });
            })
            .catch((error) => console.log(error));
    };


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setItem((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    function ComboBoxChange(event: React.ChangeEvent<HTMLSelectElement>) {
        setItem({
            ...item,
            categoryId: parseInt(event.target.value)  
        }); 
        console.log(item.categoryId);
    } 
    const [list, setList] = useState<ICategoryItem[]>([]);
    useEffect(() => {
        http.get<ICategoryItem[]>('api/clearCategory')
            .then(resp => {
                setList(resp.data);
                console.log(resp.data);
            })
            .catch(bad => {
                console.log("Bad request", bad);
            }); 
    }, []);

    const dataCategory = list.map((category) => (
        <option key={category.id} value={category.id}>{category.name}</option>
    ));
 
    return (
        <div className="MainHome">
            <div className="CenterContent">
                <Form noValidate validated={validated} onSubmit={handleSubmit} style={{ margin: "0 auto" }}>
                    <Form.Group className="mb-3" controlId="formItemName" >
                        <Form.Label style={{
                            color: 'white',
                            fontSize: "30px"
                        }}>Item name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter item name"
                            name="name"
                            value={item.name}
                            required
                            onChange={handleChange}
                        />
                        <Form.Control.Feedback type="invalid">
                            Please enter a item name.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formItemImage">
                        <Form.Label style={{
                            color: 'white',
                            fontSize: "30px"
                        }}>Item image</Form.Label>
                        <Form.Control
                            type="file"
                            accept=".jpg,.png,.jpeg"
                            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                const file = event.target.files?.[0];
                                if (file) {
                                    const imageUrl = URL.createObjectURL(file); 
                                    setImageFile(file);
                                    setItem({
                                        ...item,
                                        imagePrev: imageUrl  
                                    });
                                }
                            }}
                        />

                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formItemDescription">
                        <Form.Label style={{
                            color: 'white',
                            fontSize: "30px"
                        }}>Item description</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter item description"
                            name="description"
                            value={item.description}
                            required
                            onChange={handleChange}
                        />
                        <Form.Control.Feedback
                            type="invalid">
                            Please enter a item description.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formItemCategory">
                        <Form.Label style={{
                            color: 'white',
                            fontSize: "30px"
                        }}>Item category</Form.Label>
                        <Form.Select aria-label="Item category" onChange={ComboBoxChange}>
                            {dataCategory}
                        </Form.Select>
                        <Form.Control.Feedback
                            type="invalid">
                            Please enter a item description.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formItemPrice">
                        <Form.Label style={{
                            color: 'white',
                            fontSize: "30px"
                        }}>Item price</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter item parice"
                            name="price"
                            value={item.price}
                            required
                            onChange={handleChange}
                        />
                        <Form.Control.Feedback
                            type="invalid">
                            Please enter a item price.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Button className="ButtonShop" style={{ margin: "0" }} type="submit">Add</Button>
                </Form>
            </div>
        </div>
    );
};

export default AddItemForm;
