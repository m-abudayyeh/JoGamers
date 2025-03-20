import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';

const UsersAdmin = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [updatedData, setUpdatedData] = useState({ username: "", email: "", role: "" });
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  // Fetch Users from Backend
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users");
      setUsers(response.data);
      setFilteredUsers(response.data); // Initialize with all users
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    filterUsers(e.target.value, roleFilter);
  };

  const handleRoleFilter = (e) => {
    setRoleFilter(e.target.value);
    filterUsers(searchQuery, e.target.value);
  };

  const filterUsers = (search, role) => {
    let filtered = users.filter(user => {
      const matchesSearch = user.username.toLowerCase().includes(search.toLowerCase()) ||
                            user.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = role ? user.role === role : true;
      return matchesSearch && matchesRole;
    });

    if (sortColumn) {
      filtered = filtered.sort((a, b) => {
        if (sortDirection === 'asc') {
          return a[sortColumn] > b[sortColumn] ? 1 : -1;
        } else {
          return a[sortColumn] < b[sortColumn] ? 1 : -1;
        }
      });
    }

    setFilteredUsers(filtered);
  };

  // Handle Update User
  const handleUpdateUser = async () => {
    try {
      await axios.put(`http://localhost:5000/api/users/${selectedUser._id}`, updatedData);
      Swal.fire("Updated!", "User updated successfully", "success");
      fetchUsers(); // Refresh list
      setModalOpen(false);
    } catch (error) {
      Swal.fire("Error", "Failed to update user", "error");
    }
  };

  // Handle Delete User
  const handleDeleteUser = (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/api/users/${userId}`);
          Swal.fire("Deleted!", "User has been deleted.", "success");
          fetchUsers(); // Refresh list
        } catch (error) {
          Swal.fire("Error", "Failed to delete user", "error");
        }
      }
    });
  };

  const openUpdateModal = (user) => {
    setSelectedUser(user); // Set the selected user
    setUpdatedData({
      username: user.username,
      email: user.email,
      role: user.role,
    }); // Set the updated data for the selected user
    setModalOpen(true); // Open the modal
  };

  // DataTable Columns
  const columns = [
    { name: "Username", selector: row => row.username, sortable: true },
    { name: "Email", selector: row => row.email, sortable: true },
    { name: "Role", selector: row => row.role, sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <button 
            onClick={() => openUpdateModal(row)}
            className="px-3 py-1 bg-[#497174] text-white rounded"
          >
            Update
          </button>
          <button 
            onClick={() => handleDeleteUser(row._id)}
            className="px-3 py-1 bg-[#EB6440] text-white rounded"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  // Sorting Functionality
  const handleSort = (column, direction) => {
    setSortColumn(column.selector);
    setSortDirection(direction);
    filterUsers(searchQuery, roleFilter); // Reapply filters and sorting
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EFF5F5] to-[#D6E4E5] p-6">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#497174]">Users Management</h1>
            <p className="text-[#497174] mt-1">View and manage user accounts</p>
          </div>
          <button 
            className="px-4 py-2 bg-[#497174] hover:bg-[#497174] text-white rounded-lg shadow flex items-center gap-2 transition-colors"
            onClick={() => {/* Add new user function */}}
          >
            <span className="text-lg">+</span>
            <span>Add User</span>
          </button>
        </div>
      </header>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search users..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#497174] focus:border-transparent"
                value={searchQuery}
                onChange={handleSearch}
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                🔍
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <select 
              value={roleFilter}
              onChange={handleRoleFilter}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#497174] focus:border-transparent"
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="publisher">Publisher</option>
              <option value="admin">Admin</option>
            </select>
            <select 
              onChange={(e) => handleSort(e.target.value, sortDirection)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#497174] focus:border-transparent"
            >
              <option value="">Sort By</option>
              <option value="username">Username</option>
              <option value="email">Email</option>
              <option value="created">Date Created</option>
            </select>
          </div>
        </div>
      </div>

      {/* DataTable with enhanced styling */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <DataTable 
          columns={columns} 
          data={filteredUsers} 
          pagination 
          highlightOnHover 
          persistTableHead
          customStyles={{
            headRow: {
              style: {
                backgroundColor: '#f9fafb',
                borderBottomWidth: '1px',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                textTransform: 'uppercase',
              },
            },
            rows: {
              style: {
                minHeight: '60px',
                fontSize: '0.875rem',
              },
              highlightOnHoverStyle: {
                backgroundColor: 'rgba(249, 250, 251, 1)',
              },
            },
            pagination: {
              style: {
                borderTopWidth: '1px',
                borderColor: '#e5e7eb',
              },
              pageButtonsStyle: {
                borderRadius: '0.375rem',
                height: '32px',
                width: '32px',
                margin: '0 4px',
              },
            },
          }}
        />
      </div>

      {/* Enhanced Modal for Updating User */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#497174]">Update User</h2>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#497174] mb-1">Username</label>
                <input 
                  type="text" 
                  value={updatedData.username} 
                  onChange={(e) => setUpdatedData({ ...updatedData, username: e.target.value })} 
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#497174] focus:border-transparent"
                />
              </div>
              
            
              <div>
                <label className="block text-sm font-medium text-[#497174] mb-1">Role</label>
                <select 
                  value={updatedData.role} 
                  onChange={(e) => setUpdatedData({ ...updatedData, role: e.target.value })} 
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#497174] focus:border-transparent"
                >
                  <option value="user">User</option>
                  <option value="publisher">Publisher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex items-center mt-2">
                <input 
                  type="checkbox" 
                  id="active" 
                  className="h-4 w-4 text-[#497174] focus:ring-[#497174] border-gray-300 rounded"
                />
                <label htmlFor="active" className="ml-2 block text-sm text-[#497174]">
                  Active Account
                </label>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setModalOpen(false)} 
                className="px-4 py-2 border border-gray-300 text-[#497174] rounded-lg hover:bg-[#D6E4E5] transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateUser} 
                className="px-4 py-2 bg-[#497174] text-white rounded-lg hover:bg-[#497174] transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersAdmin;
