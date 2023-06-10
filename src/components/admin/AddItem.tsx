import React, { ChangeEvent, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap"; 
import { ICategoryItem, IItem } from "../model"; 
import http from "../../http";

const AddItemForm = () => {
    const [validated, setValidated] = useState(false);
    let [itemImages, setItemImages] = useState<File[]>([]);
    const [item, setItem] = useState<IItem>({
        id: 0,
        name: "",
        description: "",
        imagePrev: null,
        price:0,
        categoryId: 0
    });
    async function uploadImagesInOrder(itemImages: File[], addedItemId: number) {
        for (const image of itemImages) {
            const formData = new FormData();
            formData.append('url', image, image.name);
            formData.append('itemId', addedItemId.toString());
            try {
                await http.post('api/AddImage', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } catch (error: any) {
               console.log(error);
            }
        }
    }
    const handleRemoveImage = (index: number) => {
        const updatedImages = [...itemImages];
        updatedImages.splice(index, 1);
        setItemImages(updatedImages);
    };
    let SelectedImages = itemImages.map((img, index) => (
        <div
            key={index}
            style={{ display: "flex", alignItems: "center", margin: "10px" }} 
        >
            <img
                src={URL.createObjectURL(img)}
                style={{ maxHeight: "100px", maxWidth: "100px", objectFit: "cover" }}
                alt={`Image ${index + 1}`}
            />
            <Button
                variant="danger"
                size="sm"
                style={{ marginLeft: "10px" }}
                onClick={() => handleRemoveImage(index)}
            >
                Remove
            </Button>
        </div>
    ));
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;
        /* валідація */
        if (form.checkValidity() === false || !item.categoryId) {
            setValidated(true);
            return;
        } 
        const formData = new FormData();
        formData.append('name', item.name);
        formData.append('description', item.description);
        formData.append('price', item.price.toString());
        formData.append('categoryId', item.categoryId.toString()); 
        if (item.imagePrev != null) {
            formData.append('image', item.imagePrev, item.imagePrev.name);
        } 
       console.log( Array.from(formData)); 
        http.post<IItem>('api/AddItem', formData, { 
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }) 
            .then(async (response) => { 
                const addedItemId = response.data.id;
                if (itemImages.length > 0) {
                    await uploadImagesInOrder(itemImages, addedItemId);
                    setItemImages([]);
                }
                setItem({
                    id: 0,
                    name: "",
                    description: "",
                    imagePrev: null,
                    price: 0,
                    categoryId: 0
                });
                form.reset();  
                setValidated(false);
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
        console.log('categoryID'+item.categoryId);
    } 
    /* отримання данних категорій з серверу */
    const [list, setList] = useState<ICategoryItem[]>([]);
    useEffect(() => {
        http.get<ICategoryItem[]>('api/clearCategory', {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then(resp => {
                setList(resp.data);
                console.log(resp.data);
            })
            .catch(bad => {
                console.log("Bad request", bad);
            }); 
    }, []);
   /*  перебор масиву данних категорій*/
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
                      {/*   добавлення файлів, вибір із масиву 1 елемент, встановлення змінни файла */}
                        <Form.Control
                            type="file"
                            accept=".jpg,.png,.jpeg"
                            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                const file = event.target.files?.[0];
                                if (file) {  
                                    setItem({
                                        ...item,
                                        imagePrev: file
                                    });
                                }
                            }}
                        /> 
                    </Form.Group> 
                    <Form.Group className="mb-3" controlId="formItemImages">
                        <Form.Label style={{
                            color: 'white',
                            fontSize: "30px"
                        }}>Images</Form.Label>
                        <Form.Control
                            type="file"
                            multiple
                            required
                            accept=".jpg,.png,.jpeg"
                            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                const files = event.target.files;
                                if (files) {
                                    const newImages = [...itemImages, ...Array.from(files)];
                                    setItemImages(newImages);
                                }
                            }}
                        />
                        <Form.Control.Feedback type="invalid">
                            Please select at least one image.
                        </Form.Control.Feedback>
                    </Form.Group>
                    {SelectedImages}
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
                        <Form.Label style={{ color: 'white', fontSize: "30px" }}>Item category</Form.Label>
                       {/*  комбо бокс категорій */}
                        <Form.Select aria-label="Item category" onChange={ComboBoxChange} required name="FormSelectCategory">
                            <option value="">Choose...</option>
                            {dataCategory}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">Please select a category.</Form.Control.Feedback>
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
