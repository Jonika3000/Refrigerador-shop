import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { IItem } from "../../model";
import http from "../../http";
import { Button, Form } from "react-bootstrap";
 

const EditItem = () => {
    const [AllItems, SetAllItems] = useState<IItem[]>([]);
    const [EditItem, setEditItem] = useState<IItem>({
        id: 0,
        name: "",
        description: "",
        imagePrev: null,
        price: 0,
        categoryId: 0,
    });
    const [image, setImage] = useState<File | null>(null);
    const [validated, setValidated] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

    useEffect(() => {
        http
            .get<IItem[]>("api/clearItems")
            .then((response) => { 
                SetAllItems(response.data);
            })
            .catch((error) => {
                console.log(error.response.data);

            });
    }, []);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setValidated(true);

        if (event.currentTarget.checkValidity() === true) {
            const formData = new FormData();
            const form = event.currentTarget; 
            if (image != null) {
                console.log("added");
                formData.append("imagePrev", image, image.name);
            }
            formData.append("id", EditItem.id.toString());
            formData.append("name", EditItem.name);
            formData.append("description", EditItem.description);
            formData.append("price", EditItem.price.toString());
            formData.append("categoryId", EditItem.categoryId.toString());
            console.log(Array.from(formData));
            http
                .put("api/itemUpdate/" + EditItem.id, formData,{
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })
                .then((response) => {
                    form.reset();
                    setEditItem({
                        id: 0,
                        name: "",
                        description: "",
                        imagePrev: null,
                        price: 0,
                        categoryId: 0
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    function handleChange(
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ): void {
        setEditItem({ ...EditItem, [event.target.name]: event.target.value });
    }

    function handleImageChange(event: ChangeEvent<HTMLInputElement>): void {
        const files = event.target.files;
        if (files && files.length > 0) {
            setImage(files[0]);
        }
    }

    function ComboBoxChange(event: ChangeEvent<HTMLSelectElement>): void {
        const selectedId = Number(event.target.value);
        setSelectedItemId(selectedId);
        const selectedItem = AllItems.find((item) => item.id === selectedId);
        if (selectedItem) {
            setEditItem(selectedItem);
        }
    }

    const dataItems = AllItems.map((item) => {
        return (
            <option key={item.id} value={item.id}>
                {item.name}
            </option>
        );
    });

    return (
        <div className="MainHome">
            <div className="CenterContent"> 
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Item</Form.Label>
                    <Form.Select
                        aria-label="Item"
                        onChange={ComboBoxChange}
                        required
                        name="FormSelectItem"
                        value={selectedItemId || ""}
                    >
                        <option value="">Choose...</option>
                        {dataItems}
                    </Form.Select>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter item name"
                        name="name"
                        value={EditItem.name}
                        required
                        onChange={handleChange}
                        disabled={!selectedItemId}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        placeholder="Enter item description"
                        name="description"
                        value={EditItem.description}
                        required
                        onChange={handleChange}
                        disabled={!selectedItemId}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Enter item price"
                        name="price"
                        value={EditItem.price}
                        required
                        onChange={handleChange}
                        disabled={!selectedItemId}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Image</Form.Label>
                    <Form.Control
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={handleImageChange}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Save
                </Button>
            </Form>
        </div> 
        </div> 
    );
};

export default EditItem;
