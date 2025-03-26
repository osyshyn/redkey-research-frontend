// import React, { useState, useEffect } from "react";
// import ReactDOM from "react-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { getFirms } from "../../store/slices/firmSlice";

// import useDeviceType from "../../hooks/useDeviceType";

// import CustomModal from "../CustomModal/CustomModal";
// import CustomInput from "../CustomInput/CustomInput";
// import CustomDropdown from "../CustomDropdown/CustomDropdown";
// import CustomButton from "../CustomButton/CustomButton";
// import ToggleSwitch from "./ToggleSwitch/ToggleSwitch";

// import { userTypeOptions } from "../../constants/constants";

// import "./styles.scss";

// const NewUserModal = ({
//   isCreateNewUserModalOpen = false,
//   onCloseCreateNewUserModal = () => {},
//   onSaveNewUser = () => {},
//   onUpdateUser = () => {},
//   editingUser = null,
// }) => {
//   const [nameEmailUserData, setNameEmailUserData] = useState({
//     first_name: "",
//     last_name: "",
//     email: "",
//   });
//   const [userType, setUserType] = useState(userTypeOptions[0]?.value || "");
//   const [firm, setFirm] = useState("");

//   console.log("userTT", userType, firm);

//   const [isSaveDisabled, setIsSaveDisabled] = useState(true);

//   const [userAccess, setUserAccess] = useState([]);

//   const currentUserDevice = useDeviceType();

//   const dispatch = useDispatch();
//   const firmsList = useSelector((state) => state.firm.firms);

//   useEffect(() => {
//     dispatch(getFirms());
//   }, [dispatch]);

//   console.log("firmsList", firmsList);

//   useEffect(() => {
//     if (firmsList.length > 0) {
//       setUserAccess(
//         firmsList.map((firm) => ({
//           value: false,
//           firm: { id: firm.id, name: firm.name },
//         }))
//       );
//     }
//   }, [firmsList]);

//   useEffect(() => {
//     if (editingUser) {
//       setNameEmailUserData({
//         first_name: editingUser.first_name || "",
//         last_name: editingUser.last_name || "",
//         email: editingUser.email || "",
//       });
//       setUserType(editingUser.role || "");
//       setFirm(editingUser.company || "");
//       setUserAccess(
//         firmsList.map((firm) => {
//           const existingAccess = editingUser.access.find(
//             (access) => access.firm.id === firm.id
//           );
//           return {
//             value: existingAccess ? existingAccess.value : false,
//             firm: { id: firm.id, name: firm.name },
//           };
//         })
//       );
//     }
//   }, [editingUser, firmsList]);

//   useEffect(() => {
//     const isAllFieldsFilled =
//       nameEmailUserData.first_name.trim() &&
//       nameEmailUserData.last_name.trim() &&
//       nameEmailUserData.email.trim() &&
//       userType &&
//       firm &&
//       userAccess.some((access) => access.value === true);

//     setIsSaveDisabled(!isAllFieldsFilled);
//   }, [nameEmailUserData, userType, firm, userAccess, editingUser]);

//   const handleToggle = (index) => {
//     setUserAccess((prev) =>
//       prev.map((item, idx) =>
//         idx === index ? { ...item, value: !item.value } : item
//       )
//     );
//   };

//   const handleSaveNewUser = () => {
//     const userData = {
//       first_name: nameEmailUserData.first_name.trim(),
//       last_name: nameEmailUserData.last_name.trim(),
//       email: nameEmailUserData.email.trim(),
//       role: userType,
//       company: firm,
//       access: userAccess,
//     };

//     if (editingUser) {
//       onUpdateUser({ ...userData, id: editingUser.id });
//     } else {
//       onSaveNewUser(userData);
//     }

//     setNameEmailUserData({
//       first_name: "",
//       last_name: "",
//       email: "",
//     });
//     setUserType("");
//     setFirm("");
//     setUserAccess(
//       firmsList.map((firm) => ({
//         value: false,
//         firm: { id: firm.id, name: firm.name },
//       }))
//     );

//     onCloseCreateNewUserModal();
//   };

//   const modalRoot = document.getElementById("modal-root");

//   return (
//     <>
//       {modalRoot &&
//         ReactDOM.createPortal(
//           <CustomModal
//             isOpen={isCreateNewUserModalOpen}
//             onClose={onCloseCreateNewUserModal}
//             modalTitle={editingUser ? "Edit user" : "Create new user"}
//           >
//             <div
//               className={`${
//                 currentUserDevice === "desktop" ? "profile-first-last-name" : ""
//               }`}
//             >
//               <CustomInput
//                 label="Name"
//                 placeholder="First name"
//                 value={nameEmailUserData.first_name}
//                 onChange={(e) =>
//                   setNameEmailUserData({
//                     ...nameEmailUserData,
//                     first_name: e.target.value,
//                   })
//                 }
//               />
//               <CustomInput
//                 label="Last Name"
//                 placeholder="Last name"
//                 value={nameEmailUserData.last_name}
//                 onChange={(e) =>
//                   setNameEmailUserData({
//                     ...nameEmailUserData,
//                     last_name: e.target.value,
//                   })
//                 }
//                 showLabel={`${
//                   currentUserDevice === "desktop" ? "input-hide-label" : ""
//                 }`}
//               />
//             </div>
//             <CustomInput
//               label="Email"
//               placeholder="example@mail.com"
//               value={nameEmailUserData.email}
//               onChange={(e) =>
//                 setNameEmailUserData({
//                   ...nameEmailUserData,
//                   email: e.target.value,
//                 })
//               }
//             />

//             <div
//               className={`${
//                 currentUserDevice === "desktop" ? "user-type-firm" : ""
//               }`}
//             >
//               <CustomDropdown
//                 label="User type"
//                 placeholder="Select user type"
//                 options={userTypeOptions}
//                 value={userTypeOptions.find((opt) => opt.value === userType)}
//                 onChange={(option) => setUserType(option.value)}
//               />
//               <CustomInput
//                 label="Firm"
//                 placeholder="Enter user firm"
//                 value={firm}
//                 onChange={(e) => setFirm(e.target.value)}
//               />
//             </div>

//             <div className="select-access-option">
//               <label className="access-label">Access</label>
//               <div className="access-list-grid">
//                 {userAccess.map((item, index) => (
//                   <div key={item.firm.id} className="access-item">
//                     <ToggleSwitch
//                       value={item.value}
//                       onToggle={() => handleToggle(index)}
//                     />
//                     <div className="firm-name">{item.firm.name} Research</div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="modal-actions-button">
//               <CustomButton
//                 label="Save"
//                 style="red-shadow"
//                 onClick={handleSaveNewUser}
//                 disabled={isSaveDisabled}
//               />
//             </div>
//           </CustomModal>,
//           modalRoot
//         )}
//     </>
//   );
// };

// export default NewUserModal;

import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { getFirms } from "../../store/slices/firmSlice";
import useDeviceType from "../../hooks/useDeviceType";
import CustomModal from "../CustomModal/CustomModal";
import CustomInput from "../CustomInput/CustomInput";
import CustomDropdown from "../CustomDropdown/CustomDropdown";
import CustomButton from "../CustomButton/CustomButton";
import ToggleSwitch from "./ToggleSwitch/ToggleSwitch";
import { userTypeOptions } from "../../constants/constants";
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
  const [userType, setUserType] = useState(userTypeOptions[0]?.value || "");
  const [firm, setFirm] = useState("");
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    firm: "",
  });
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [userAccess, setUserAccess] = useState([]);

  const currentUserDevice = useDeviceType();
  const dispatch = useDispatch();
  const firmsList = useSelector((state) => state.firm.firms);

  // Validation functions
  const validateName = (name, fieldName) => {
    if (!/^[a-zA-Z0-9' .-]+$/.test(name)) {
      return `Invalid ${fieldName} characters`;
    }
    if (name.length > 20) {
      return `Maximum 20 characters`;
    }
    return "";
  };

  const validateFirm = (value) => {
    if (!/^[a-zA-Z0-9 _.,-]*$/.test(value)) {
      return "Invalid firm name characters";
    }
    if (value.length > 25) {
      return "Maximum 25 characters";
    }
    return "";
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) return "Invalid email format";
    return "";
  };

  // Field change handlers
  const handleFirstNameChange = (e) => {
    const value = e.target.value;
    const error = validateName(value, "first name");
    setNameEmailUserData((prev) => ({ ...prev, first_name: value }));
    setErrors((prev) => ({ ...prev, firstName: error }));
  };

  const handleLastNameChange = (e) => {
    const value = e.target.value;
    const error = validateName(value, "last name");
    setNameEmailUserData((prev) => ({ ...prev, last_name: value }));
    setErrors((prev) => ({ ...prev, lastName: error }));
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    const error = validateEmail(value);
    setNameEmailUserData((prev) => ({ ...prev, email: value }));
    setErrors((prev) => ({ ...prev, email: error }));
  };

  const handleFirmChange = (e) => {
    const value = e.target.value;
    const error = validateFirm(value);
    setFirm(value);
    setErrors((prev) => ({ ...prev, firm: error }));
  };

  // Existing useEffect hooks
  useEffect(() => {
    dispatch(getFirms());
  }, [dispatch]);

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

    const hasErrors = Object.values(errors).some((error) => error !== "");

    setIsSaveDisabled(!isAllFieldsFilled || hasErrors);
  }, [nameEmailUserData, userType, firm, userAccess, errors]);

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

    setNameEmailUserData({ first_name: "", last_name: "", email: "" });
    setUserType("");
    setFirm("");
    setUserAccess(
      firmsList.map((firm) => ({
        value: false,
        firm: { id: firm.id, name: firm.name },
      }))
    );
    setErrors({ firstName: "", lastName: "", email: "", firm: "" });
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
            <div
              className={
                currentUserDevice === "desktop" ? "profile-first-last-name" : ""
              }
            >
              <div>
                <CustomInput
                  label="Name"
                  placeholder="First name"
                  value={nameEmailUserData.first_name}
                  onChange={handleFirstNameChange}
                  error={errors.firstName ? true : false}
                />
                {errors.firstName && (
                  <div className="error-text">{errors.firstName}</div>
                )}
              </div>
              <div>
                <CustomInput
                  label="Last Name"
                  placeholder="Last name"
                  value={nameEmailUserData.last_name}
                  onChange={handleLastNameChange}
                  error={errors.lastName ? true : false}
                  showLabel={
                    currentUserDevice === "desktop" ? "input-hide-label" : ""
                  }
                />
                {errors.lastName && (
                  <div className="error-text">{errors.lastName}</div>
                )}
              </div>
            </div>

            <CustomInput
              label="Email"
              placeholder="example@mail.com"
              value={nameEmailUserData.email}
              onChange={handleEmailChange}
              error={!!errors.email}
              errorText={errors.email}
            />

            <div
              className={
                currentUserDevice === "desktop" ? "user-type-firm" : ""
              }
            >
              <CustomDropdown
                label="User type"
                placeholder="Select user type"
                options={userTypeOptions}
                value={userTypeOptions.find((opt) => opt.value === userType)}
                onChange={(option) => setUserType(option.value)}
              />
              <div>
              <CustomInput
                label="Firm"
                placeholder="Enter user firm"
                value={firm}
                onChange={handleFirmChange}
                error={errors.firm ? true : false}
              />
                  {errors.firm && (
                  <div className="error-text">{errors.firm}</div>
                )}
              </div>
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
