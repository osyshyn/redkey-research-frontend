import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useSelector } from "react-redux";
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
  //   onUpdateNewUser = () => {},
  editingNewUser = null,
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

  const [userAccess, setUserAccess] = useState([
    { value: false, firm: { id: 1, name: "Antrim" } },
    { value: false, firm: { id: 2, name: "Lafitte" } },
    { value: false, firm: { id: 3, name: "Pacific Square" } },
    { value: false, firm: { id: 4, name: "Pryrania" } },
  ]);

  const userTypeOptions = [
    { value: USER_TYPES.CLIENT, label: "Client" },
    { value: USER_TYPES.ADMIN, label: "Admin" },
    { value: USER_TYPES.SUPER_ADMIN, label: "Super admin" },
  ];

  const handleToggle = (index) => {
    setUserAccess((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, value: !item.value } : item
      )
    );
  };

  //   const currentFileId = useSelector((state) => state.upload.currentFileId);

  //   useEffect(() => {
  //     if (editingNewUser) {
  //       setResearchTitle(editingNewUser.title || "");
  //       setSelectedFolder(editingNewUser.currentFolder || null);
  //       setResearchDate(
  //         editingNewUser.publication_date
  //           ? new Date(editingNewUser.publication_date)
  //           : null
  //       );
  //       setReportType(editingNewUser.report_type || null);
  //     }
  //   }, [editingNewUser]);

  // useEffect(() => {
  //   const isAllFieldsFilled =
  //     (researchTitle.trim() &&
  //       selectedFolder &&
  //       researchDate &&
  //       reportType &&
  //       currentFileId !== null) ||
  //     editingNewUser?.file;
  //   setIsSaveDisabled(!isAllFieldsFilled);
  // }, [researchTitle, selectedFolder, researchDate, reportType, currentFileId]);

  useEffect(() => {
    const isAllFieldsFilled =
      nameEmailUserData.first_name.trim() &&
      nameEmailUserData.last_name.trim() &&
      nameEmailUserData.email.trim() &&
      userType &&
      firm &&
      userAccess.some((access) => access.value === true);

    setIsSaveDisabled(!isAllFieldsFilled);
  }, [nameEmailUserData, userType, firm, userAccess]);

  const handleSaveNewUser = () => {
    const userData = {
      first_name: nameEmailUserData.first_name.trim(),
      last_name: nameEmailUserData.last_name.trim(),
      email: nameEmailUserData.email.trim(),
      role: userType,
      company: firm,
      access: userAccess,
    };

    onSaveNewUser(userData);

    // if (editingNewUser) {
    //   onUpdateNewUser({ ...researchData, id: editingNewUser.id });
    // } else {
    //   onSaveNewUser(researchData);
    // }

    setNameEmailUserData({
      first_name: "",
      last_name: "",
      email: "",
    });
    setUserType("");
    setFirm("");
    setUserAccess([
      { value: false, firm: { id: 1, name: "Antrim" } },
      { value: false, firm: { id: 2, name: "Lafitte" } },
      { value: false, firm: { id: 3, name: "Pacific Square" } },
      { value: false, firm: { id: 4, name: "Pryrania" } },
    ]);

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
            modalTitle={editingNewUser ? "Edit user" : "Create new user"}
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
              <CustomDropdown
                label="Firm"
                placeholder="Select firm"
                options={[1, 2]}
                value={firm}
                onChange={(option) => setFirm(option)}
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
