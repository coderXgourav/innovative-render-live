import React from "react";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.min.js";
import Nav from "../navbar/navbar";
import Sidebar from "../sidebar/sidebar";
import { Link } from "react-router-dom";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { Modal, Button } from "react-bootstrap";
import {
    createOurMission,
    fetchOurMission,
    updateOurMission
} from "../../api-calls/apicalls";
import { useLogin } from "../../context/loginContext";
import { useNavigate } from "react-router-dom";
import CryptoJS from 'crypto-js';




function OurMissionManagement() {
    const [windowWidth, setWindowWidth] = useState();
    const [oms, setOms] = useState([]);
    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");
    const [name, setName] = useState("");
    const [update, setUpdate] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [omId, setOmId] = useState("");


    const navigate = useNavigate();



    const updateWindowWidth = () => {
        setWindowWidth(window.innerWidth);
    };

    const handleClose = () => {
        setShowModal(false);
        window.location.reload()
    };

    const handleCreate = async () => {
        const omData = {
            name: name,
            title: title,
            description: description,
        };
        const createdData = await createOurMission(omData);

        if (
            createdData?.success == "no" &&
            createdData?.message === "jwt expired"
        ) {
            return navigate("/");
        } else if (createdData?.success == "no") {
            alert("system error try again leter");
        } else if (createdData?.success == "yes") {
            alert("our mission created successfully")
            window.location.reload();
        }
    };

    const handleUpdate = async () => {
        const omData = {
            om_id: omId,
            name: name,
            title: title,
            description: description,
        };

        const updatedData = await updateOurMission(omData);

        if (
            updatedData?.success == "no" &&
            updatedData?.message === "jwt expired"
        ) {
            return navigate("/");
        } else if (updatedData?.success == "no") {
            alert("system error try again leter");
        } else if (updatedData?.success == "yes") {
            alert("our mission updated successfully")
            window.location.reload();
        }
    };



    useEffect(() => {
        // console.log("faq")
        setWindowWidth(window.innerWidth);
        window.addEventListener("resize", updateWindowWidth);

        const fetcher = async () => {
            let tempOurMissionsData = await fetchOurMission();

            if (tempOurMissionsData?.message === "jwt expired") {
                return navigate("/");
            } else {
                // console.log("bbb22",tempFaqsData)
                // tempFaqsData = CryptoJS.AES.decrypt(tempFaqsData, 'secret key 123');
                // console.log("bbb", JSON.parse(tempFaqsData.toString(CryptoJS.enc.Utf8)))
                // setFaqs([...JSON.parse(tempFaqsData.toString(CryptoJS.enc.Utf8))]);
                setOms([...tempOurMissionsData])
            }
        };

        fetcher();

        return () => {
            window.removeEventListener("resize", updateWindowWidth);
        };
    }, []);


    return (
        <>
            <Nav />
            <hr style={{ color: "black", margin: "0" }} />

            <div className="row">
                {windowWidth > 768 && <Sidebar activeOption="our-mission-management" />}
                <div className="col-md-10 p-4" style={{ height: '90vh', overflowY: 'auto' }}>
                    {/* <div className="d-flex justify-content-end mb-5">
                        <button
                            className="btn "
                            style={{
                                width: "fit-content",
                                background: "#90EE90",
                                whiteSpace: "nowrap",
                            }}
                            onClick={() => {
                                setUpdate(false);
                                setShowModal(true);
                            }}
                        >
                            <AddIcon />
                            <span className="ms-2">create</span>
                        </button>
                    </div> */}

                    <div className="d-flex row">
                        <div className="col fw-bold">{`Our Missions(${oms.length})`}</div>
                        <div className="col d-flex">
                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search"
                                />
                                <button
                                    className="btn btn-outline-primary"
                                    type="search"
                                    id="button-addon2"
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>

                    <table className="table mt-1 p-4 w-70 text-center">
                        <thead>
                            <tr className="table-primary table-striped">
                                <th scope="col">SN.</th>
                                <th scope="col">Name</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        {oms.length !== 0 &&
                            oms.map((om, ind) => (
                                <tbody>
                                    <tr>
                                        <th scope="col">{ind + 1}</th>
                                        <th scope="col"> {om?.name}</th>

                                        <th scope="col ">
                                            <CreateIcon
                                                className="text-primary border border-primary rounded me-2"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => {
                                                    setUpdate(true);
                                                    setName(om?.name);
                                                    setDescription(om?.description);
                                                    setTitle(om?.title)
                                                    setShowModal(true);
                                                    setOmId(om?._id);
                                                }}
                                            />
                                            {/* <DeleteIcon
                                                className="text-danger border border-danger cursor-pointer rounded"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => {
                                                    handleDelete(om?._id);
                                                }}
                                            /> */}
                                        </th>
                                    </tr>
                                </tbody>
                            ))}
                    </table>
                </div>
            </div>

            <Modal show={showModal} onHide={handleClose} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>{update ? "Update Faqs" : "Add Faqs"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row gy-2">
                        <div className="mb-2">
                            <label className="pb-1">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                }}
                            />
                        </div>

                        <div className="mb-2">
                            <label className="pb-1">Title</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Title"
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value);
                                }}
                            />
                        </div>

                        <div className="mb-2">
                            <label className="pb-1">Description</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Description"
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                }}
                            />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        className="btn"
                        style={{ background: "red", border: "none" }}
                        onClick={handleClose}
                    >
                        Close
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            {
                                update ? handleUpdate() : handleCreate();
                            }
                        }}
                    >
                        {update ? "Update" : "Create"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );

}

export default OurMissionManagement;