import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile_no: ''
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch all users
    axios.get('http://localhost:8001/api/users')
      .then((response) => {
        setUsers(response.data);
        setFilteredUsers(response.data); // Initially show all users
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);

  // Handle search query input and filter users
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    const filtered = users.filter(user =>
      `${user.contact.first_name} ${user.contact.last_name}`.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleEdit = (user) => {
    setEditingUser(user.id);
    setUserData({
      first_name: user.contact.first_name,
      last_name: user.contact.last_name,
      email: user.contact.email,
      mobile_no: user.contact.mobile_no,
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      axios.delete(`http://localhost:8001/api/users/${id}`)
        .then((response) => {
          setUsers(users.filter((user) => user.id !== id));
          setFilteredUsers(filteredUsers.filter((user) => user.id !== id));
          alert('User deleted successfully');
        })
        .catch((error) => {
          console.error('Error deleting user:', error);
        });
    }
  };

  const handleUpdate = () => {
    if (!editingUser) return;

    axios.put(`http://localhost:8001/api/users/${editingUser}`, {
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      mobile_no: userData.mobile_no,
    })
      .then((response) => {
        setUsers(
          users.map((user) =>
            user.id === editingUser ? { ...user, contact: { ...user.contact, ...userData } } : user
          )
        );
        setFilteredUsers(
          filteredUsers.map((user) =>
            user.id === editingUser ? { ...user, contact: { ...user.contact, ...userData } } : user
          )
        );
        setEditingUser(null);
        alert('User updated successfully');
      })
      .catch((error) => {
        console.error('Error updating user:', error);
      });
  };

  return (
    <div className="container">
      <h2 className="title">Manage Users</h2>

      {/* Search Input */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* User List Table */}
      <table className="user-table">
        <thead>
          <tr>
            <th>S.N.</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Mobile No</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.contact.first_name} {user.contact.last_name}</td>
              <td>{user.contact.email}</td>
              <td>{user.contact.mobile_no}</td>
              <td>
                <button onClick={() => handleEdit(user)} className="edit-button">Edit</button>
                <button onClick={() => handleDelete(user.id)} className="delete-button">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit User</h3>
            <div className="input-group">
              <label>First Name</label>
              <input
                type="text"
                value={userData.first_name}
                onChange={(e) => setUserData({ ...userData, first_name: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label>Last Name</label>
              <input
                type="text"
                value={userData.last_name}
                onChange={(e) => setUserData({ ...userData, last_name: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label>Mobile No</label>
              <input
                type="text"
                value={userData.mobile_no}
                onChange={(e) => setUserData({ ...userData, mobile_no: e.target.value })}
              />
            </div>
            <div className="modal-actions">
              <button onClick={handleUpdate} className="save-button">Save</button>
              <button onClick={() => setEditingUser(null)} className="cancel-button">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
