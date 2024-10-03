import { useEffect, useState } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const columns = [
  { id: "id", label: "ID", minWidth: 50 },
  { id: "username", label: "Username", minWidth: 170 },
  { id: "role", label: "Role", minWidth: 100 },
  { id: "actions", label: "Actions", minWidth: 170, align: "center" },
];

export default function StickyUserTable() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/getAllUsers`
        );
        if (response.data.success) {
          setUsers(response.data.data);
          setFilteredUsers(response.data.data);
        } else {
          setError("Failed to fetch users");
        }
      } catch (error) {
        setError(
          "An error occurred: " +
            (error.response?.data?.message || error.message)
        );
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const filterUsers = () => {
      switch (selectedRole) {
        case "admin":
          setFilteredUsers(users.filter((user) => user.role === "admin"));
          break;
        case "user":
          setFilteredUsers(users.filter((user) => user.role === "user"));
          break;
        default:
          setFilteredUsers(users);
          break;
      }
    };

    filterUsers();
  }, [selectedRole, users]);

  const handleEdit = (user) => {
    setEditingUser(user._id);
    console.log("editable user is", user);
    setFormData({
      username: user.username,
      role: user.role,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDelete = async (userId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/v1/deleteUser/${userId}`
      );
      console.log("delete ", response.data);
      if (response.data.success) {
        setUsers(users.filter((user) => user._id !== userId));
      } else {
        setError("Failed to delete user");
      }
    } catch (error) {
      setError(
        "An error occurred: " + (error.response?.data?.message || error.message)
      );
    }
  };

  const handleUpdate = async (userId) => {
    if (!formData.username || !formData.role) {
      setError("Username and role are required");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8000/api/v1/updateUser/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        setUsers(
          users.map((user) =>
            user._id === userId ? { ...user, ...formData } : user
          )
        );
        setEditingUser(null);
        setFormData({ username: "", role: "" });
        setError("");
      } else {
        setError("Failed to update user");
      }
    } catch (error) {
      setError(
        "An error occurred: " + (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <>
      <Paper
        sx={{
          width: "200vh",
          height: "80vh",
          overflow: "auto",
          margin: "30px 0px",
          marginLeft: "40px",
          bgcolor: "#1A1A1A", // Removed the outer border by excluding 'border'
        }}
      >
        {error && <p style={{ color: "red" }}>{error}</p>}

        <div style={{ backgroundColor: "#1A1A1A", color: "white" }}>
          <TableContainer
            sx={{
              width: "800px",
              marginLeft: "175px",
              backgroundColor: "#262626",
            }}
          >
            <div
              style={{
                display: "flex",
                height: "50px",
                padding: "30px 0px 0px 0px",
              }}
            >
              <Typography sx={{ marginLeft: "20px", fontSize: "15px" }}>
                USER CREDENTIALS
              </Typography>
              <label htmlFor="roleFilter" style={{ marginLeft: "400px" }}>
                Filter by role
              </label>
              <select
                id="roleFilter"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                style={{
                  backgroundColor: "greenYellow",
                  color: "black",
                  height: "30px",
                  borderRadius: "10px",
                  border: "2px solid black",
                  marginLeft: "10px",
                }}
              >
                <option value="all">All Users</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      sx={{
                        minWidth: column.minWidth,
                        color: "black",
                        fontWeight: "bold",
                        backgroundColor: "greenYellow",
                        borderRight: "1px solid black", // Black border for columns
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user, index) => (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={user._id}
                    sx={{
                      borderBottom: "1px solid white", // White border between rows
                    }}
                  >
                    <TableCell
                      sx={{ color: "white", borderRight: "1px solid black" }}
                    >
                      {String(index + 1).padStart(3, "0")}
                    </TableCell>
                    <TableCell
                      sx={{ color: "white", borderRight: "1px solid black" }}
                    >
                      {editingUser === user._id ? (
                        <TextField
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          variant="standard"
                          sx={{
                            input: { color: "white" },
                            "& .MuiInputBase-root": { color: "white" },
                          }}
                        />
                      ) : (
                        user.username
                      )}
                    </TableCell>
                    <TableCell
                      sx={{ color: "white", borderRight: "1px solid black" }}
                    >
                      {editingUser === user._id ? (
                        <TextField
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          select
                          SelectProps={{ native: true }}
                          variant="standard"
                          sx={{
                            input: { color: "white" },
                            "& .MuiInputBase-root": {
                              color: "white",
                              backgroundColor: "black",
                            },
                          }}
                        >
                          <option
                            value="user"
                            style={{ backgroundColor: "black" }}
                          >
                            User
                          </option>
                          <option
                            value="admin"
                            style={{ backgroundColor: "black" }}
                          >
                            Admin
                          </option>
                        </TextField>
                      ) : (
                        user.role
                      )}
                    </TableCell>
                    <TableCell align="center" sx={{ color: "white" }}>
                      {editingUser === user._id ? (
                        <Button
                          variant="contained"
                          onClick={() => handleUpdate(user._id)}
                        >
                          Save
                        </Button>
                      ) : (
                        <IconButton
                          onClick={() => handleEdit(user)}
                          color="inherit"
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                      <IconButton
                        onClick={() => handleDelete(user._id)}
                        color="inherit"
                        sx={{ marginLeft: "10px" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Paper>
    </>
  );
}
