
// function to get hotels photo and description by specific hotel id

async function getHotelPhotosAndDescription(location, checkInDate, checkOutDate, adults, children, rooms) {
    const hotelListings  = await getHotelListings(location, checkInDate, checkOutDate, adults, children, rooms)

    const hotelPhotosAndDescriptionPromises = hotelListings.map(async (hotel) => {
        const hotel_id = hotel.hotel_id;
        const photosResponse  = await axios({
            method: 'GET',
            url: 'https://booking-com.p.rapidapi.com/v1/hotels/photos',
            params: {
              hotel_id: hotel_id,
              locale: 'en-us'
            },
            headers: {
              'X-RapidAPI-Key': '19b6124d90mshf961d8517b1731dp1808aajsn520c6a388dd5',
              'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
            }
        });

        const descriptionResponse = await axios({
            method: 'GET',
            url: 'https://booking-com.p.rapidapi.com/v1/hotels/description',
            params: {
                hotel_id: hotel_id,
                locale: 'en-gb',
            },
            headers: {
                'X-RapidAPI-Key': '19b6124d90mshf961d8517b1731dp1808aajsn520c6a388dd5',
                'X-RapidAPI-Host': 'booking-com.p.rapidapi.com',
            },
        });

        const photoUrls = photosResponse.data.map((photo) => photo.url_1440);
        const description = descriptionResponse.description;

        return {
            hotel_photos: photoUrls,
            hotel_description: description,
        };
        
    });

    const hotelPhotosAndDescription = await Promise.all(hotelPhotosAndDescriptionPromises);
    return hotelPhotosAndDescription;
}



// function to get room availability by specific hotel
async function getRoomAvailability(checkInDate, checkOutDate, adults, children) {
    const hotelListings  = await getHotelListings(location, checkInDate, checkOutDate, adults, children, rooms)

    const roomAvailabilityPromises = hotelListings.map(async (hotel) => {
        const hotel_id = hotel.hotel_id;
        const response = await axios ({
            method: 'GET',
            url: 'https://booking-com.p.rapidapi.com/v1/hotels/room-list',
            params: {
            hotel_id: hotel_id,
            currency: 'USD',
            checkout_date: checkInDate,
            locale: 'en-us',
            checkin_date: checkOutDate,
            adults_number_by_rooms: adults,
            children_number_by_rooms: children,
            units: 'metric',
            },
            headers: {
            'X-RapidAPI-Key': '19b6124d90mshf961d8517b1731dp1808aajsn520c6a388dd5',
            'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
            }
        });

        const roomAvailability = response.data.rooms.map((room) => {
            const { highlights, bed_configurations, photos, facilities} = room;

            return {
                room_highlights: highlights,
                room_type: bed_configurations,
                room_photo: photos,
                room_description: facilities,
            };
        });

        return roomAvailability;

    });

    const roomList = await Promise.all(roomAvailabilityPromises);
    return roomList;

}

// function to display hotel photos and description
function displayHotelPhotosAndDescription(hotelPhotosAndDescription) {
    hotelPhotosAndDescription.forEach((hotel) => {
        const photosContainer = $('<div></div>');
        hotel.hotel_photos.forEach((photoUrl) => {
            const photoImg = $('<img>').attr('src', photoUrl);
            photosContainer.append(photoImg);
        });
        $('#hotel-photos').append(photosContainer);

        const descriptionParagraph = $('<p></p>').text(hotel.hotel_description);
        $('#hotel-description').append(descriptionParagraph);
    });
}

// function to display room list
function displayRoomList(roomList) {
    const roomListElement = $('#room-list');
    roomList.forEach((rooms) => {
        rooms.forEach((room) => {
            const roomElement = $('<div></div>');
            const highlights = $('<p></p>').text(room.room_highlights);
            roomElement.append(highlights);

            const roomType = $('<p></p>').text(room.room_type);
            roomElement.append(roomType);

            const roomPhoto = $('<img>').attr('src', room.room_photo);
            roomElement.append(roomPhoto);

            const roomDescription = $('<p></p>').text(room.room_description);
            roomElement.append(roomDescription);

            roomListElement.append(roomElement);
        });
    });
}


// Retrieve hotel details from getHotelListings and populate the form fields
// async function getHotelDetails() {
//     const location = $("#location").val();
//     const checkInDate = $("#check-in").val();
//     const checkOutDate = $("#check-out").val();
//     const adults = $("#adults").val();
//     const children = $("#children").val();
//     const rooms = $("#rooms").val();

//     const hotelListings = await getHotelListings(location, checkInDate, checkOutDate, adults, children, rooms);
//     const hotel = hotelListings[0];
//     console.log(hotel,"hotel")
//     $('#hotel-name').val(hotel.hotel_name);
//     $('#start_date').val(checkInDate);
//     $('#end_date').val(checkOutDate);
//     $('#price').val(hotel.hotel_price);
// }

// Move the function call here to ensure variables are defined before calling displayHotelData
// getHotelDetails(); 

// function to display hotel photos and description, and room list
async function displayHotelData() {

    const location = $("#location").val();
    const checkInDate = $("#check-in").val();
    const checkOutDate = $("#check-out").val();
    const adults = $("#adults").val();
    const children = $("#children").val();
    const rooms = $("#rooms").val();

    const hotelPhotosAndDescription = await getHotelPhotosAndDescription(
        location,
        checkInDate,
        checkOutDate,
        adults,
        children,
        rooms
    );
    const roomList = await getRoomAvailability(
        checkInDate,
        checkOutDate,
        adults,
        children
    );

    displayHotelPhotosAndDescription(hotelPhotosAndDescription);
    displayRoomList(roomList);
}

// Call the displayHotelData function when the form is submitted
$("#hotel-detail").click(function (event) {
    event.preventDefault();
    console.log("test hotel-detail")
    displayHotelData();
  });
