$(document).ready(function() {
  var adminUsername = localStorage.getItem('username');
  var adminEmail = localStorage.getItem('userEmail');
  var adminID = localStorage.getItem('userID');

  // Update the admin details on the home page
  $('#adminUsername').text(adminUsername);
  $('#adminEmail').text(adminEmail);
  $('#adminID').text(adminID);
});
function logout() {
  // Clear the local storage
  localStorage.clear();
  window.location.href = "../html/login.html";
}

function showHome() {
    document.getElementById('homePage').style.display = 'block';
    document.getElementById('manageUsersPage').style.display = 'none';
    document.getElementById('allBooksPage').style.display = 'none';
    document.getElementById('issueReturnRequestsPage').style.display = 'none';
    document.getElementById('currentlyIssuedBooksPage').style.display = 'none';
    console.log(localStorage.getItem('adminUsername'));
  }

  function showManageUsers() {
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('manageUsersPage').style.display = 'block';
    document.getElementById('allBooksPage').style.display = 'none';
    document.getElementById('issueReturnRequestsPage').style.display = 'none';
    document.getElementById('currentlyIssuedBooksPage').style.display = 'none';
  
    // Fetch and display the user data
    fetchUsers();
  }

  function showAllBooks() {
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('manageUsersPage').style.display = 'none';
    document.getElementById('allBooksPage').style.display = 'block';
    document.getElementById('issueReturnRequestsPage').style.display = 'none';
    document.getElementById('currentlyIssuedBooksPage').style.display = 'none';
  
    // Fetch the updated book data from the server
    fetchBooks();
  }
  

  function showIssueReturnRequests() {
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('manageUsersPage').style.display = 'none';
    document.getElementById('allBooksPage').style.display = 'none';
    document.getElementById('issueReturnRequestsPage').style.display = 'block';
    document.getElementById('currentlyIssuedBooksPage').style.display = 'none';
  }

  function showCurrentlyIssuedBooks() {
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('manageUsersPage').style.display = 'none';
    document.getElementById('allBooksPage').style.display = 'none';
    document.getElementById('issueReturnRequestsPage').style.display = 'none';
    document.getElementById('currentlyIssuedBooksPage').style.display = 'block';
  
    // Fetch and display the currently issued books data
    fetchCurrentlyIssuedBooks();
  }

  function addUser() {
    var userId = document.getElementById('newUserId').value;
    var userName = document.getElementById('newUserName').value;
    var userEmail = document.getElementById('newUserEmail').value;
    var userRegistrationYear = document.getElementById('newUserRegistrationYear').value;

    var table = document.getElementById('userList');
    var row = table.insertRow(-1);

    row.innerHTML = `
      <td>${userId}</td>
      <td>${userName}</td>
      <td>${userEmail}</td>
      <td>${userRegistrationYear}</td>
    `;
  }

  function deleteUser(userId) {
    var table = document.getElementById('userList');
    var rows = table.getElementsByTagName('tr');

    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var currentUserId = row.getElementsByTagName('td')[0].innerHTML;

      if (currentUserId === userId) {
        table.deleteRow(i);
        break;
      }
    }
  }
  function updateBookList(books) {
    const bookListBody = document.getElementById('bookListBody');
    bookListBody.innerHTML = '';
    console.log(books.length);
    if (books.length === 0) {
      console.log("Check");
      const row = document.createElement('tr');
      const errorCell = document.createElement('td');
      errorCell.colSpan = 5;
      errorCell.textContent = 'No books found.';
      row.appendChild(errorCell);
      bookListBody.appendChild(row);
    } else {
      books.forEach(book => {
        const row = document.createElement('tr');
        row.classList.add('table-row');
        row.innerHTML = `
          <td>${book.bookId}</td>
          <td>${book.bookName}</td>
          <td>${book.author}</td>
          <td>${book.publishYear}</td>
        `;
  
        bookListBody.appendChild(row);
      });
    }
  }
  
function fetchBooks() {
  // Make an AJAX request to the server
  fetch('../php/fetch_books.php')
    .then(response => response.json())
    .then(data => {
      
      // Check if data is empty or not
      if (data.length === 0) {
        console.log('No books found.'); // Display a message if no books are retrieved.
        updateBookList(data);
      } else {
        // Call a function to update the book list table with the retrieved data
        updateBookList(data);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}
function fetchUsers() {
  fetch('../php/fetch_users.php')
    .then(response => response.json())
    .then(data => {

      if (data.length === 0) {
        console.log('No users found.'); // Display a message if no users are retrieved
        updateUserList(data);
      } else {
        // Call a function to update the user list table with the retrieved data
        updateUserList(data);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}




function updateUserList(users) {
  const userListBody = document.getElementById('userListBody');
  userListBody.innerHTML = '';

  if (users.length === 0) {
    const row = document.createElement('tr');
    const errorCell = document.createElement('td');
    errorCell.colSpan = 4;
    errorCell.textContent = 'No users found.';
    row.appendChild(errorCell);
    userListBody.appendChild(row);
  } else {
    users.forEach(user => {
      const row = document.createElement('tr');
      row.classList.add('table-row');
      row.innerHTML = `
        <td>${user.userID}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
      `;

      userListBody.appendChild(row);
    });
  }
}

  function editIssueRequest(requestId) {
    // Perform edit operation for the request
    console.log(`Editing issue/return request with ID: ${requestId}`);
  }
  $(document).ready(function() {
    $('.datepicker').datepicker({
      format: 'dd-mm-yyyy',
      autoclose: true
    });
  });
  // adminpage.js

// Function to handle the AJAX request for issuing a book
// adminpage.js

// Function to handle the AJAX request for issuing a book
function issueBook() {
  // Get the form values
  var userId = document.getElementsByName("userid")[0].value;
  var bookId = document.getElementsByName("bookid")[0].value;
  var issueDate = document.getElementsByName("issuedate")[0].value;
  var dueDate = document.getElementsByName("duedate")[0].value;

  // Create an AJAX request
  $.ajax({
    type: "POST",
    url: "../php/issue_book.php", // Update with the correct URL for your PHP script
    data: {
      userid: userId,
      bookid: bookId,
      issuedate: issueDate,
      duedate: dueDate,
    },
    success: function (response) {
      // Handle the response from the server
      var message = JSON.parse(response);
      if (message.status === "success") {
        document.getElementById("issueBookForm").reset(); // Reset the form
        document.getElementById("issueBookMessage").innerHTML = message.message; // Display the success message
        document.getElementById("issueBookMessage").style.display = "block"; // Show the message element

        // Hide the success message after a certain time
        setTimeout(function () {
          document.getElementById("issueBookMessage").style.display = "none"; // Hide the message element
        }, 3000); // 3000 milliseconds (3 seconds)
      } else {
        console.log(message.message); // Log the error message
        document.getElementById("issueBookForm").reset(); // Reset the form
        document.getElementById("issueBookMessage").innerHTML = message.message; // Display the error message
        document.getElementById("issueBookMessage").style.display = "block"; // Show the message element

        // Hide the error message after a certain time
        setTimeout(function () {
          document.getElementById("issueBookMessage").style.display = "none"; // Hide the message element
        }, 3000); // 3000 milliseconds (3 seconds)
      }
    },
    error: function (xhr, status, error) {
      // Handle the error case
      console.log(error); // You can log the error or perform other actions

      // Display the error message
      document.getElementById("issueBookForm").reset(); // Reset the form
      document.getElementById("issueBookMessage").innerHTML = "An error occurred. Please try again later."; // Display the generic error message
      document.getElementById("issueBookMessage").style.display = "block"; // Show the message element

      // Hide the error message after a certain time
      setTimeout(function () {
        document.getElementById("issueBookMessage").style.display = "none"; // Hide the message element
      }, 3000); // 3000 milliseconds (3 seconds)
    }
  });
}
function fetchCurrentlyIssuedBooks() {
  $.ajax({
    url: '../php/fetch_currently_issued_books.php', // Update with the correct URL for your PHP script
    type: 'GET',
    success: function(data) {
      if (data.length === 0) {
        console.log('No currently issued books found.');
        updateCurrentlyIssuedBooksTable(data);
      } else {
        updateCurrentlyIssuedBooksTable(data);
      }
    },
    error: function(xhr, status, error) {
      console.error('Error:', error);
    }
  }); 
}
function updateCurrentlyIssuedBooksTable(books) {
  const table = document.getElementById('currentlyIssuedBooksTable');
  const tbody = table.querySelector('tbody');
  tbody.innerHTML = '';

  if (books.length === 0) {
    console.log("Check");
    const row = document.createElement('tr');
    const errorCell = document.createElement('td');
    errorCell.colSpan = 5;
    errorCell.textContent = 'No issuedbooks found.';
    row.appendChild(errorCell);
    tbody.appendChild(row);
  } else {
    books.forEach(book => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${book.issueId}</td>
        <td>${book.bookId}</td>
        <td>${book.userId}</td>
        <td>${book.issueDate}</td>
        <td>${book.dueDate}</td>
        <td>
          <div class="form-group">
            <input type="text" name="returndate" placeholder="Return Date" class="datepicker" data-issueid="${book.issueId}">
          </div>
        </td>
        <td>
          <select onchange="validateReturnDate(${book.issueId}, this.value)">
            <option value="issued" ${book.status === 'issued' ? 'selected' : ''}>Issued</option>
            <option value="returned" ${book.status === 'returned' ? 'selected' : ''}>Returned</option>
          </select>
        </td>
      `;
      tbody.appendChild(row);
    });
  }

  $(document).ready(function() {
    $('.datepicker').datepicker({
      format: 'dd-mm-yyyy',
      autoclose: true
    });
  });
}

function validateReturnDate(issueId, status) {
  const returnDateInput = document.querySelector(`input[data-issueid="${issueId}"]`);
  const returnDate = returnDateInput.value;

  if (returnDate === '') {
    // Display an error message or take any other desired action
    console.log('Return date is required.');
    displayErrorMessage('Return date is required.');
    fetchCurrentlyIssuedBooks();
    return;
  }

  // Proceed with updating the book status
  updateBookStatus(issueId, status, returnDate);
}

function updateBookStatus(issueId, status, returnDate) {
  console.log(returnDate);
  // Make an AJAX request to update the book status in the database
  $.ajax({
    url: '../php/update_book_status.php', // Update with the correct URL for your PHP script
    type: 'POST',
    data: { issueId: issueId, status: status, returnDate: returnDate },
    success: function(response) {
      console.log('Book status updated successfully:', response);
      fetchCurrentlyIssuedBooks();
    },
    error: function(xhr, status, error) {
      console.error('Error updating book status:', error);
    }
  });
}


function displayErrorMessage(message) {
  const errorContainer = document.getElementById('errorContainer');
  errorContainer.textContent = message;
  errorContainer.style.display = 'block';
  setTimeout(function() {
    errorContainer.textContent = '';
    errorContainer.style.display = 'none';
  }, 3000); // Adjust the duration (in milliseconds) as needed
}
// Attach the AJAX function to the "Issue Book" form submission event
document.getElementById("issueBookForm").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the default form submission
  issueBook(); // Call the AJAX function to issue the book
});
$(document).ready(function() {
  $('#addBookForm').submit(function(event) {
    // Prevent the form from submitting normally
    event.preventDefault();

    // Get the form data
    var formData = {
      newBookName: $('input[name=newBookName]').val(),
      newBookAuthor: $('input[name=newBookAuthor]').val(),
      newBookPublishYear: $('input[name=newBookPublishYear]').val()
    };

    // Send the AJAX request
    $.ajax({
      type: 'POST',
      url: '../php/add_book.php', // Replace with the URL to your server-side script
      data: formData,
      dataType: 'json', // Specify that the response should be treated as JSON
      success: function(response) {
        // Check the status in the response
        if (response.status === 'success') {
          console.log(response.message);
          $('#addBookForm')[0].reset();
          fetchBooks();
          // Perform any additional actions for a successful insertion
        } else {
          console.error(response.message);
          // Perform any additional actions for an error
        }
      },
      error: function(xhr, status, error) {
        // Handle any errors that occur during the AJAX request
        console.error(xhr.responseText);
      }
    });
  });
});


