export const normalizeJSONAPI = (response) => {
  // normalize the json:api response
  if (response.errors) {
    return response;
  }

  const normalizedData = {};

  // get the data inside the included field
  response.included.forEach((item) => {
    if (!normalizedData[item.type]) {
      normalizedData[item.type] = {};
    }
    normalizedData[item.type][item.id] = item;
  });

  // get the data inside the data field
  response.data.forEach((item) => {
    if (!normalizedData[item.type]) {
      normalizedData[item.type] = [];
    }
    normalizedData[item.type].push(item);
  });

  return normalizedData;
};

/* ORIGINAL DATA
{
  data: [
    {
      type: "stores",
      id: "1",
      attributes: {
        name: "SquirroBooks",
      },
      relationships: {
        books: {
          data: [
            {
              type: "books",
              id: "1",
            },
          ],
        },
      },
    },
  ],
  included: [
    {
      type: "books",
      id: "1",
      attributes: {
        name: "JavaScript: The Good Parts",
      },
    },
  ],
}
*/

/*  AFTER NORMALIZING
{
  stores: [
    {
      type: "stores",
      id: "1",
      attributes: {
        name: "SquirroBooks",
      },
      relationships: {
        books: {
          data: [
            {
              type: "books",
              id: "1",
            },
          ],
        },
      },
    },
  ],
  books: {
    1: {
      type: "books",
      id: "1",
      attributes: {
        name: "JavaScript: The Good Parts",
      },
    },
  },
}
*/
