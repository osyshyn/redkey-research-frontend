import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { getFirms } from "../../store/slices/firmSlice";

import CustomModal from "../CustomModal/CustomModal";
import CustomInput from "../CustomInput/CustomInput";
import CustomDropdown from "../CustomDropdown/CustomDropdown";
import CustomButton from "../CustomButton/CustomButton";
import ToggleSwitch from "./ToggleSwitch/ToggleSwitch";

import { USER_TYPES } from "../../constants/constants";

import "./styles.scss";

const NewUserModal = ({
  isCreateNewUserModalOpen = false,
  onCloseCreateNewUserModal = () => {},
  onSaveNewUser = () => {},
  onUpdateUser = () => {},
  editingUser = null,
}) => {
  const [nameEmailUserData, setNameEmailUserData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [userType, setUserType] = useState("");
  const [firm, setFirm] = useState("");

  console.log("userTT", userType, firm);

  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  const [userAccess, setUserAccess] = useState([]);

  const dispatch = useDispatch();
  const firmsList = useSelector((state) => state.firm.firms);

  const userTypeOptions = [
    { value: USER_TYPES.CLIENT, label: "Client" },
    { value: USER_TYPES.ADMIN, label: "Admin" },
    { value: USER_TYPES.SUPER_ADMIN, label: "Super admin" },
  ];

  useEffect(() => {
    dispatch(getFirms());
  }, [dispatch]);

  console.log("firmsList", firmsList);

  useEffect(() => {
    if (firmsList.length > 0) {
      setUserAccess(
        firmsList.map((firm) => ({
          value: false,
          firm: { id: firm.id, name: firm.name },
        }))
      );
    }
  }, [firmsList]);

  useEffect(() => {
    if (editingUser) {
      setNameEmailUserData({
        first_name: editingUser.first_name || "",
        last_name: editingUser.last_name || "",
        email: editingUser.email || "",
      });
      setUserType(editingUser.role || "");
      setFirm(editingUser.company || "");
      setUserAccess(
        firmsList.map((firm) => {
          const existingAccess = editingUser.access.find(
            (access) => access.firm.id === firm.id
          );
          return {
            value: existingAccess ? existingAccess.value : false,
            firm: { id: firm.id, name: firm.name },
          };
        })
      );
    }
  }, [editingUser, firmsList]);

  useEffect(() => {
    const isAllFieldsFilled =
      nameEmailUserData.first_name.trim() &&
      nameEmailUserData.last_name.trim() &&
      nameEmailUserData.email.trim() &&
      userType &&
      firm &&
      userAccess.some((access) => access.value === true);

    setIsSaveDisabled(!isAllFieldsFilled);
  }, [nameEmailUserData, userType, firm, userAccess, editingUser]);

  const handleToggle = (index) => {
    setUserAccess((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, value: !item.value } : item
      )
    );
  };

  const handleSaveNewUser = () => {
    const userData = {
      first_name: nameEmailUserData.first_name.trim(),
      last_name: nameEmailUserData.last_name.trim(),
      email: nameEmailUserData.email.trim(),
      role: userType,
      company: firm,
      access: userAccess,
    };

    if (editingUser) {
      onUpdateUser({ ...userData, id: editingUser.id });
    } else {
      onSaveNewUser(userData);
    }

    setNameEmailUserData({
      first_name: "",
      last_name: "",
      email: "",
    });
    setUserType("");
    setFirm("");
    setUserAccess(
      firmsList.map((firm) => ({
        value: false,
        firm: { id: firm.id, name: firm.name },
      }))
    );

    onCloseCreateNewUserModal();
  };

  const modalRoot = document.getElementById("modal-root");

  return (
    <>
      {modalRoot &&
        ReactDOM.createPortal(
          <CustomModal
            isOpen={isCreateNewUserModalOpen}
            onClose={onCloseCreateNewUserModal}
            modalTitle={editingUser ? "Edit user" : "Create new user"}
          >
            <div className="profile-first-last-name">
              <CustomInput
                label="Name"
                placeholder="First name"
                value={nameEmailUserData.first_name}
                onChange={(e) =>
                  setNameEmailUserData({
                    ...nameEmailUserData,
                    first_name: e.target.value,
                  })
                }
              />
              <CustomInput
                label="Last Name"
                placeholder="Last name"
                value={nameEmailUserData.last_name}
                onChange={(e) =>
                  setNameEmailUserData({
                    ...nameEmailUserData,
                    last_name: e.target.value,
                  })
                }
                showLabel="input-hide-label"
              />
            </div>
            <CustomInput
              label="Email"
              placeholder="example@mail.com"
              value={nameEmailUserData.email}
              onChange={(e) =>
                setNameEmailUserData({
                  ...nameEmailUserData,
                  email: e.target.value,
                })
              }
            />

            <div className="user-type-firm">
              <CustomDropdown
                label="User type"
                placeholder="Select user type"
                options={userTypeOptions}
                value={userTypeOptions.find((opt) => opt.value === userType)}
                onChange={(option) => setUserType(option.value)}
              />
              <CustomInput
                label="Firm"
                placeholder="Enter user firm"
                value={firm}
                onChange={(e) => setFirm(e.target.value)}
              />
            </div>

            <div className="select-access-option">
              <label className="access-label">Access</label>
              <div className="access-list-grid">
                {userAccess.map((item, index) => (
                  <div key={item.firm.id} className="access-item">
                    <ToggleSwitch
                      value={item.value}
                      onToggle={() => handleToggle(index)}
                    />
                    <div className="firm-name">{item.firm.name} Research</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-actions-button">
              <CustomButton
                label="Save"
                style="red-shadow"
                onClick={handleSaveNewUser}
                disabled={isSaveDisabled}
              />
            </div>
          </CustomModal>,
          modalRoot
        )}
    </>
  );
};

export default NewUserModal;
