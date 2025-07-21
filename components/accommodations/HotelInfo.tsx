export default function HotelInfo() {
  const hotelInfo = {
    name: 'Caesars Southern Indiana',
    address: '11999 Casino Center Drive, Elizabeth, IN 47117',
    phone: '(812) 969-5000',
    checkIn: '4:00 PM',
    checkOut: '11:00 AM',
    mapLink: 'https://maps.google.com/?q=Caesars+Southern+Indiana'
  }

  return (
    <div className="bg-white rounded-lg shadow border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Hotel Information</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-900">{hotelInfo.name}</h4>
          <p className="text-gray-600">{hotelInfo.address}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Check-in/Check-out</h5>
            <div className="space-y-1 text-sm text-gray-600">
              <p>🕐 Check-in: {hotelInfo.checkIn}</p>
              <p>🕐 Check-out: {hotelInfo.checkOut}</p>
            </div>
          </div>
          
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Contact</h5>
            <div className="space-y-1">
              <a 
                href={`tel:${hotelInfo.phone}`}
                className="flex items-center text-sm text-primary-600 hover:text-primary-700"
              >
                <span className="mr-2">📞</span>
                {hotelInfo.phone}
              </a>
              <a
                href={hotelInfo.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-primary-600 hover:text-primary-700"
              >
                <span className="mr-2">🗺️</span>
                Get Directions
              </a>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <h5 className="font-medium text-gray-900 mb-2">Important Notes</h5>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Valid photo ID and credit card required at check-in</li>
            <li>• Parking is complimentary for hotel guests</li>
            <li>• Casino floor is 21+ only</li>
            <li>• Room service available 24/7</li>
            <li>• Free WiFi throughout the property</li>
          </ul>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <h5 className="font-medium text-gray-900 mb-2">Amenities</h5>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
            <div className="flex items-center">
              <span className="mr-2">🏊‍♂️</span>
              <span>Pool & Spa</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">🏋️‍♂️</span>
              <span>Fitness Center</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">🍽️</span>
              <span>Multiple Restaurants</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">🎰</span>
              <span>Casino</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}