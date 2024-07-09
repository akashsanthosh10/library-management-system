$(document).ready(function() {
    var username = localStorage.getItem('username');
    var userEmail = localStorage.getItem('userEmail');
    var userID = localStorage.getItem('userID');
  
    // Update the admin details on the home page
    $('#Username').text(username);
    $('#UserEmail').text(userEmail);
    $('#UserID').text(userID);
  });
  function logout() {
    localStorage.clear();
    window.location.href = "../html/login.html";
  }
  
  function showHome() {
      document.getElementById('homePage').style.display = 'block';
      document.getElementById('history').style.display = 'none';
      document.getElementById('allBooksPage').style.display = 'none';
      document.getElementById('issueReturnRequestsPage').style.display = 'none';
      document.getElementById('currentlyIssuedBooksPage').style.display = 'none';
      document.getElementById('wishlist').style.display = 'none';
    }
  function showAllBooks() {
      document.getElementById('homePage').style.display = 'none';
      document.getElementById('history').style.display = 'none';
      document.getElementById('allBooksPage').style.display = 'block';
      document.getElementById('issueReturnRequestsPage').style.display = 'none';
      document.getElementById('currentlyIssuedBooksPage').style.display = 'none';
      document.getElementById('wishlist').style.display = 'none';
      fetchBooks();
    }  
    function showWishlist() {
      document.getElementById('homePage').style.display = 'none';
      document.getElementById('history').style.display = 'none';
      document.getElementById('wishlist').style.display = 'block';
      document.getElementById('issueReturnRequestsPage').style.display = 'none';
      document.getElementById('currentlyIssuedBooksPage').style.display = 'none';
      document.getElementById('allBooksPage').style.display = 'none';
      fetchwishlist(localStorage.getItem('userID'));
    } 
    function showHistory() {
      document.getElementById('homePage').style.display = 'none';
      document.getElementById('history').style.display = 'block';
      document.getElementById('allBooksPage').style.display = 'none';
      document.getElementById('issueReturnRequestsPage').style.display = 'none';
      document.getElementById('currentlyIssuedBooksPage').style.display = 'none';
      fetchHistory(localStorage.getItem('userID'));
      document.getElementById('wishlist').style.display = 'none';
    }
  
    
    
  
    function showIssueReturnRequests() {
      document.getElementById('homePage').style.display = 'none';
      document.getElementById('history').style.display = 'none';
      document.getElementById('allBooksPage').style.display = 'none';
      document.getElementById('issueReturnRequestsPage').style.display = 'block';
      document.getElementById('currentlyIssuedBooksPage').style.display = 'none';
      document.getElementById('wishlist').style.display = 'none';
    }
  
    function showCurrentlyIssuedBooks() {
      document.getElementById('homePage').style.display = 'none';
      document.getElementById('history').style.display = 'none';
      document.getElementById('allBooksPage').style.display = 'none';
      document.getElementById('issueReturnRequestsPage').style.display = 'none';
      document.getElementById('currentlyIssuedBooksPage').style.display = 'block';
      fetchCurrentlyIssuedBooks(localStorage.getItem('userID'));
      document.getElementById('wishlist').style.display = 'none';
    }
  
    function fetchBooks(searchTerm = '') {
      console.log(searchTerm);
      // Make an AJAX request to the server with the search query
      fetch(`../php/fetch_books.php?search=${encodeURIComponent(searchTerm)}`)
        .then(response => response.json())
        .then(data => {
          if (data.length === 0) {
            console.log('No books found.');
            updateBookList(data);
          } else {
            updateBookList(data);
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
    
    function searchBooks() {
      const searchTerm = searchInput.value.trim(); // Get the search query from the input field
      fetchBooks(searchTerm); // Call fetchBooks function with the search query
    }
    
    function updateBookList(books) {
      const bookListBody = document.getElementById('bookListBody');
      bookListBody.innerHTML = '';
    
      if (books.length === 0) {
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
            <td>
              <span id="wishlistStatus_${book.bookId}"></span>
            </td>
          `;
    
          bookListBody.appendChild(row);
    
          // Check wishlist status for the book
          checkWishlistStatus(book.bookId);
        });
      }
    }
    function fetchwishlist(userId) {
      $.ajax({
        url: '../php/fetch_wishlist.php',
        type: 'GET',
        data: { userId: userId }, // Pass the user_id to the PHP script
        success: function(data) {
          if (data.length === 0) {
            console.log('No currently issued books found.');
            updatewishList(data);
          } else {
            console.log(data);
            updatewishList(data);
          }
        },
        error: function(xhr, status, error) {
          console.error('Error:', error);
        }
      });
    }
    function updatewishList(books) {
      const wishListBody = document.getElementById('wishListBody');
      wishListBody.innerHTML = '';
      console.log(books.length);
      if (books.length === 0) {
        console.log("Check");
        const row = document.createElement('tr');
        const errorCell = document.createElement('td');
        errorCell.colSpan = 5;
        errorCell.textContent = 'No books found.';
        row.appendChild(errorCell);
        wishListBody.appendChild(row);
      } else {
        books.forEach(book => {
          const row = document.createElement('tr');
          row.classList.add('table-row');
          row.innerHTML = `
            <td>${book.bookId}</td>
            <td>${book.bookName}</td>
            <td>${book.author}</td>
            <td>${book.publishYear}</td>
            <td>
              <button onclick="deleteBook('${book.bookId}')">Delete</button>
            </td>
          `;
    
          wishListBody.appendChild(row);
        });
      }
    }
    function deleteBook(bookId) {
      // Get the user ID or fetch it from your application's context
      const userId = localStorage.getItem('userID')
    
      // Make an AJAX request to delete the book from the wishlist
      $.ajax({
        url: '../php/deletewishlist.php',
        type: 'POST',
        data: {
          userId: userId,
          bookId: bookId
        },
        dataType: 'json',
        success: function(response) {
          // Handle the response from the server
          if (response.status === 'success') {
            // Book deleted successfully, perform any necessary UI updates
            fetchwishlist(userId);
            // Refresh the wishlist or update the UI as needed
            // ...
          } else {
            // Failed to delete the book, display an error message
            console.log(response);
          }
        },
        error: function(xhr, status, error) {
          // Handle the AJAX error
          console.error(error);
          alert('An error occurred while deleting the book');
        }
      });
    }
    
    function checkWishlistStatus(bookId) {
      // Make an AJAX request to checkWishlist.php
      $.ajax({
        type: 'POST',
        url: '../php/checkWishlist.php',
        data: {
          bookId: bookId,
          userId: localStorage.getItem('userID')
        },
        dataType: 'json',
        success: function(response) {
          if (response.status === 'success') {
            const wishlistStatusSpan = document.getElementById(`wishlistStatus_${bookId}`);
            if (response.inWishlist) {
              wishlistStatusSpan.textContent = 'Added to wishlist';
            } else {
              wishlistStatusSpan.innerHTML = `<button class="button" onclick="addToWishlist('${bookId}', this)">Add to wishlist</button>`;
            }
          } else {
            console.error(response.message);
          }
        },
        error: function(xhr, status, error) {
          console.error('Request error. Status:', xhr.status);
          console.error('Error:', error);
        }
      });
    }
function addToWishlist(bookId, button) {
  // Make an AJAX request to addToWishlist.php
  $.ajax({
    type: 'POST',
    url: '../php/addToWishlist.php',
    data: {
      bookid: bookId,
      userid: localStorage.getItem('userID')
    },
    dataType: 'json',
    success: function(response) {
      console.log(response); // Log the response object
      if (response.status === 'success') {
        button.innerHTML = 'Added to wishlist';
        button.disabled = true;
      } else {
        console.error(response.message);
      }
    },
    error: function(xhr, status, error) {
      console.log(xhr.responseText); // Log the response
      console.error('Request error. Status:', xhr.status);
      alert('An error occurred while processing the request.'); // Display a generic error message
    }
  });
}



      
  
    function fetchCurrentlyIssuedBooks(userId) {
      $.ajax({
        url: '../php/fetch_issued_books.php',
        type: 'GET',
        data: { userId: userId }, // Pass the user_id to the PHP script
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
      console.log(books);
      const table = document.getElementById('currentlyIssuedBooksTable');
      const tbody = table.querySelector('tbody');
      tbody.innerHTML = '';
    
      if (books.length === 0) {
        console.log("Check");
        const row = document.createElement('tr');
        const errorCell = document.createElement('td');
        errorCell.colSpan = 5;
        errorCell.textContent = 'No issued books found.';
        row.appendChild(errorCell);
        tbody.appendChild(row);
      } else {
        books.forEach(book => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${book.issue_id}</td>
            <td>${book.book_name}</td>
            <td>${book.issue_date}</td>
            <td>${book.due_date}</td>
          `;
          tbody.appendChild(row);
        });
      }
    }
    function fetchHistory(userId) {
      $.ajax({
        url: '../php/fetch_history.php',
        type: 'GET',
        data: { userId: userId }, // Pass the user_id to the PHP script
        success: function(data) {
          if (data.length === 0) {
            console.log('No history found.');
            updatehistory(data);
          } else {
            updatehistory(data);
          }
        },
        error: function(xhr, status, error) {
          console.error('Error:', error);
        }
      });
    }    
    
    function updatehistory(books) {
      console.log(books);
      const table = document.getElementById('historylist');
      const tbody = table.querySelector('tbody');
      tbody.innerHTML = '';
    
      if (books.length === 0) {
        console.log("Check");
        const row = document.createElement('tr');
        const errorCell = document.createElement('td');
        errorCell.colSpan = 5;
        errorCell.textContent = 'No history found.';
        row.appendChild(errorCell);
        tbody.appendChild(row);
      } else {
        books.forEach(book => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${book.book_id}</td>
            <td>${book.book_name}</td>
            <td>${book.issue_date}</td>
            <td>${book.due_date}</td>
            <td>${book.return_date ? book.return_date : 'Not Returned'}</td>
          `;
          tbody.appendChild(row);
        });
      }
    }