import React, { useState, useEffect } from "react";
import { FaEdit, FaSave, FaTrash } from "react-icons/fa";
import {
  AdminGetALlUsers,
  AdminChangeUser,
  AdminRemoveCertainUser,
} from "../../endpoints/AdminEndpoint";

function Users() {
  const userTypeLabels = {
    admin: "Administrator",
    student: "Student",
    teacherTA: "Teaching Assistant",
    teacherDoctor: "Professor",
  };

  const [users, setUsers] = useState([]);
  const [editableRow, setEditableRow] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await AdminGetALlUsers();
        setUsers(data.result.recordset);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  const toggleEdit = (userId) => {
    setEditableRow(userId === editableRow ? null : userId);
  };

  const handleInputChange = (userId, field, value) => {
    const updatedUsers = users.map((user) =>
      user.UserId === userId ? { ...user, [field]: value } : user
    );
    setUsers(updatedUsers);
  };

  const handleSave = async (userId) => {
    const updatedUser = users.find((user) => user.UserId === userId);

    try {
      setSaving(true);
      await AdminChangeUser(updatedUser);
      console.log("User updated successfully:", updatedUser);
      setEditableRow(null);
    } catch (err) {
      console.error("Error updating user:", err);
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = async (userId) => {
    try {
      setDeleting(userId);
      await AdminRemoveCertainUser(userId);
      console.log(`User with ID ${userId} removed successfully.`);
      const updatedUsers = users.filter((user) => user.UserId !== userId);
      setUsers(updatedUsers);
    } catch (err) {
      console.error(`Error removing user with ID ${userId}:`, err);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="p-6 bg-base-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Users</h1>
      <div className="overflow-x-auto">
        <table className="table w-full table-zebra">
          <thead className="bg-base-200">
            <tr>
              <th className="text-center">Actions</th>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created At</th>
              <th>Updated At</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.UserId}>
                <td className="flex items-center justify-center space-x-2">
                  <button
                    onClick={() =>
                      editableRow === user.UserId
                        ? handleSave(user.UserId)
                        : toggleEdit(user.UserId)
                    }
                    className={`btn btn-sm ${
                      editableRow === user.UserId
                        ? "btn-primary"
                        : "btn-success"
                    }`}
                    disabled={saving && editableRow === user.UserId}
                  >
                    {editableRow === user.UserId ? (
                      <FaSave className="text-white" />
                    ) : (
                      <FaEdit className="text-white" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteUser(user.UserId)}
                    className="btn btn-sm btn-error"
                    disabled={deleting === user.UserId}
                  >
                    {deleting === user.UserId ? (
                      <span className="loading loading-spinner text-white" />
                    ) : (
                      <FaTrash className="text-white" />
                    )}
                  </button>
                </td>
                <td>{user.UserId}</td>
                <td>
                  {editableRow === user.UserId ? (
                    <input
                      type="text"
                      value={user.Name}
                      onChange={(e) =>
                        handleInputChange(user.UserId, "Name", e.target.value)
                      }
                      className="input input-bordered input-sm w-full"
                    />
                  ) : (
                    user.Name
                  )}
                </td>
                <td>
                  {editableRow === user.UserId ? (
                    <input
                      type="email"
                      value={user.Email}
                      onChange={(e) =>
                        handleInputChange(user.UserId, "Email", e.target.value)
                      }
                      className="input input-bordered input-sm w-full"
                    />
                  ) : (
                    user.Email
                  )}
                </td>
                <td>
                  {editableRow === user.UserId ? (
                    <select
                      value={user.UserType}
                      onChange={(e) =>
                        handleInputChange(
                          user.UserId,
                          "UserType",
                          e.target.value
                        )
                      }
                      className="select select-bordered select-sm w-full"
                    >
                      {Object.entries(userTypeLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    userTypeLabels[user.UserType] || user.UserType
                  )}
                </td>
                <td>{user.CreatedAt}</td>
                <td>{user.UpdatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;
