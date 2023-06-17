import Switch from "react-switch";
import { useState } from "react";
import { useDispatch } from 'react-redux';
import Modal from 'react-modal'
import { AiOutlineEdit } from "react-icons/ai";
import { AiOutlineSave } from "react-icons/ai";
import { toast } from "react-toastify";
import Http from "../service/http";
import { useRef } from "react";
import { updatePrompt } from "../actions/promptAction";
import ScaleLoader from "./ScaleLoader"

function PromptItem(props) {
    const dispatch = useDispatch()
    let promptRef = useRef(null)

    let {
        _id,
        title,
        active,
        totalLength,
        prompt,
        handleEdit
    } = props

    const originPromptLength = prompt.length
    const [currentPrompt, setCurrentPrompt] = useState('')
    const [currentTotalPromptLength, setCurrentTotalPromptLength] = useState(0)
    const [checked, setChecked] = useState(active);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false)

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
            height: '370px',
            background: 'rgba(39, 39, 42, 0.9)',
            border: '1px solid #888',
            top: '45%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
        },
    };

    const handleSwitchChange = nextChecked => {
        setChecked(nextChecked);
        Http.post('/active_prompt', {
            promptId: _id,
            active: nextChecked
        }).then((res) => {
            let result = res.data
            if (result.msg === 'success') {
            }
        });
    };

    const handleSavePrompt = () => {
        if (promptRef.current.value === '') {
            toast.warn('Prompt is empty.')
            return
        } else {
            setUpdateLoading(true)
            Http.post('/update_prompt', {
                promptId: _id,
                prompt: currentPrompt
            }).then((res) => {
                let result = res.data
                if (result.msg === 'success') {
                    setUpdateLoading(false)
                    dispatch(updatePrompt(result.data))
                    closeModal()
                    toast.success('Prompt was updated successfully.')
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
        setCurrentPrompt(prompt)
        setCurrentTotalPromptLength(totalLength)
    }

    const handleInputPrompt = (e) => {
        let c_prompt = e.target.value
        let currentTotalLength = totalLength - originPromptLength + c_prompt.length
        if (currentTotalLength <= 5000) {
            setCurrentTotalPromptLength(currentTotalLength)
            setCurrentPrompt(c_prompt)
        } else {
            toast.warn('The length of prompt can not be over than 5,000 letters.')
        }
    }

    return (
        <div className="flex text-base mt-3 pb-2 border-b-[#555] border-b">
            <AiOutlineEdit className="mt-1 cursor-pointer" title="edit prompt" onClick={() => onHandleEdit()} />
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
                    className="react-switch align-middle" />
            </label>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                class="modal-response"
                style={customStyles}
                contentLabel="Prompt Modal"
            >
                <div className="text-center text-white text-base my-2 pb-2">
                    <p>Edit Prompt</p>
                </div>
                <div className="text-white">
                    <p className="text-xl float-left mb-2">{title} <span className="text-sm">({currentPrompt.length} letters)</span></p>
                    <span className="float-right mt-2">{currentTotalPromptLength}/5000</span>
                </div>
                <textarea
                    className="p-3 w-full border border-[#555] text-white focus:outline-none active:outline-none"
                    rows={6}
                    ref={promptRef}
                    value={currentPrompt}
                    placeholder="Input prompt"
                    style={{ background: 'rgba(39, 39, 42, 0.9)' }}
                    onChange={handleInputPrompt}
                ></textarea>
                {
                    updateLoading ?
                        <span className="mt-2 float-right"><ScaleLoader /></span> :
                        <button
                            title="Save prompt"
                            className="bg-[#16acc9] mt-2 float-right inline-flex items-center justify-center p-2 rounded-md shadow-lg"
                            onClick={handleSavePrompt}>
                            <AiOutlineSave className="text-white h-6 w-6" />
                        </button>
                }

            </Modal>
        </div>
    );
}

export default PromptItem;
