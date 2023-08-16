import requests

class HotelListingFetcher:

    def __init__(self):

        self.headers = {
            'X-RapidAPI-Key': '19b6124d90mshf961d8517b1731dp1808aajsn520c6a388dd5',
		    'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
        }

        
    def getDestIdAndType(self, location):
        print("Inside getDestIdAndType")
        url = "https://booking-com.p.rapidapi.com/v1/hotels/locations"
        params = {
            'name': location,
            'locale': 'en-gb'
        }
        response = requests.get(url, headers=self.headers, params=params)
        data = response.json()
        dest_id = int(data[0]['dest_id'])
        dest_type = data[0]['dest_type']

        print(dest_id, dest_type)
        return dest_id, dest_type
    
        
    def getHotelListings(self, location, check_in, check_out, adults, children, rooms):
        print("Inside getHotelListings")
        dest_id, dest_type = self.getDestIdAndType(location)
        url = "https://booking-com.p.rapidapi.com/v1/hotels/search"
        params = {
            'checkin_date': check_in,
            'dest_type': dest_type,
            'units': 'metric',
            'checkout_date': check_out,
            'adults_number': adults,
            'order_by': 'popularity',
            'dest_id': dest_id,
            'filter_by_currency': 'USD',
            'locale': 'en-gb',
            'room_number': rooms,
            'children_number': children,
        }

        response = requests.get(url, headers=self.headers, params=params)
        data = response.json()

        print("Data from API:", data)

        hotel_listings = []
        for result in data['result']:
            hotel = {
                'hotel_id': result['hotel_id'],
                'hotel_name': result['hotel_name'],
                'hotel_photo': result['main_photo_url'],
                'hotel_address': result['address'],
                'hotel_city': result['city'],
                'hotel_review_score': result['review_score'],
                'hotel_price': result['min_total_price'],
                'hotel_room': result['unit_configuration_label'],
                'hotel_url': result['url'],
                'currency_code': result['currency_code']
            }
            hotel_listings.append(hotel)
        
        print(hotel_listings)

        return hotel_listings