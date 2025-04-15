import React, { Component } from "react";
import "./App.css";
import { FaEye } from "react-icons/fa"; 

class Table extends Component {
  constructor() {
    super();
    this.state = {
      newName: "",
      newAge: "",
      newEmail: "",
      newBranch: "",
      newGPA: "",
      data: [],
      selectedStudent: null,
    };
  }

  componentDidMount() {
    this.fetchStudents();
  }

  fetchStudents = () => {
    fetch("http://localhost:3000/students")
      .then((res) => res.json())
      .then((data) => this.setState({ data }))
      .catch((err) => console.error("Error fetching data:", err));
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  addStudent = () => {
    const newStudent = {
      name: this.state.newName,
      age: parseInt(this.state.newAge),
      email: this.state.newEmail,
      Branch: this.state.newBranch,
      gpa: parseFloat(this.state.newGPA),
    };

    fetch("http://localhost:3000/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newStudent),
    })
      .then((res) => res.json())
      .then((data) => {
        this.setState((prevState) => ({
          data: [...prevState.data, data],
          newName: "",
          newAge: "",
          newEmail: "",
          newBranch: "",
          newGPA: "",
        }));
      })
      .catch((err) => console.error("Error adding student:", err));
  };

  deleteStudent = (id) => {
    fetch(`http://localhost:3000/students/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          this.setState((prevState) => ({
            data: prevState.data.filter((student) => student.id !== id),
          }));
        } else {
          console.error("Error deleting student:", res.status);
        }
      })
      .catch((err) => console.error("Error deleting student:", err));
  };

  viewStudentDetails = (student) => {
    this.setState({ selectedStudent: student });
  };

  render() {
    return (
      <div>
        <h2>Students List</h2>

        <div>
          <input
            type="text"
            name="newName"
            placeholder="Name"
            value={this.state.newName}
            onChange={this.handleInputChange}
          />
          <input
            type="number"
            name="newAge"
            placeholder="Age"
            value={this.state.newAge}
            onChange={this.handleInputChange}
          />
          <input
            type="email"
            name="newEmail"
            placeholder="Email"
            value={this.state.newEmail}
            onChange={this.handleInputChange}
          />
          <input
            type="text"
            name="newBranch"
            placeholder="branch"
            value={this.state.newBranch}
            onChange={this.handleInputChange}
          />
          <input
            type="number"
            step="0.1"
            name="newGPA"
            placeholder="GPA"
            value={this.state.newGPA}
            onChange={this.handleInputChange}
          />
          <button onClick={this.addStudent}>Add Student</button>
        </div>

        <table border="1" cellSpacing={0} cellPadding={5}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Email</th>
              <th>Branch</th>
              <th>GPA</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.age}</td>
                <td>{student.email}</td>
                <td>{student.Branch}</td>
                <td>{student.gpa}</td>
                <td>
                  <button className="view" onClick={() => this.viewStudentDetails(student)}>
                    <FaEye /> {/* Eye icon */}
                  </button>
                  <button className="delete" onClick={() => this.deleteStudent(student.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {this.state.selectedStudent && (
          <div className="student-details">
            <h2>Student Details</h2>
            <p><strong>ID:</strong> {this.state.selectedStudent.id}</p>
            <p><strong>Name:</strong> {this.state.selectedStudent.name}</p>
            <p><strong>Age:</strong> {this.state.selectedStudent.age}</p>
            <p><strong>Email:</strong> {this.state.selectedStudent.email}</p>
            <p><strong>Branch:</strong> {this.state.selectedStudent.Branch}</p>
            <p><strong>GPA:</strong> {this.state.selectedStudent.gpa}</p>
            <button onClick={() => this.setState({ selectedStudent: null })}>Close</button>
          </div>
        )}
      </div>
    );
  }
}

export default Table;