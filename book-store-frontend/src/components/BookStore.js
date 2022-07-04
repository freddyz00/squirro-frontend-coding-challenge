import axios from "axios";
import React, { useEffect, useState } from "react";
import "./BookStore.css";

function BookStore({ store, data, setData }) {
  const [countryData, setCountryData] = useState({});
  const [rating, setRating] = useState(store.attributes.rating);

  // fetch the country data
  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        // get the country data from restcountries API
        const response = await axios.get(
          `https://restcountries.com/v3.1/alpha/${
            data.countries[store.relationships.countries.data.id].attributes
              .code
          }?fields=name,flags`
        );

        if (response.status === 200) {
          const { name, flags } = response.data;

          // set country name and flag image
          setCountryData({ name: name.common, flagImage: flags.svg });
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchCountryData();
  }, [data.countries, store.relationships.countries.data.id]);

  // set the rating according to user input and update the json:api server
  const updateRating = async (index) => {
    // update the rating in the data state from App.js
    setData({
      ...data,
      stores: data.stores.map((item) =>
        item.id === store.id
          ? {
              ...store,
              attributes: {
                ...store.attributes,
                rating: index + 1,
              },
            }
          : item
      ),
    });

    // create a patch request to update the rating in the json:api
    try {
      await axios.patch(
        `http://localhost:3001/stores/${store.id}`,
        {
          data: {
            ...store,
            attributes: {
              ...store.attributes,
              rating: index + 1,
            },
          },
        },
        {
          headers: {
            "Content-Type": "application/vnd.api+json",
            Accept: "application/vnd.api+json",
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="book-store">
      {/* top */}
      <div className="book-store__top">
        {/* image */}
        <img
          src={store.attributes.storeImage}
          className="book-store__image"
          alt={store.attributes.name}
        />
        {/* details */}
        <div className="book-store__details">
          {/* header */}
          <div className="book-store__header">
            {/* store name */}
            <h2>{store.attributes.name}</h2>
            {/* rating */}
            <div>
              {new Array(5).fill(0).map((_, index) => (
                <span
                  key={index}
                  className={`book-store__rating ${
                    index < rating && "book-store__rating--active"
                  }`}
                  onClick={() => updateRating(index)}
                  onMouseEnter={() => setRating(index + 1)}
                  onMouseLeave={() => setRating(store.attributes.rating)}
                >
                  &#9733; {/* star */}
                </span>
              ))}
            </div>
          </div>
          {/* best selling books */}
          <div className="book-store__books">
            {/* title */}
            <h3>Best-selling books</h3>
            {store.relationships.books ? (
              // sort the books by the number of copies sold and get the top 2
              store.relationships.books.data
                .sort(
                  (bookA, bookB) =>
                    data.books[bookB.id].attributes.copiesSold -
                    data.books[bookA.id].attributes.copiesSold
                )
                .slice(0, 2)
                .map((book) => (
                  <div className="book-store__book-info" key={book.id}>
                    <p>{data.books[book.id].attributes.name}</p>
                    <p>
                      {
                        data.authors[
                          data.books[book.id].relationships.author.data.id
                        ].attributes.fullName
                      }
                    </p>
                  </div>
                ))
            ) : (
              // if there are no books, display the following message
              <div className="book-store__book-info">
                <p>No Data Available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* bottom */}
      <div className="book-store__bottom">
        {/* establishment date and store website */}
        <p>
          <span>
            {new Date(store.attributes.establishmentDate)
              .toLocaleDateString("en-GB")
              .replaceAll("/", ".")}
          </span>
          <span> - </span>
          <span>{store.attributes.website}</span>
        </p>

        {/* country flag */}
        <img
          src={countryData.flagImage}
          alt={countryData.name}
          className="book-store__flag"
        />
      </div>
    </div>
  );
}

export default BookStore;
