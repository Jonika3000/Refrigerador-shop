import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { ICategoryItem, IItem } from "../model";
import http from "../../http";
import { useParams } from "react-router-dom";
import { APP_ENV } from "../../env";
import "./ShowItems.css";

interface RouteParams {
    [key: string]: string | undefined;
    slug: string;
}

interface ShowItemsProps { }

const ShowItems: React.FC<ShowItemsProps> = () => {
    const [data, setData] = useState<IItem[]>([]);
    const [dataCategory, setDataCategory] = useState<ICategoryItem[]>([]);
    const { slug } = useParams<RouteParams>();
    useEffect(() => {
        http.get(`api/category/${slug}`).then((resp) => {
            setDataCategory(resp.data.items_data.category);
            setData(resp.data.items_data.item);
            console.log(slug);
            console.log(Array.from(dataCategory));
        });
    }, [slug]);
    const categoryView = dataCategory.length > 0 && dataCategory.map((Category) => ( 
         <li key={Category.id}>{Category.name}</li>
    ));
    const dataView = data.map((data) => (
        <div className="Product">
            <div className="col-md-3" key={data.id}>
                <div className="product-wrapper mb-45 text-center">
                    <div className="product-img">
                        <a href="#" data-abc="true">
                            <img src={`${APP_ENV.BASE_URL}storage/uploads/${data.imagePrev}`} alt="" />
                        </a>
                        <span className="text-center">
                            <i className="fa fa-rupee">
                            </i>
                            {data.price}$</span> 
                    </div>
                </div>
            </div>
        </div>

    ));
    return (
        <>
            <div className="wrapPage">
                <Row>
                    <Col xs="2">
                        <div className="category">
                            <h1>Categories:</h1>
                            <ul>
                            {categoryView}
                            </ul>
                        </div>
                    </Col>
                    <Col xs="10">
                        <Row>
                            <h1>Items:</h1>
                            {dataView}
                        </Row>
                    </Col>
                </Row>

            </div>

        </>
    )
};

export default ShowItems;
