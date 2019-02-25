1. get /petion
    render the petition page
2. post / petition
    1. render error message if there was an error (so if user doesn`t provide first, last and signature, render an error message)
    2. insert data into a table calles signatures, set a cookie, then redirect to /thanks page

3. GET /thanks
    1. render the thank you page

4. GET /signers
    should list first and last names of everyone who has signed

    QUERIES
    1. INSERT into signaturees
    2. SELECT query to get list of all users who have sigend the petition

    EXPRESS Handleblars Template
    1. petition
        1.1. this is where the canvas element should live
        1.2. shoud contain a form tag for the first name, last name, signature
        1.3. third input field for the signature should be hidden
        1.4. in our client side JS file, then, we need to , on the mouseup event, capture the url of the signature the user just made and put that in the hidden input field
            we van get this url by calling toDataUrl on the canvas element
            so that when the user hit the submit button, we make a POST request to the server that contains the first, last and signature that user just provided
    2. thanks
    3. signers
    4. layout
    5. potentianl some partials

PART 3
#DATABASE
#ROUTES
1. GET registration
2. POST  register
3. get login
4. POST login
# Templates
    1. registr
