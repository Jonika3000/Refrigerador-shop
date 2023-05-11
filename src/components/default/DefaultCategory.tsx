import React, { useState, useEffect } from "react";
import "./DefaultCategory.css"
import { ICategoryItem, ICategoryResponse, ICategorySearch } from "../../model";
import axios from "axios";
import classNames from "classnames";
import { Link, useSearchParams } from "react-router-dom";

const DefaultCategory = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    console.log("page = ", searchParams.get("page"));

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
        axios
            .get<ICategoryResponse>("http://127.0.0.1:8000/api/category", {
                params: search,
            })
            .then((resp) => {
                setCategory(resp.data);
            })
            .catch((bad) => {
                console.log("Bad request", bad);
            });
    }, [search]);

    const { data, last_page, current_page, total } = category;

    const dataView = data.map((category) => (
        <li key={category.id}><a>{category.name}</a></li>
    ));
    const pageRange = 2; // number of pages to show before and after the current page
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
                        style={{marginTop:"3rem"}}>
                            <ul>{pagination}</ul>
                        </div>
                    </div> 
                </div>
              
            </div>
        </>
    );
}

export default DefaultCategory;