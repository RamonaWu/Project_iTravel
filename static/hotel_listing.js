
// // function to get destination id and type
// async function getDestIdAndType(location) {
//   const response = await $.ajax({
//     method: 'GET',
//     url: `https://booking-com.p.rapidapi.com/v1/hotels/locations?name=${location}&locale=en-gb`,
//     // params: {
//     //   name: location,
//     //   locale: 'en-us'
//     // },
//     headers: {
//       'X-RapidAPI-Key': '19b6124d90mshf961d8517b1731dp1808aajsn520c6a388dd5',
// 		  'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
//     }
//   });

//   const dest_id = response[0].dest_id;
//   const dest_type = response[0].dest_type;

//   return {dest_id, dest_type};
// }

// // function to get hotel listings
// async function getHotelListings(location, checkInDate, checkOutDate, adults, children, rooms) {
//   const {dest_id, dest_type} = await getDestIdAndType(location);
//   const options = {
//     method: 'GET',
//     url: 'https://booking-com.p.rapidapi.com/v1/hotels/search',
//     params: {
//       checkin_date: checkInDate,
//       dest_type: dest_type,
//       units: 'metric',
//       checkout_date: checkOutDate,
//       adults_number: adults,
//       order_by: 'popularity',
//       dest_id: dest_id,
//       filter_by_currency: 'USD',
//       locale: 'en-gb',
//       room_number: rooms,
//       children_number: children,
//     },
//     headers: {
//       'X-RapidAPI-Key': '19b6124d90mshf961d8517b1731dp1808aajsn520c6a388dd5',
//       'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
//     }
//   };

//   const response = await axios.request(options);

//   console.log("search hotel", response)

//   return response.data.result.map(result => {
//     const {
//       hotel_id, 
//       hotel_name, 
//       main_photo_url, 
//       address, 
//       city, 
//       review_score, 
//       min_total_price, 
//       unit_configuration_label, 
//       url,
//       currency_code
//     } = result;

//     return {
//       hotel_id: hotel_id,
//       hotel_name: hotel_name,
//       hotel_photo: main_photo_url,
//       hotel_address: address,
//       hotel_city: city,
//       hotel_review_score: review_score,
//       hotel_price: min_total_price,
//       hotel_room: unit_configuration_label,
//       hotel_url: url,  // detail for specific hotel
//       currency_code: currency_code
//     }
//   });
// }


// async function fillHotelDataToForm(location, checkInDate, checkOutDate, adults, children, rooms) {

//   const listings = await getHotelListings(location, checkInDate, checkOutDate, adults, children, rooms);
//   console.log("listings", listings)

//   listings.forEach((listing, index) => {

//     console.log("listing", listing)

//     const hotel_id = listing.hotel_id;
//     const hotel_name = listing.hotel_name;
//     const hotel_photo = listing.hotel_photo;
//     const hotel_address = listing.hotel_address;
//     const hotel_city = listing.hotel_city;
//     const hotel_review_score = listing.hotel_review_score;
//     const hotel_price = listing.hotel_price;
//     const hotel_room = listing.hotel_room;
//     const hotel_url = listing.hotel_url;
//     const currency_code = listing.currency_code;

//     const hotelNameField = $(`#hotel_name${index}`);
//     const hotelPhotoField = $(`#hotel_photo${index}`);
//     const hotelAddressField = $(`#hotel_address${index}`);
//     const hotelCityField = $(`#hotel_city${index}`);
//     const hotelReviewScoreField = $(`#hotel_review_score${index}`);
//     const hotelPriceField = $(`#hotel_price${index}`);
//     const currencyCodeField = $(`#currency_code${index}`);
//     const hotelRoomField = $(`#hotel_room${index}`);
//     const hotelUrlField = $(`#hotel_url${index}`);

//     hotelNameField.text(hotel_name);
//     hotelPhotoField.attr('src', hotel_photo);
//     hotelAddressField.text(hotel_address);
//     hotelCityField.text(hotel_city);
//     hotelReviewScoreField.text(`Review Score: ${hotel_review_score}`);
//     hotelPriceField.text(`Price: ${hotel_price}${currency_code}`);
//     currencyCodeField.text(currency_code);
//     hotelRoomField.text(`Room: ${hotel_room}`);
//     hotelUrlField.attr('href', hotel_url);
//   });
// }

// $(document).ready(function() {

//   $("#search-form").submit(function (evt) {
//     evt.preventDefault(); 
//     console.log("search form submitted test")

//     const location = $("#location").val();
//     const checkInDate = $("#check-in").val();
//     const checkOutDate = $("#check-out").val();
//     const adults = $("#adults").val();
//     const children = $("#children").val();
//     const rooms = $("#rooms").val();

//     fillHotelDataToForm(location, checkInDate, checkOutDate, adults, children, rooms);
//   });
// });



// $("#search-form").submit(async function (evt) {
//   evt.preventDefault();
//   console.log("search button test")
//   await fillHotelDataToForm();
// });


// // function to create listing elements
// function createListingElements(listings) {
//   const $propertyCard = $("#property_card");

//   listings.forEach(listing => {
//     const { 
//       hotel_name, 
//       hotel_photo, 
//       hotel_address, 
//       hotel_review_score, 
//       hotel_url, 
//       hotel_room, 
//       hotel_price, 
//       currency_code 
//     } = listing;

//     console.log("hotel_name", hotel_name)

//     const $listingElement = $(
//       `<div class="card-body">
//         <div id="hotel_image">
//           <a href="${hotel_url}">
//             <img src="${hotel_photo}" alt="${hotel_name}">
//           </a>
//         </div>
//         <div id="hotel_content">
//           <div id="hotel_title">
//             <div>
//               <h2>${hotel_name}</h2>
//               <p>${hotel_address}</p>
//             </div>
//             <div>
//               <p>Rating: ${hotel_review_score} reviews</p>
//             </div>
//           </div>
  
//           <div id="hotel_description">
//             <div>
//               <p>${hotel_room}</p>
//             </div>
//             <div>
//               <p>Price: ${hotel_price} ${currency_code}</p>
//               <a href="${hotel_url}">
//                 <span>See availability</span>
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>
//     `);
      
//     $propertyCard.append($listingElement);
//   });

//   console.log("listings", listings)
// }


// // function to handle form submission: get hotel from api and display
// async function handleDisplay() {
//   const location = $("#location").val();
//   const checkInDate = $("#check-in").val();
//   const checkOutDate = $("#check-out").val();
//   const adults = $("#adults").val();
//   const children = $("#children").val();
//   const rooms = $("#rooms").val();

//   const listings = await getHotelListings(location, checkInDate, checkOutDate, adults, children, rooms);
//   console.log("listings", listings)
//   createListingElements(listings)
// }

// // function to handle form submission
// $("#search-form").submit(async function (evt) {
//   evt.preventDefault();
//   console.log("search button test")
//   await handleDisplay();
// });