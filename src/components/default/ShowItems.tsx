import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { ICategoryItem, IItem } from "../model";
import http from "../../http";
import { useParams } from "react-router-dom";
import { APP_ENV } from "../../env";
import "./ShowItems.css";
import React from "react";
import Loading from "./Loading";

interface RouteParams {
    [key: string]: string | undefined;
    slug: string;
}

interface ShowItemsProps { }

const ShowItems: React.FC<ShowItemsProps> = () => {
    const [data, setData] = useState<IItem[]>([]);
    const [dataCategory, setDataCategory] = useState<ICategoryItem[]>([]);
    const { slug } = useParams<RouteParams>();
    const [loading, setLoading]: [boolean, (loading: boolean) => void] = React.useState<boolean>(true);
    const [error, setError]: [string, (error: string) => void] = React.useState("");

    useEffect(() => {
        const fetchData = async (slug: string | undefined) => {
            try {
                const response = await http.get(`api/category/${slug}`);
                await setDataCategory(response.data.items_data.category);
                await setData(response.data.items_data.item);
                await setLoading(false);
                console.log(slug);
                console.log(Array.from(dataCategory));
            }
            catch (error: any) {
                const errorMessage =
                    error.code === "ECONNABORTED"
                        ? "Минув тайм-аут"
                        : error.response && error.response.status === 404
                            ? "Ресурс не знайдено"
                            : "Сталася неочікувана помилка";
                setError(errorMessage);
                setLoading(false);
            }
        };
        fetchData(slug);
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
    if (loading == false && error == "") {
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
    }
    else if (loading == false && error != '') {
        return (
            <div className="MainHome">
                <div className="CenterContent">
                    <div className="Info">
                        <div className='center'>
                            <a>{error}
                                <p></p>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    else if (loading == true) {
        return (
            <div className="MainHome">
                <div className="CenterContent">
                    <div className='center'>
                        <Loading></Loading>
                    </div>
                </div>
            </div>
        );
    }
    else {
        return (
            <>
            </>
        );
    }
};

export default ShowItems;
