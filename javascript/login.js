jQuery(document).ready(function($) {
  var $form_modal = $('.user-modal'),
    $form_login = $form_modal.find('#login'),
    $form_signup = $form_modal.find('#signup'),
    $form_forgot_password = $form_modal.find('#reset-password'),
    $form_modal_tab = $('.switcher'),
    $tab_login = $form_modal_tab.children('li').eq(0).children('a'),
    $tab_signup = $form_modal_tab.children('li').eq(1).children('a'),
    $forgot_password_link = $form_login.find('.form-bottom-message a'),
    $back_to_login_link = $form_forgot_password.find('.form-bottom-message a'),
    $main_nav = $('.main-nav');
    
    // ...
    //open modal
    $main_nav.on('click', function(event){
  
      if( $(event.target).is($main_nav) ) {
        // on mobile open the submenu
        $(this).children('ul').toggleClass('is-visible');
      } else {
        // on mobile close submenu
        $main_nav.children('ul').removeClass('is-visible');
        //show modal layer
        $form_modal.addClass('is-visible'); 
        //show the selected form
        ( $(event.target).is('.signup') ) ? signup_selected() : login_selected();
      }
  
    });
  
    //close modal
    $('.user-modal').on('click', function(event){
      if( $(event.target).is($form_modal) || $(event.target).is('.close-form') ) {
        $form_modal.removeClass('is-visible');
      } 
    });
    //close modal when clicking the esc keyboard button
    $(document).keyup(function(event){
        if(event.which=='27'){
          $form_modal.removeClass('is-visible');
        }
      });
  
    //switch from a tab to another
    $form_modal_tab.on('click', function(event) {
      event.preventDefault();
      ( $(event.target).is( $tab_login ) ) ? login_selected() : signup_selected();
    });
  
    //hide or show password
    $('.hide-password').on('click', function(){
      var $this= $(this),
        $password_field = $this.prev('input');
      
      ( 'password' == $password_field.attr('type') ) ? $password_field.attr('type', 'text') : $password_field.attr('type', 'password');
      ( 'Show' == $this.text() ) ? $this.text('Hide') : $this.text('Show');
      //focus and move cursor to the end of input field
      $password_field.putCursorAtEnd();
    });
  
    //show forgot-password form 
    $forgot_password_link.on('click', function(event){
      event.preventDefault();
      forgot_password_selected();
    });
  
    //back to login from the forgot-password form
    $back_to_login_link.on('click', function(event){
      event.preventDefault();
      login_selected();
    });
  
    function login_selected(){
      $form_login.addClass('is-selected');
      $form_signup.removeClass('is-selected');
      $form_forgot_password.removeClass('is-selected');
      $tab_login.addClass('selected');
      $tab_signup.removeClass('selected');
    }
  
    function signup_selected(){
      $form_login.removeClass('is-selected');
      $form_signup.addClass('is-selected');
      $form_forgot_password.removeClass('is-selected');
      $tab_login.removeClass('selected');
      $tab_signup.addClass('selected');
    }
  
    function forgot_password_selected(){
      $form_login.removeClass('is-selected');
      $form_signup.removeClass('is-selected');
      $form_forgot_password.addClass('is-selected');
    }
  
    // ...

    $form_login.find('input[type="submit"]').on('click', function(event) {
      event.preventDefault();
    
      var email = $form_login.find('input[type="email"]').val();
      var password = $form_login.find('input[type="password"]').val();
      $form_login.find('#signin-email').val('');
      $form_login.find('#signin-password').val('');
    
      // Determine the login role based on the checkbox
      var isAdmin = $form_login.find('#login-as-admin').is(':checked');
      var loginUrl = isAdmin ? '../php/admin_login.php' : '../php/user_login.php';
    
      // Send AJAX request to the server
      $.ajax({
        url: loginUrl,
        method: 'POST',
        data: {
          email: email,
          password: password
        },
        success: function(response) {
          console.log('Response:', response); // Debug statement
    
          // Parse the response JSON
          try {
            response = JSON.parse(response);
          } catch (error) {
            console.error('Error parsing JSON:', error);
            return;
          }
    
          console.log('Parsed Response:', response); // Debug statement
    
          if (response.success) {
            // Redirect to the appropriate page based on the login role
            var redirectUrl = isAdmin ? '../html/home.html' : '../html/userlogin.html';
    
            // Clear the login fields
            $form_login.find('.error-message').hide().text('');
            console.log('Redirecting to home page...');
            setTimeout(function() {
              window.location.href = redirectUrl;
            }, 100); // Delay of 100 milliseconds
    
            // Store user data in local storage
            var userData = response.userData;
            var username = userData.username;
            var userEmail = userData.email;
            var userID = userData.id;
            console.log(userEmail);
            localStorage.setItem('username', username);
            localStorage.setItem('userEmail', userEmail);
            localStorage.setItem('userID', userID);
            console.log('Stored Username:', localStorage.getItem('username'));
            console.log('Stored User Email:', localStorage.getItem('userEmail'));
            console.log('Stored User ID:', localStorage.getItem('userID'));
          } else {
            // Show error message
            $('#login-error-message').text(response.message).show();
            $form_login.find('input[type="password"]').val('');
    
            // Activate error state for password field
            $form_login.find('input[type="password"]').addClass('has-error');
            $form_login.find('input[type="password"]').siblings('span.error-message').addClass('is-visible').text('Incorrect Password!');
          }
        },
        error: function() {
          // Handle error
          $form_login.find('.error-message').text('Error occurred during login.');
        },
        complete: function() {
          // Show error message
          $form_login.find('.error-message').show();
        }
      });
    });
    
// ...

  
  
      
      // ...

      $form_signup.find('input[type="submit"]').on('click', function(event) {
        event.preventDefault();
    
        var name = $form_signup.find('#signup-username').val();
        var email = $form_signup.find('#signup-email').val();
        var password = $form_signup.find('#signup-password').val();
        // Send AJAX request to the server
        $.ajax({
          url: '../php/signup.php',
          method: 'POST',
          data: {
            name: name,
            email: email,
            password: password
          },
          success: function(response) {
            // Parse the response JSON
            response = JSON.parse(response);
            if (response.success) {
              // Clear the signup form
              $form_signup.find('input').val('');
              // Switch to the login form
              login_selected();
            } else {
              // Show error message
              $form_signup.find('.error-message').text(response.message).show();
            }
          },
          error: function() {
            // Handle error
            console.log('Error occurred during signup.');
          }
        });
      });
      
      function login_selected() {
        $form_login.addClass('is-selected');
        $form_signup.removeClass('is-selected');
        $form_forgot_password.removeClass('is-selected');
        $tab_login.addClass('selected');
        $tab_signup.removeClass('selected');
      }
    


// ...

  });
  //credits https://css-tricks.com/snippets/jquery/move-cursor-to-end-of-textarea-or-input/
  jQuery.fn.putCursorAtEnd = function() {
    return this.each(function() {
        // If this function exists...
        if (this.setSelectionRange) {
            // ... then use it (Doesn't work in IE)
            // Double the length because Opera is inconsistent about whether a carriage return is one character or two. Sigh.
            var len = $(this).val().length * 2;
            this.setSelectionRange(len, len);
        } else {
          // ... otherwise replace the contents with itself
          // (Doesn't work in Google Chrome)
            $(this).val($(this).val());
        }
    });
  };