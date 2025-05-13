import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './ActiveTours.css'

const ActiveTours = () => {
  const [groupedBookings, setGroupedBookings] = useState({})
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedPackageType, setSelectedPackageType] = useState(null)
  const [showCompleted, setShowCompleted] = useState(false)

  useEffect(() => {
    axios.get('http://localhost:8001/api/active-tours')
      .then(response => {
        setGroupedBookings(response.data)
      })
      .catch(error => {
        console.error('Error fetching active tour bookings:', error)
      })
  }, [])

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    return date.toLocaleDateString(undefined, options)
  }

  const calculateEndDate = (startDate, duration) => {
    const [days] = duration.match(/\d+/g)
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + parseInt(days))
    return endDate
  }

  const getCurrentDay = (startDate, duration) => {
    const [days] = duration.match(/\d+/g)
    const start = new Date(startDate)
    const now = new Date()
    const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24)) + 1
    const totalDays = parseInt(days)
    return diff > totalDays ? totalDays : diff
  }

  const getProgressPercentage = (startDate, duration) => {
    const [days] = duration.match(/\d+/g)
    const totalDays = parseInt(days)
    const currentDay = getCurrentDay(startDate, duration)
    return Math.min(100, Math.round((currentDay / totalDays) * 100))
  }

  const isCompleted = (startDate, duration) => {
    const endDate = calculateEndDate(startDate, duration)
    return new Date() > endDate
  }

  const renderTours = (tours) => (
    <div className="tour-list">
      {tours
        .filter(booking => showCompleted ? isCompleted(booking.tour_date, booking.package.duration) : !isCompleted(booking.tour_date, booking.package.duration))
        .map((booking) => {
          const endDate = calculateEndDate(booking.tour_date, booking.package.duration)
          const statusClass = isCompleted(booking.tour_date, booking.package.duration) ? 'completed' : 'active'
          const currentDay = getCurrentDay(booking.tour_date, booking.package.duration)
          const [totalDays] = booking.package.duration.match(/\d+/g)
          const progress = getProgressPercentage(booking.tour_date, booking.package.duration)

          return (
            <div className="tour-card" key={booking.id}>
              <img
                src={`http://localhost:8001/storage/${booking.package.pkg_image_path}`}
                alt={booking.package.package_name}
                className="tour-image"
              />
              <div className="tour-info">
                <h3>{booking.package.package_name}</h3>
                <span className={`badge ${statusClass}`}>
                  {statusClass.charAt(0).toUpperCase() + statusClass.slice(1)}
                </span>
                <p><strong>Start Date:</strong> {formatDate(booking.tour_date)}</p>
                <p><strong>End Date:</strong> {formatDate(endDate)}</p>
                <p><strong>Duration:</strong> {booking.package.duration}</p>
                <p><strong>Booked by:</strong> {booking.contact.first_name} {booking.contact.last_name}</p>
                <p><strong>Mobile No:</strong> {booking.contact.mobile_no}</p>
                {!isCompleted(booking.tour_date, booking.package.duration) && (
                  <>
                    <p><strong>Current Day:</strong> Day {currentDay} of {totalDays}</p>
                    <div className="progress-bar-container">
                      <div className="progress-bar" style={{ width: `${progress}%` }} />
                    </div>
                  </>
                )}
              </div>
            </div>
          )
        })}
    </div>
  )

  const handleCategoryClick = (category) => {
    setSelectedCategory(category)
    setSelectedPackageType(null)
  }

  const handlePackageTypeClick = (packageType) => {
    setSelectedPackageType(packageType)
  }

  return (
    <div className="active-tours-container">
      <div className="sidebar">
        <h3>Tour Categories</h3>
        <ul>
          {Object.keys(groupedBookings).map(group => {
            const [tourCategory] = group.split('-')
            return (
              <li
                key={tourCategory}
                onClick={() => handleCategoryClick(tourCategory)}
                className={selectedCategory === tourCategory ? 'active' : ''}
              >
                {tourCategory}
              </li>
            )
          })}
        </ul>
        <button
          className="toggle-btn"
          onClick={() => setShowCompleted(!showCompleted)}
        >
          {showCompleted ? 'Show Active Tours' : 'Show Completed Tours'}
        </button>
      </div>

      <div className="content">
        {selectedCategory && (
          <div className="package-types">
            <h3>{selectedCategory} Packages</h3>
            <ul>
              {Object.keys(groupedBookings).map(group => {
                const [tourCategory, packageType] = group.split('-')
                if (tourCategory === selectedCategory) {
                  return (
                    <li
                      key={packageType}
                      onClick={() => handlePackageTypeClick(packageType)}
                      className={selectedPackageType === packageType ? 'active' : ''}
                    >
                      {packageType}
                    </li>
                  )
                }
                return null
              })}
            </ul>
          </div>
        )}

        {selectedPackageType && (
          <div className="tour-details">
            <h3>
              {selectedCategory} - {selectedPackageType} {showCompleted ? 'Completed' : 'Active'} Bookings
            </h3>
            {renderTours(groupedBookings[`${selectedCategory}-${selectedPackageType}`])}
          </div>
        )}
      </div>
    </div>
  )
}

export default ActiveTours
