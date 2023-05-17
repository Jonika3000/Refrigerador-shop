import { ChangeEvent, useEffect, useState } from "react";
import http from "../../http";
import { IItem } from "../../model";
import { Button, Form, Modal } from "react-bootstrap";

const DeleteItem = () => {
    const [validated, setValidated] = useState(false);
    const [AllItems, SetAllItems] = useState<IItem[]>([]);
    const [deleteItem, SetDeleteItem] = useState<IItem>({
        id: 0,
        name: "",
        description: "",
        imagePrev: null,
        price: 0,
        categoryId: 0
    });
    useEffect(() => {
        http.get<IItem[]>('api/clearItems')
            .then(resp => {
                SetAllItems(resp.data);
            })
            .catch(bad => {
                console.log("Bad request", bad);
            });
    }, []);
    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;
        if (form.checkValidity() === false || !deleteItem.id) {
            setValidated(true);
            return;
        }
        http.delete('api/DeleteItem/' + deleteItem.id)
            .then(response => {
                console.log(response.data);
                SetDeleteItem({
                    id: 0,
                    name: "",
                    description: "",
                    imagePrev: null,
                    price: 0,
                    categoryId: 0
                });
            })
            .catch(error => {
                console.log(error);
            });
        form.reset();
        handleShowModal();
    } 
    function ComboBoxChange(event: ChangeEvent<HTMLSelectElement>): void {
        SetDeleteItem({
            ...deleteItem,
            id: parseInt(event.target.value)
        });
        console.log('ID' + deleteItem.id);
    }
    const dataItems = AllItems.length > 0 && AllItems.map((item) => (
        <option key={item.id} value={item.id}>{item.name}</option>
    ));
    return (
        <>
            <div className="MainHome">
                <div className="CenterContent">
                    <Form noValidate validated={validated} onSubmit={handleSubmit} style={{ margin: "0 auto" }}>

                        <Form.Group className="mb-3" controlId="formItemCategory">
                            <Form.Label style={{ color: 'white', fontSize: "30px" }}>Select Item To Delete</Form.Label>
                            <Form.Select aria-label="Item category" onChange={ComboBoxChange} required name="FormSelectCategory">
                                <option value="">Choose...</option>
                                {dataItems}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">Please select a item.</Form.Control.Feedback>
                        </Form.Group>

                        <Button className="ButtonShop" style={{ margin: "0" }} type="submit">Delete</Button>
                    </Form>
                    <Modal show={showModal} onHide={handleCloseModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirm Deletion</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Are you sure you want to delete the selected item?
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Cancel
                            </Button>
                            <Button variant="danger" onClick={() => {
                                http.delete('api/DeleteItem/' + deleteItem.id)
                                    .then(response => {
                                        console.log(response.data);
                                    })
                                    .catch(error => {
                                        console.log(error);
                                    });
                                handleCloseModal();
                            }}>
                                Delete
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </>
    );
};
export default DeleteItem;