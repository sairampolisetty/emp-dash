import { useState, useEffect } from "react";
import "./Employee.css";

function EmployeeDashboard() {
  const [employees, setEmployees] = useState(() => {
    const getItems = localStorage.getItem("emps");
    return getItems ? JSON.parse(getItems) : [];
  });
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("emps", JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    setLoading(true);
    fetch("https://dummyjson.com/users")
      .then((response) => response.json())
      .then((data) => {
        setEmployees(data.users);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleDeleteEmployee = (empID) => {
    setEmployees(employees.filter((emp) => emp.id !== empID));
  };

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.firstName.toLowerCase().includes(searchInput.toLowerCase()),
  );

  const noOfEmps = 8;
  const lastPageId = currentPage * noOfEmps;
  const firstPageId = lastPageId - noOfEmps;
  const currentPageEmps = filteredEmployees.slice(firstPageId, lastPageId);
  const totalPages = Math.ceil(filteredEmployees.length / noOfEmps);
  console.log(isLoading);
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prevstate) => prevstate + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prevstate) => prevstate - 1);
  };

  return (
    <div>
      <h1>Employee Dashboard</h1>
      <input value={searchInput} onChange={handleSearch} type="search" />
      <ul className="employee-cards">
        {isLoading ? (
          <div>
            <h1>Loading....</h1>
          </div>
        ) : (
          <>
            {currentPageEmps.map((emp) => (
              <li key={emp.id}>
                <h3>
                  {emp.firstName} {emp.lastName}
                </h3>
                <p>Gender: {emp.gender}</p>
                <p>Mail: {emp.email}</p>
                <p>Company Name: {emp.company.name}</p>
                <button onClick={() => handleDeleteEmployee(emp.id)}>
                  Delete
                </button>
              </li>
            ))}
          </>
        )}
      </ul>
      <div className="pagination">
        <button onClick={handlePrev}>prev</button>
        <p>
          {currentPage} of {totalPages}
        </p>
        <button onClick={handleNext}>next</button>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
