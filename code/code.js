// LOcation filter code
useEffect(() => {
  // Filter employees based on location
  const selectLoca = allEmployee.filter(
    (loc) => loc?.location === formData?.location
  );
  setSelectLocationEmp(selectLoca);

  // Find the specific employee by name and update the designation in formData
  const desi = selectLoca.find((desi) => desi?.empname === formData?.empname);

  // Update formData if the designation is different and desi is found
  if (desi && formData.designation !== desi.designation) {
    setFormData((prevFormData) => ({
      ...prevFormData,
      designation: desi.designation || "", // Ensure fallback value if desi.designation is undefined
    }));
  }
}, [formData.location, formData.empname, allEmployee, setSelectLocationEmp]);

// loan master modal form code
<div className="flex flex-row">
  {/* column1 */}
  <div className="flex flex-col w-1/2">
    <Select
      label={"Location"}
      id={"location"}
      value={formData.location}
      options={allLocation.map((location) => ({
        value: location.location,
        _id: location._id,
      }))}
      onChange={handleChange}
      name="location"
    />

    <Select
      label={"Employee Name"}
      id={"empname"}
      value={formData?.empname}
      options={selectLocationEmp?.map((name) => ({
        value: name?.empname,
        _id: name?._id,
      }))}
      onChange={handleChange}
      name="empname"
    />

    <Input
      label={"Designation"}
      type={"text"}
      id={"designation"}
      isDisabled={true}
      formData={formData?.designation}
      name="designation"
      handleChange={handleChange}
    />

    <Select
      label={"Approved"}
      id={"approved_by"}
      value={formData?.approved_by}
      options={approvedBy?.map((appro) => ({
        value: appro?.approved_by,
        _id: appro?._id,
      }))}
      onChange={handleChange}
      name="approved_by"
    />

    <Select
      label={"Loan Type"}
      id={"loan_type"}
      value={formData?.loan_type}
      options={loanType?.map((loantype) => ({
        value: loantype?.loan_type,
        _id: loantype?._id,
      }))}
      onChange={handleChange}
      name="loan_type"
    />
  </div>
  {/* column2 */}
  <div className="flex flex-col w-1/2">
    <div className="flex flex-row ">
      <label
        htmlFor="loan_start"
        className="px-1 whitespace-nowrap text-wrap text-sm font-questrial font-normal"
      >
        Loan Start
      </label>
    </div>
    <div className="flex flex-row mb-3 w-full">
      <DatePicker
        id="loan_start"
        selected={formData.loan_start}
        onChange={(date) =>
          handleChange({ target: { name: "loan_start", value: date } })
        }
        className="mt-1 p-2.5 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md mr-2"
      />
    </div>

    <Input
      label={"Amount"}
      type={"number"}
      id={"loan_amount"}
      formData={formData?.loan_amount}
      handleChange={handleChange}
      name="loan_amount"
    />

    <Input
      label={"No Of Installment"}
      type={"text"}
      id={"no_of_installment"}
      formData={formData?.no_of_installment}
      handleChange={handleChange}
      name="no_of_installment"
    />

    <Select
      label={"Calculation Type"}
      id={"calculation_tpye"}
      value={formData?.calculation_tpye}
      options={calculationTpye?.map((calcu) => ({
        value: calcu?.calculation_tpye,
        _id: calcu?._id,
      }))}
      onChange={handleChange}
      name="calculation_tpye"
    />
  </div>
</div>;

//
const getLoanMasterFunc = async () => {
  try {
    const { data } = await axios.get(getLoanMasterUrl);

    // Extract employee_ids from loan_master
    const employee_ids = data.loan_master.map((e) => e.employee_id);

    // Map through loan_master and find the corresponding employee details
    const loanMaster = data.loan_master.map((loan) => {
      // Find the specific employee matching the loan's employee_id
      const employee = employees.find((e) => e._id === loan.employee_id);

      // If employee is found, add the employee details to the loan object
      if (employee) {
        return {
          ...loan,
          empname: employee.empname,
          empcode: employee.empcode,
        };
      }

      // If no employee is found, return the loan object without changes
      return loan;
    });

    console.log("loanMaster", loanMaster);

    // Update the state with the loanMaster data
    setProducts(loanMaster);
    setLoading(false);
  } catch (error) {
    console.error("Error fetching loan master data:", error);
    setLoading(false);
  }
};

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch employees first
      const { data: employeeData } = await axios.get(url);
      setEmployees(employeeData);

      // Fetch loan master data after employees have been fetched
      const { data: loanMasterData } = await axios.get(getLoanMasterUrl);

      // Map loan master data with corresponding employee details
      const loanMaster = loanMasterData?.loan_master.map((loan) => {
        const employee = employeeData?.find((e) => e._id === loan.employee_id);
        if (employee) {
          return {
            ...loan,
            empcode: employee.empcode,
            empname: employee.empname,
            designation: employee.designation,
            location: employee.location,
            department: employee.department,
          };
        }
        return loan;
      });

      // Update the products state with the enriched loan data
      setProducts(loanMaster);
      console.log("loanMaster===>", loanMaster);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [url, getLoanMasterUrl]);

useEffect(() => {
  const selectLoca = allEmployee.filter(
    (loc) => loc?.location === formData?.location
  );
  setSelectLocationEmp(selectLoca);

  const desi = selectLoca.find((desi) => desi?.empname === formData?.empname);

  const updatedFormData = {
    ...formData,
    designation: desi?.designation || "",
    empcode: desi?.empcode || "",
    employee_id: desi?._id || "",
    ins_amount: Math.abs(
      (formData.loan_amount || 0) / (formData.noi || 0)
    ).toFixed(2),
    balance: formData.loan_amount || 0,
  };

  setFormData(updatedFormData);
}, [
  formData.location,
  formData.empname,
  formData.noi,
  formData.loan_amount,
  allEmployee,
  setSelectLocationEmp,
]);

import { useState, useEffect } from "react";

const INITIAL_FORM_DATA = {
  employee_id: "",
  loan_master_id: "",
  approved_by: "",
  loan_type: "",
  date: "",
  payment_mood: "",
  loan_amount: 0,
  return_amount: 0,
  empcode: "",
  ins_amount: 0,
  noi: 0,
  balance: 0,
  location: "",
  empname: "",
  designation: "",
};

function YourComponent() {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  useEffect(() => {
    // Ensure balance and return_amount are valid numbers
    const balance = Number(formData.balance) || 0;
    const returnAmount = Number(formData.return_amount) || 0;

    // If both are valid, calculate the new balance
    if (!isNaN(balance) && !isNaN(returnAmount)) {
      const remainingBalance = balance - returnAmount;

      // Update the formData immutably
      setFormData((prevFormData) => ({
        ...prevFormData,
        balance: remainingBalance >= 0 ? remainingBalance : 0, // Prevent negative balance
      }));
    }
  }, [formData.return_amount]); // Only run when return_amount changes

  // Your component JSX here
}

export default YourComponent;

const getLoanTransitionData = async (id) => {
  try {
    const { data } = await axios.get(`${getLoanTransitionUrl}/${id}`);
    console.log("Loan Transition data====>", data.loan_transition);

    const loanTrans = data.loan_transition.map((trans) => {
      if (selectedRow._id === trans.loan_master_id) {
        return { ...trans, empname: selectedRow.empname };
      }
      return trans;
    });

    setTransitionLoan(loanTrans);
  } catch (error) {
    console.log("Error fetching loan transition data:", error);
  }
};

useEffect(() => {
  if (selectedRow && selectedRow._id) {
    getLoanTransitionData(selectedRow._id);
  }
}, [selectedRow]);

<div className="w-full">
  <table className="w-full table-auto border border-gray-300">
    <thead className="border text-center border-gray-300">
      <tr>
        <th className="p-1 font-medium border border-gray-300">
          Employee Name
        </th>
        <th className="p-1 font-medium border border-gray-300">Payment Date</th>
        <th className="p-1 font-medium border border-gray-300">Amount</th>
        <th className="p-1 font-medium border border-gray-300">Type</th>
        <th className="p-1 font-medium border border-gray-300">Mood</th>
      </tr>
    </thead>
    <tbody className="border text-center border-gray-300">
      {transitionLoan.map((trans) => (
        <tr key={trans._id} className="border border-gray-300">
          <td className="p-1 border border-gray-300">{trans?.empname}</td>
          <td className="p-1 border border-gray-300">
            {format(new Date(trans?.date), "dd/MM/yyyy")}
          </td>
          <td className="p-1 border border-gray-300">{trans?.return_amount}</td>
          <td className="p-1 border border-gray-300">
            {trans.method === "R" ? "Loan Return" : "Salary"}
          </td>
          <td className="p-1 border border-gray-300">{trans.payment_mood}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>;

// Submission logic
const submitForm = async () => {
  try {
    const obj = { ...formData, method: "R", balance: remainingBalance };

    // Submission logic
    try {
      const { data } = await axios.post(postLoanTransitionUrl, obj);
      setAlert({ type: "success", message: "Record submitted successfully!" });
    } catch (error) {
      setAlert({
        type: "error",
        message: "An error occurred during submission.",
      });
    }

    // Update loan master logic
    try {
      await axios.put(`${updateLoanMasterUrl}/${formData._id}`, obj);
    } catch (error) {
      console.error("Error updating loan master:", error);
    }

    // Close modal and refresh data
    closeModal();
    fetchData();
    setModalOpen(true);
  } catch (error) {
    console.error("Error:", error);
    setAlert({
      type: "error",
      message: "An error occurred. Please try again later.",
    });
    setModalOpen(true);
  }
};

// Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();

  // Show confirmation alert if not already confirmed
  if (!isConfirm) {
    setConfirmAlert({
      message:
        "Please ensure all values are correct before submission. Once submitted, the Transition will not be editable.",
    });
    setIsConfirm(true);
    return; // Stop further execution until confirmed
  }

  // Proceed with submission after confirmation
  submitForm();
};

// Handle confirmation modal close
const closeConfirmAlertModal = (confirmed) => {
  if (confirmed) {
    // If confirmed, proceed with submission
    setIsConfirm(false);
    submitForm(); // Call submitForm directly
  } else {
    // If not confirmed, reset confirmation state
    setIsConfirm(false);
  }
};

// Confirmation modal
{
  isConfirm && (
    <ModalConfirmAlert
      closeConfirmAlertModal={closeConfirmAlertModal}
      message={confirmAlert?.message}
    />
  );
}

import React from "react";

const ModalConfirmAlert = ({ closeConfirmAlertModal, message }) => {
  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
        &#8203;
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg">
          <div className="bg-white px-4 pt-5 pb-2 sm:p-6 sm:pb-4">
            <div className="sm:flex-col sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full sm:mx-0 sm:h-10 sm:w-10">
                {/* Alert Icon */}
                <svg
                  height="200px"
                  width="200px"
                  version="1.1"
                  id="Layer_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 512 512"
                  xmlSpace="preserve"
                  fill="#000000"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <g id="SVGRepo_iconCarrier">
                    <polygon
                      style={{ fill: "#FFFFFF" }}
                      points="13.728,473.992 256,46.24 498.272,473.992 "
                    />
                    <path
                      style={{ fill: "#DB2B42" }}
                      d="M256,62.472l228.552,403.52H27.448L256,62.472 M256,30.008L0,481.992h512L256,30.008L256,30.008z"
                    />
                    <path
                      style={{ fill: "#2D2D2D" }}
                      d="M226.112,396.344c0-17.216,12.024-29.56,29.232-29.56c17.216,0,28.584,12.344,28.912,29.56
                                        c0,16.888-11.368,29.552-28.912,29.552C237.808,425.896,226.112,413.232,226.112,396.344z M236.84,350.536l-7.48-147.144h51.648
                                        l-7.152,147.152L236.84,350.536L236.84,350.536z"
                    />
                  </g>
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Confirmation Message
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{message}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={() => closeConfirmAlertModal(true)} // Pass true for confirmed
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={() => closeConfirmAlertModal(false)} // Pass false for canceled
              className="ml-2 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// export default ModalConfirmAlert;

const [employeeStatusRows, setEmployeeStatusRows] = useState([]);

const handleEmployeeStatusAddRow = () => {
  setEmployeeStatusRows([
    ...employeeStatusRows,
    {
      id: Date.now(),
      emp_status_date: "",
      emp_status_id: "",
      status_name: "",
      remark: "",
      status: "i",
    },
  ]);
};

const handleEmployeeStatusChange = (e, rowId, fieldName) => {
  const { value } = e.target;

  const updatedRows = employeeStatusRows.map((row) =>
    row.id === rowId
      ? {
          ...row,
          [fieldName]: value,
          ...(fieldName === "status_name" && {
            emp_status_id: employee_status.find(
              (option) => option.status_name === value
            )?.emp_status_id,
          }),
        }
      : row
  );

  setEmployeeStatusRows(updatedRows);
};

const handleEmpStatusDateChange = (date, index) => {
  const updatedRows = employeeStatusRows.map((row, i) =>
    i === index ? { ...row, emp_status_date: date } : row
  );

  setEmployeeStatusRows(updatedRows);
};

<tbody className="border text-center border-gray-300">
  {employeeStatusRows?.map((row, i) => (
    <tr key={row?.id} className="border border-gray-300">
      <td></td>
      <td className="border border-gray-300">
        <DatePicker
          name="emp_status_date"
          id="emp_status_date"
          selected={row.emp_status_date}
          placeholderText="Select Date"
          onChange={(date) => handleEmpStatusDateChange(date, i)}
          className="focus:ring-0 focus:border-none outline-none border-none block w-full"
        />
      </td>

      <td className="border border-gray-300">
        <select
          className="focus:ring-0 focus:border-none outline-none border-none block w-full sm:text-sm"
          value={row?.status_name}
          onChange={(e) => handleEmployeeStatusChange(e, row.id, "status_name")}
        >
          <option disabled value="">
            Select Employee Status
          </option>
          {employee_status?.map((option) => (
            <option key={option?._id}>{option?.status_name}</option>
          ))}
        </select>
      </td>
      <td className="border border-gray-300">
        <input
          type="text"
          name="re_mark"
          id="re_mark"
          value={row?.remark}
          placeholder="Add Re-mark"
          onChange={(e) => handleEmployeeStatusChange(e, row.id, "remark")}
          className="focus:ring-0 focus:border-none outline-none border-none block"
        />
      </td>
      <td>
        <div className="flex justify-center items-center gap-2">
          <button
            type="button"
            className="font-poiretone text-white bg-slate-600 hover:bg-green-800 focus:ring-4 focus:ring-green-300 rounded-md text-sm px-1.5 p-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
          >
            <MdDataSaverOn />
          </button>
          <button
            type="button"
            className="font-poiretone focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 rounded-md text-sm px-1.5 p-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          >
            <FaDeleteLeft />
          </button>
        </div>
      </td>
    </tr>
  ))}
</tbody>;

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { FaPlusCircle, FaDeleteLeft } from "react-icons/fa";
import { MdDataSaverOn } from "react-icons/md";

const EmployeeStatusTable = ({ employee_status }) => {
  const [employeeStatusRows, setEmployeeStatusRows] = useState([]);

  // Add a new row
  const handleEmployeeStatusAddRow = () => {
    setEmployeeStatusRows([
      ...employeeStatusRows,
      {
        id: Date.now(),
        emp_status_date: "",
        emp_status_id: "",
        status_name: "",
        review: "",
      },
    ]);
  };

  // Handle changes in select, input, and review fields
  const handleEmployeeStatusChange = (e, rowId, fieldName = "status_name") => {
    const { value } = e.target;

    const updatedRows = employeeStatusRows.map((row) =>
      row.id === rowId
        ? {
            ...row,
            [fieldName]: value,
            ...(fieldName === "status_name" && {
              emp_status_id: employee_status.find(
                (option) => option.status_name === value
              )?.emp_status_id,
            }),
          }
        : row
    );

    setEmployeeStatusRows(updatedRows);
  };

  // Handle date changes
  const handleEmpStatusDateChange = (date, index) => {
    const updatedRows = employeeStatusRows.map((row, i) =>
      i === index ? { ...row, emp_status_date: date } : row
    );

    setEmployeeStatusRows(updatedRows);
  };

  return (
    <div className="w-full">
      <table className="w-full table-auto border border-gray-300">
        <thead className="border text-center border-gray-300">
          <tr>
            <th
              onClick={handleEmployeeStatusAddRow}
              className="flex justify-center items-center h-[35px] cursor-pointer"
            >
              <FaPlusCircle />
            </th>
            <th className="font-semibold border border-gray-300">Date</th>
            <th className="font-semibold border border-gray-300">
              Employee Status
            </th>
            <th className="font-semibold border border-gray-300">Review</th>
            <th className="font-semibold border border-gray-300">Action</th>
          </tr>
        </thead>
        <tbody className="border text-center border-gray-300">
          {employeeStatusRows?.map((row, i) => (
            <tr key={row?.id} className="border border-gray-300">
              <td></td>
              <td className="border border-gray-300">
                <DatePicker
                  name="emp_status_date"
                  id="emp_status_date"
                  selected={row.emp_status_date}
                  placeholderText="Select Date"
                  onChange={(date) => handleEmpStatusDateChange(date, i)}
                  className="focus:ring-0 focus:border-none outline-none border-none block w-full"
                />
              </td>

              <td className="border border-gray-300">
                <select
                  className="focus:ring-0 focus:border-none outline-none border-none block w-full sm:text-sm"
                  value={row?.status_name}
                  onChange={(e) => handleEmployeeStatusChange(e, row.id)}
                >
                  <option disabled value="">
                    Select Employee Status
                  </option>
                  {employee_status?.map((option) => (
                    <option key={option?._id} value={option?.status_name}>
                      {option?.status_name}
                    </option>
                  ))}
                </select>
              </td>
              <td className="border border-gray-300">
                <input
                  type="text"
                  name="review"
                  id="review"
                  value={row?.review}
                  placeholder="Add Review"
                  onChange={(e) =>
                    handleEmployeeStatusChange(e, row.id, "review")
                  }
                  className="focus:ring-0 focus:border-none outline-none border-none block"
                />
              </td>
              <td>
                <div className="flex justify-center items-center gap-2">
                  <button
                    type="button"
                    className="font-poiretone text-white bg-slate-600 hover:bg-green-800 focus:ring-4 focus:ring-green-300 rounded-md text-sm px-1.5 p-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
                  >
                    <MdDataSaverOn />
                  </button>
                  <button
                    type="button"
                    className="font-poiretone focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 rounded-md text-sm px-1.5 p-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                  >
                    <FaDeleteLeft />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// export default EmployeeStatusTable;

const handleEmpStatusChange = (e, rowId) => {
  const selected = employee_status?.find(
    (option) => option?.status_name === e.target.value
  );
  const updatedRows = empStatusRows.map((row) =>
    row.id === rowId
      ? {
          ...row,
          emp_status_id: selected?.emp_status_id,
          status_name: selected?.status_name,
          // Add any additional fields that need to be updated based on the selected option
        }
      : row
  );
  setEmpStatusRows(updatedRows);
  console.log("updatedRowsEmpStatus", updatedRows);
};

useEffect(() => {
  if (isEditMode) {
    setMembers(familyData);

    const formattedEmpStatus = empStatus.map((status) => ({
      id: status._id, // Ensure you are using the unique ID from the backend
      emp_status_date: new Date(status.emp_status_date), // Convert date string to Date object if needed
      status_name: status.status_name,
      review: status.review || "",
      status: status.status || "i", // Ensure all fields are properly mapped
    }));

    setEmpStatusRows(formattedEmpStatus);
    setPermotionRows([...empPermotion]);

    console.log("empStatus======>", formattedEmpStatus);
    console.log("empPermotion=====>", permotionRows);
  }
}, [isEditMode, familyData, empStatus, empPermotion]);

useEffect(() => {
  if (isEditMode) {
    setMembers(familyData);

    // Convert date strings to Date objects
    const formattedEmpStatus = empStatus.map((status) => ({
      id: status._id || Date.now(), // Ensure you have a unique ID
      emp_status_date: new Date(status.emp_status_date), // Convert string to Date object
      status_name: status.status_name,
      review: status.review || "",
      status: status.status || "i",
    }));

    setEmpStatusRows(formattedEmpStatus);
    setPermotionRows([...empPermotion]);
  }
}, [isEditMode, familyData, empStatus, empPermotion]);

<DatePicker
  name="emp_status_date"
  id="emp_status_date"
  selected={row?.emp_status_date} // This should now be a Date object
  placeholderText="Select Date"
  onChange={(date) => handleEmpStatusDateChange(date, i)}
  className="focus:ring-0 focus:border-none outline-none border-none block w-full"
/>;
