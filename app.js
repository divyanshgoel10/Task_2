function moveOption(fromId, toId) {
  const selectedOptions = $(`#${fromId} option:selected`);
  $(`#${toId}`).append(selectedOptions);

  // Updated the selectedFields array after moving options
  updateSelectedFields();
}

function updateSelectedFields() {
  const selectedFields = $("#selectedFields option")
    .map(function () {
      return $(this).val();
    })
    .get();

  // Updated the actual selectedFields array
  $("#selectedFields").val(selectedFields);
}

function displayDataPage() {
  // Getting selected fields
  const selectedFields = $("#selectedFields").val();

  // Checking if at least one field is selected
  if (!selectedFields || selectedFields.length === 0) {
    alert("Please select at least one field.");
    return;
  }

  // Fetching data based on selected fields
  getUploadedData((jsonData) => {
    if (!jsonData) {
      alert("Error fetching data. Please upload a valid file.");
      return;
    }

    const productList = Object.keys(jsonData.products).map((key) => ({
      id: key,
      ...jsonData.products[key],
    }));

    // Sorting by popularity in descending order
    productList.sort((a, b) => b.popularity - a.popularity);

    const tableHead = $("#productTable thead");
    const tableBody = $("#productTable tbody");
    tableHead.empty();
    tableBody.empty();

    // Adding table headers based on selected fields
    const headerRow = $("<tr>");
    selectedFields.forEach((field) => {
      headerRow.append(`<th>${field}</th>`);
    });
    tableHead.append(headerRow);

    // Populating table body with data
    productList.forEach((product) => {
      const row = $("<tr>");
      selectedFields.forEach((field) => {
        row.append(`<td>${product[field]}</td>`);
      });
      tableBody.append(row);
    });

    // Showing the table and hide other elements
    $(".container").hide();
    $("#productTable").show();
  });
}

function getUploadedData(callback) {
  const fileInput = document.getElementById("fileInput");
  if (fileInput.files.length > 0) {
    const fileReader = new FileReader();

    fileReader.onload = function (event) {
      try {
        const jsonData = JSON.parse(event.target.result);
        callback(jsonData);
      } catch (error) {
        console.error("Error parsing JSON data:", error);
        callback(null);
      }
    };

    fileReader.readAsText(fileInput.files[0]);
  } else {
    callback(null);
  }
}

// Updating available fields after reading the file
$("#fileInput").on("change", function () {
  const fileName = $(this).val().split("\\").pop();
  $("#fileName").text(fileName || "No file chosen");

  // If a file is chosen, parsing JSON data and populate available fields
  if (this.files.length > 0) {
    const fileReader = new FileReader();

    fileReader.onload = function (event) {
      try {
        const jsonData = JSON.parse(event.target.result);
        populateAvailableFields(jsonData);
      } catch (error) {
        console.error("Error parsing JSON data:", error);
      }
    };

    fileReader.readAsText(this.files[0]);
  }
});

function populateAvailableFields(jsonData) {
  const availableFieldsSelect = $("#availableFields");
  availableFieldsSelect.empty();

  if (jsonData && jsonData.products) {
    const attributes = Object.keys(
      jsonData.products[Object.keys(jsonData.products)[0]]
    );
    attributes.forEach((attribute) => {
      availableFieldsSelect.append(
        `<option value="${attribute}">${attribute}</option>`
      );
    });
  }
}
