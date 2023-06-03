import React, { useState, useEffect } from "react";
import "./DefaultCategory.css"
import { ICategoryItem, ICategoryResponse, ICategorySearch } from "../model";
import axios from "axios";
import classNames from "classnames";
import { Link, useSearchParams } from "react-router-dom";
import { APP_ENV } from "../../env";
import http from "../../http";
import Loading from "./Loading";

const DefaultCategory = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    console.log("page = ", searchParams.get("page"));
    const [loading, setLoading]: [boolean, (loading: boolean) => void] = React.useState<boolean>(true);
    const [error, setError]: [string, (error: string) => void] = React.useState("");
    const [search, setSearch] = useState<ICategorySearch>({
        page: searchParams.get("page") || 1,
    });

    const [category, setCategory] = useState<ICategoryResponse>({
        data: [],
        total: 0,
        current_page: 0,
        last_page: 0,
    });

    useEffect(() => {
        fetchProductImages(search);
    }, [search]);
    const fetchProductImages = async (search: ICategorySearch) => {
        try {
            const response = await http.get<ICategoryResponse>(`api/category`, {
                params: search,
            });
            setCategory(response.data);
            setLoading(false);
            console.log(response);
        } catch (error: any) {
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


    const { data, last_page, current_page, total } = category;

    const dataView = data.map((category) => (
        <li key={category.id}><a>{category.name}</a></li>
    ));
    const pageRange = 2;
    const startPage = Math.max(1, current_page - pageRange);
    const endPage = Math.min(last_page, current_page + pageRange);

    const buttons = [];
    if (startPage > 1) {
        buttons.push(1);
    }
    if (startPage > 2) {
        buttons.push("...");
    }
    for (let i = startPage; i <= endPage; i++) {
        buttons.push(i);
    }
    if (endPage < last_page - 1) {
        buttons.push("...");
    }
    if (endPage < last_page) {
        buttons.push(last_page);
    }

    const pagination = buttons.map((page, index) => {
        const isEllipsis = page === "...";
        const isActive = !isEllipsis && page === current_page;
        const isDisabled = isEllipsis || isActive;
        return (
            <li
                key={index}
                className={classNames("page-item", { active: isActive, disabled: isDisabled })}
            >
                <Link
                    className="page-link"
                    to={`?page=${page}`}
                    onClick={() => setSearch({ ...search, page })}
                >
                    {page}
                </Link>
            </li>
        );
    });
    if (loading == false && error == "") {
        return (
            <>
                <div className="MainHome">
                    <div className="CenterContent">
                        <div>
                            <ul className="CategoryList">
                                <li style={{ fontSize: "30px", cursor: "default" }}>Choose Category:</li>
                                {dataView}
                            </ul>
                            <div className="pagination justify-content-center"
                                style={{ marginTop: "3rem" }}>
                                <ul>{pagination}</ul>
                            </div>
                        </div>
                    </div>

                </div>
            </>
        );
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
}

export default DefaultCategory;