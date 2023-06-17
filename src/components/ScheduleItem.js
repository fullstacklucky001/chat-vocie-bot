import Switch from "react-switch";
import { useState } from "react";
import { useRef } from "react";
import { useDispatch } from 'react-redux';
import Modal from 'react-modal'
import { AiOutlineEdit } from "react-icons/ai";
import { AiOutlineSave } from "react-icons/ai";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Http from "../service/http";
import { updateSchedule } from "../actions/scheduleAction";
import ScaleLoader from "./ScaleLoader"

import React, { useEffect } from 'react';

function ScheduleItem(props) {
    const dispatch = useDispatch()
    let scheduleRef = useRef(null)

    let {
        _id,
        title,
        active,
        duration,
        message,
        startAt,
        handleEdit
    } = props

    const [currentSchedule, setCurrentSchedule] = useState('')
    const [checked, setChecked] = useState(active);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false)
    const [startTime, setStartTime] = useState(new Date(startAt));
    const [scheduleTitle, setScheduleTitle] = useState(title)
    const [curDuration, setCurDuration] = useState(duration)

    const customStyles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0, 0.5)',
        },
        content: {
            height: '520px',
            background: 'rgba(39, 39, 42, 0.9)',
            border: '1px solid #888',
            top: '45%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
        },
    };

    const handleSwitchChange = nextChecked => {
        setChecked(nextChecked);
        Http.post('/active_schedule', {
            scheduleId: _id,
            active: nextChecked
        }).then((res) => {
            let result = res.data
            if (result.msg === 'success') {
            }
        });
    };

    const handleSaveSchedule = () => {
        if (scheduleTitle === '') {
            toast.warn('Title is empty.')
            return
        }
        if (scheduleRef.current.value === '') {
            toast.warn('Message is empty.')
            return
        } else {
            setUpdateLoading(true)
            Http.post('/update_schedule', {
                scheduleId: _id,
                duration: curDuration,
                startAt: startTime,
                title: scheduleTitle,
                message: scheduleRef.current.value
            }).then((res) => {
                let result = res.data
                if (result.msg === 'success') {
                    setUpdateLoading(false)
                    dispatch(updateSchedule(result.data))
                    closeModal()
                    toast.success('Schedule was updated successfully.')
                }
            }).catch((err) => {
                setUpdateLoading(false)
                toast.error('Updating was failed.')
            });
        }
    }

    const closeModal = () => {
        setModalIsOpen(false);
    }

    const onHandleEdit = () => {
        handleEdit()
        setModalIsOpen(true)
        setCurrentSchedule(message)
    }

    const handleInputSchedule = (e) => {
        let c_schedule = e.target.value
        setCurrentSchedule(c_schedule)
    }

    const handleInputScheduleTitle = (e) => {
        setScheduleTitle(e.target.value)
    }

    const handleInputDuration = (e) => {
        if (e.target.value > 60) {
            toast.warn('You can not set the duration over 60 mins.')
            return
        }
        setCurDuration(e.target.value)
    }

    return (
        <div className="flex text-base mt-3 pb-2 border-b-[#555] border-b">
            <AiOutlineEdit className="mt-1 cursor-pointer" title="edit schedule" onClick={() => onHandleEdit()} />
            <p className="ml-4">{title}</p>
            <label className="absolute right-4">
                <Switch
                    onChange={handleSwitchChange}
                    checked={checked}
                    onColor="#86d3ff"
                    onHandleColor="#2693e6"
                    handleDiameter={18}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                    height={18}
                    width={36}
                    className="align-middle react-switch" />
            </label>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                class="modal-response"
                style={customStyles}
                contentLabel="Schedule Modal"
            >
                <div className="my-2 text-base text-center text-white">
                    <p>Edit Schedule</p>
                </div>

                <p className="mb-1 text-white">Start at : </p>
                <DatePicker
                    selected={startTime}
                    onChange={(date) => setStartTime(date)}
                    timeInputLabel="Start time:"
                    showTimeSelectOnly
                    dateFormat="h:mm aa"
                    showTimeInput
                    className="p-2 w-full border bg-[#27272ae6] border-[#555] text-white focus:outline-none active:outline-none"
                />

                <p className="mt-2 mb-1 text-white">Duration (mins) : </p>
                <input
                    type="number"
                    min={0}
                    value={curDuration}
                    style={{ background: 'rgba(39, 39, 42, 0.9)' }}
                    className="px-3 py-2 w-full border border-[#555] text-white focus:outline-none active:outline-none"
                    placeholder="Duration (mins)"
                    onChange={handleInputDuration}
                />

                <p className="mt-2 mb-1 text-white">Title : </p>
                <input
                    type="text"
                    value={scheduleTitle}
                    style={{ background: 'rgba(39, 39, 42, 0.9)' }}
                    className="px-3 py-2 w-full border border-[#555] text-white focus:outline-none active:outline-none"
                    placeholder="Enter schedule name.."
                    onChange={handleInputScheduleTitle}
                />

                <p className="mt-2 mb-1 text-white">Message : </p>
                <textarea
                    className="p-3 w-full border border-[#555] text-white focus:outline-none active:outline-none"
                    rows={4}
                    ref={scheduleRef}
                    value={currentSchedule}
                    placeholder="Enter schedule message.."
                    style={{ background: 'rgba(39, 39, 42, 0.9)' }}
                    onChange={handleInputSchedule}
                ></textarea>

                {
                    updateLoading ?
                        <span className="float-right mt-2"><ScaleLoader /></span> :
                        <button
                            title="Save schedule"
                            className="bg-[#16acc9] mt-2 float-right inline-flex items-center justify-center p-2 rounded-md shadow-lg"
                            onClick={handleSaveSchedule}>
                            <AiOutlineSave className="w-6 h-6 text-white" />
                        </button>
                }

            </Modal>
        </div>
    );
}

export default ScheduleItem;
