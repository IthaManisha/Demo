const URL="https://crudcrud.com/api/989b78a480c94c438d1a9e1419d230d4/candy"
    async function handleSubmit() {
      const candyName = document.getElementById("candyName").value;
      const description = document.getElementById("description").value;
      const price = parseFloat(document.getElementById("price").value);
      const quantity = parseInt(document.getElementById("quantity").value);

      const candyObj = {
        candyName,
        description,
        price,
        quantity,
      };

      try {
        // Send the candy data to the backend using POST request
        const response = await axios.post(URL, candyObj);

        // Clear the form fields after successful submission
        document.getElementById("candyForm").reset();

        // Show the newly added candy on the screen
        showOnScreen(response.data);
      } catch (error) {
        console.error("Error creating candy item:", error);
      }
    }

    function showOnScreen(candyObj) {
      const parentElem = document.getElementById("candyList");
      const childElem = document.createElement("li");
      childElem.setAttribute("data-id", candyObj._id);
      childElem.innerHTML = `
        <strong>${candyObj.candyName}</strong> - ${candyObj.description} | Price: $${candyObj.price} | Quantity: ${candyObj.quantity}
        <button onclick="buyItem('${candyObj._id}', 1)">Buy One</button>
        <button onclick="buyItem('${candyObj._id}', 2)">Buy Two</button>
        <button onclick="buyItem('${candyObj._id}', 3)">Buy Three</button>`;
      parentElem.appendChild(childElem);
    }

    async function buyItem(id, quantityToBuy) {
      try {
        // Send a GET request to fetch the candy data
        let response = await axios.get(`${URL}/${id}`);
        let candyObj = response.data;
        console.log(candyObj);
        // Decrease the quantity based on the quantityToBuy parameter
        candyObj.quantity=candyObj.quantity-quantityToBuy;

        // Send a PUT request to update the candy quantity on the backend
        
          await axios({
            method: "put",
            url: `${URL}/${id}`,
            data: {candyName:candyObj.candyName,
                description:candyObj.description,
                price:candyObj.price,
                quantity: candyObj.quantity},
          });
          let updatedResponse = await axios.get(`${URL}/${id}`);
          
          
        console.log("Updated Response from Backend:", updatedResponse.data);
        // Update the display on the screen
        const candyElem = document.querySelector(`#candyList li[data-id="${id}"]`);
        candyElem.innerHTML = `
          <strong>${candyObj.candyName}</strong> - ${candyObj.description} | Price: ${candyObj.price} | Quantity: ${candyObj.quantity}
          <button onclick="buyItem('${candyObj._id}', 1)">Buy One</button>
          <button onclick="buyItem('${candyObj._id}', 2)">Buy Two</button>
          <button onclick="buyItem('${candyObj._id}', 3)">Buy Three</button>`;

        // Remove the candy from the list if its quantity is zero
        if (candyObj.quantity === 0) {
          candyElem.remove();
        }
      } catch (error) {
        console.error("Error updating candy item:", error);
      }
    }

    // Display the existing candies on page load
    async function fetchCandies() {
      try {
        const response = await axios.get(`${URL}`);
        const candies = response.data;
        candies.forEach(candy => showOnScreen(candy));
      } catch (error) {
        console.error("Error fetching candy items:", error.response.data);
      }
    }

    fetchCandies();

