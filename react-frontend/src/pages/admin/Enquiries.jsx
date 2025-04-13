import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Enquiries.css";

const Enquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8001/api/enquiries");
        setEnquiries(response.data);
      } catch (err) {
        console.error("Error fetching enquiries:", err);
        setError("Failed to load enquiries.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
  }, []);

  const handleStatusUpdate = async (id) => {
    try {
      await axios.put(`http://127.0.0.1:8001/api/enquiries/${id}/resolve`);
      setEnquiries((prev) =>
        prev.map((enquiry) =>
          enquiry.id === id
            ? {
                ...enquiry,
                status: { ...enquiry.status, status_name: "resolved" },
              }
            : enquiry
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const filteredEnquiries = enquiries.filter((enquiry) =>
    [enquiry.full_name, enquiry.email, enquiry.phone]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="enquiries-container">
      <h2 className="enquiries-title">All Enquiries</h2>

      <input
        type="text"
        className="enquiries-search"
        placeholder="Search by name, email, or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p className="enquiries-status">Loading enquiries...</p>
      ) : error ? (
        <p className="enquiries-error">{error}</p>
      ) : filteredEnquiries.length === 0 ? (
        <p className="enquiries-status">No enquiries found.</p>
      ) : (
        <div className="table-wrapper">
          <table className="enquiries-table">
            <thead>
              <tr>
                <th>S.N.</th>
                <th>Full Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Message</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnquiries.map((enquiry, index) => (
                <tr key={enquiry.id}>
                  <td>{index + 1}</td>
                  <td>{enquiry.full_name}</td>
                  <td>{enquiry.phone}</td>
                  <td>{enquiry.email}</td>
                  <td>{enquiry.message}</td>
                  <td>{enquiry.status?.status_name || "pending"}</td>
                  <td>{new Date(enquiry.created_at).toLocaleString()}</td>
                  <td>
                    {enquiry.status?.status_name === "resolved" ? (
                      <span style={{ color: "green", fontSize: "20px" }}>✔</span>
                    ) : (
                      <>
                        <button onClick={() => handleStatusUpdate(enquiry.id)}>
                          Mark Resolved
                        </button>
                        <span
                          style={{
                            color: "red",
                            marginLeft: "8px",
                            fontSize: "20px",
                          }}
                        >
                          ❌
                        </span>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Enquiries;
