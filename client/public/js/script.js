function validateOfferCode(){
    var offerCodeText = document.getElementById('offerCodeText');
    if(offerCodeText.value === '')
    {
        alert('Enter offer code first to apply!');
        return false;
    }
    return true;
}

function validateSearch(){
    var searchBar = document.getElementById('searchBar');
    if(searchBar.value === '')
    {
        alert('Enter something to search products');
        return false;
    }
    return true;
}
function validateResetPasswordForm() {
    var newPassword = document.getElementById('newPassword').value.trim();
    var confirmPassword = document.getElementById('confirmPassword').value.trim();
    
    var newPasswordError = document.getElementById('newPasswordError');
    var confirmPasswordError = document.getElementById('confirmPasswordError');
    
    var isValid = true;
    
    // Clear previous error messages
    newPasswordError.textContent = '';
    confirmPasswordError.textContent = '';
    
    // Check if new password field is empty
    if (newPassword === '') {
        newPasswordError.textContent = 'Please enter a new password.';
        isValid = false;
    } else if (newPassword.length < 8) {
        newPasswordError.textContent = 'Password must be at least 8 characters long.';
        isValid = false;
    }
    
    // Check if confirm password field is empty
    if (confirmPassword === '') {
        confirmPasswordError.textContent = 'Please confirm your new password.';
        isValid = false;
    }
    
    // Check if new password and confirm password match
    if (newPassword !== '' && confirmPassword !== '' && newPassword !== confirmPassword) {
        confirmPasswordError.textContent = 'Passwords do not match.';
        isValid = false;
    }
    
    return isValid;
}
$(document).ready(function() {
    // When any radio button is clicked
    $('input[name="add"]').on('change', function() {
        // Remove the 'selected' class from all address-box divs
        $('.address-box').removeClass('selected');
        
        // Add 'selected' class to the parent div of the clicked radio button
        $(this).closest('.address-box').addClass('selected');
    });
});

// account page
if (typeof menuItems === 'undefined') {
    const menuItems = document.querySelectorAll('.menu-item');
menuItems.forEach(menuItem=>{
    
    menuItem.addEventListener('click',function(){
        const id = this.dataset.id;
        document.querySelector('#'+id).classList.remove('invisible');
        this.classList.add('active');
        menuItems.forEach(menuItem2=>{
        menuItem2.classList.add('active');
            if(id!=menuItem2.dataset.id){
                document.querySelector('#'+menuItem2.dataset.id).classList.add('invisible'); 
                menuItem2.classList.remove('active');
            }
        });
    });
});
}

//for printing my profile section by default on account page
if (typeof profile === 'undefined') {
const profile = document.querySelector('#my-profile');
if(profile)
    profile.classList.remove('invisible');

//checkout page - different shipping address feature
const choice = document.querySelector('#choice');

if(choice){

    choice.addEventListener('change',()=>{
        if(choice.checked){
            document.querySelector('.js-shipping-details').classList.remove('invisible');
        }
        else{
            document.querySelector('.js-shipping-details').classList.add('invisible');
        }
    });
}
}

function showHideForm(){
const addBtn=document.getElementById('add-new-address');
const billingForm=document.querySelector('.billing-details');
    if (billingForm.style.display === 'none') {
        billingForm.style.display = 'block';
        addBtn.innerHTML = "Close";
    } else {
        billingForm.style.display = 'none';
        addBtn.innerHTML = "Add New Address";
    }
}

//cart page - to change the quantity of the certain cart item
if (typeof quantityModifier === 'undefined') {
const quantityModifier = Array.from(document.getElementsByClassName('qty-mod'));

if(quantityModifier && quantityModifier.length>0){
    quantityModifier.forEach(function(qtyMod){
        const minusButton =qtyMod.children[0]; 
        const plusButton = qtyMod.children[2];
        const input = qtyMod.children[1];
        minusButton.addEventListener('click',function(){
            if(input.value==1){
                input.setAttribute('disabled','true');
                minusButton.setAttribute('disabled','true');
            }
            else{
                if(input.hasAttribute('disabled'))
                    input.removeAttribute('disabled');
                if(plusButton.hasAttribute('disabled'))
                    plusButton.removeAttribute('disabled');
                input.value = parseInt(input.value)-1;
            }
        });
        plusButton.addEventListener('click',function(){
            if(input.value==10){
                input.setAttribute('disabled','true');
                plusButton.setAttribute('disabled','true');
            }
            else{
                if(input.hasAttribute('disabled'))
                    input.removeAttribute('disabled');
                if(minusButton.hasAttribute('disabled'))
                    minusButton.removeAttribute('disabled');
                input.value = parseInt(input.value)+1;
            }
        });
    });
}
}
// product details page
function selectQuantity(selectedDiv, value) {
    const quantities = document.querySelectorAll('.quantity div');
    quantities.forEach(div => {
        div.classList.remove('selected');
    });
    selectedDiv.classList.add('selected');
    document.getElementById('selectedQuantity').value = value;
}


// shop page
filterButton = document.querySelector('.js-filter-btn');
if(filterButton)
{
    filterButton.addEventListener('click',()=>{
        document.querySelector('#filter-section').classList.toggle('invisible');
        document.querySelectorAll('#filter-section>*').forEach(item=>{
            item.classList.toggle('invisible');
        })
    })
    // likeButtons = Array.from(document.getElementsByClassName('like'));
    // likeButtons.forEach(likeButton =>{
    //     likeButton.addEventListener('click',function(){
    //         this.children[0].classList.remove('fa-regular');
    //         this.children[0].classList.add('fa-solid');
    //     });
    // });
}

// validation
function validateChangePassword(){
    const currentPasswordInput = document.getElementById('currentPassword');
    const currentPasswordError = document.getElementById('currentPasswordError');
    const newPasswordInput = document.getElementById('newPassword');
    const newPasswordError = document.getElementById('newPasswordError');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    let isValid = true;

    const currentPasswordValue = currentPasswordInput.value.trim();
    if (!currentPasswordValue) {
        currentPasswordError.innerText = 'Current password is required.';
        isValid = false;
    } else if (currentPasswordValue.length < 8) {
        currentPasswordError.innerText = 'Current password must be at least 8 characters long.';
        isValid = false;
    } else {
        currentPasswordError.innerText = ''; 
    }

    const newPasswordValue = newPasswordInput.value.trim();
    if (!newPasswordValue) {
        newPasswordError.innerText = 'New password is required.';
        isValid = false;
    } else if (newPasswordValue.length < 8) {
        newPasswordError.innerText = 'New password must be at least 8 characters long.';
        isValid = false;
    } else {
        newPasswordError.innerText = ''; 
    }


    const confirmPasswordValue = confirmPasswordInput.value.trim();
    if (!confirmPasswordValue) {
        confirmPasswordError.innerText = 'Confirm password is required.';
        isValid = false;
    } else if (confirmPasswordValue !== newPasswordValue) {
        confirmPasswordError.innerText = 'Passwords do not match.';
        isValid = false;
    } else {
        confirmPasswordError.innerText = '';
    }
    return isValid;
    
}
function validateMyAccountForm() {
    const firstNameInput = document.getElementById('firstName');
    const firstNameError = document.getElementById('firstNameError');
    const lastNameInput = document.getElementById('lastName');
    const lastNameError = document.getElementById('lastNameError');

    let isValid = true;

    const firstNameValue = firstNameInput.value.trim();
    if (!firstNameValue) {
        firstNameError.innerText = 'First Name is required.';
        isValid = false;
    } else if (/\d/.test(firstNameValue)) {
        firstNameError.innerText = 'First Name should not contain digits.';
        isValid = false;
    } else if (firstNameValue.length > 50) {
        firstNameError.innerText = 'First Name cannot exceed 50 characters.';
        isValid = false;
    } else {
        firstNameError.innerText = ''; 
    }

    const lastNameValue = lastNameInput.value.trim();
    if (!lastNameValue) {
        lastNameError.innerText = 'Last Name is required.';
        isValid = false;
    } else if (/\d/.test(lastNameValue)) {
        lastNameError.innerText = 'Last Name should not contain digits.';
        isValid = false;
    } else if (lastNameValue.length > 50) {
        lastNameError.innerText = 'Last Name cannot exceed 50 characters.';
        isValid = false;
    } else {
        lastNameError.innerText = '';
    }


    return isValid;
}

function validateEditAddressForm() {
    let modalFirstName = document.getElementById('modalFirstName');
    let modalLastName = document.getElementById('modalLastName');
    let modalPhone = document.getElementById('modalPhone');
    let modalPinCode = document.getElementById('modalPinCode');
    let modalAddress = document.getElementById('modalAddress');

    let modalFirstNameError = document.getElementById('modalFirstNameError');
    let modalLastNameError = document.getElementById('modalLastNameError');
    let modalPhoneError = document.getElementById('modalPhoneError');
    let modalPinCodeError = document.getElementById('modalPinCodeError');
    let modalAddressError = document.getElementById('modalAddressError');

    let isValid = true;

    if (modalFirstName.value.trim() === '') {
        modalFirstNameError.innerText = 'First Name is required';
        isValid = false;
    } else if (/\d/.test(modalFirstName.value)) {
        modalFirstNameError.innerText = 'First Name should not contain numbers';
        isValid = false;
    } else {
        modalFirstNameError.innerText = '';
    }

    if (modalLastName.value.trim() === '') {
        modalLastNameError.innerText = 'Last Name is required';
        isValid = false;
    } else if (/\d/.test(modalLastName.value)) {
        modalLastNameError.innerText = 'Last Name should not contain numbers';
        isValid = false;
    } else {
        modalLastNameError.innerText = '';
    }

    if (modalPhone.value.trim() === '') {
        modalPhoneError.innerText = 'Phone number is required';
        isValid = false;
    } else if (!/^\d{10}$/.test(modalPhone.value)) {
        modalPhoneError.innerText = 'Phone number must be 10 digits';
        isValid = false;
    } else {
        modalPhoneError.innerText = '';
    }

    if (modalPinCode.value.trim() === '') {
        modalPinCodeError.innerText = 'Pin code is required';
        isValid = false;
    } else if (!/^\d{6}$/.test(modalPinCode.value)) {
        modalPinCodeError.innerText = 'Pin code must be 6 digits';
        isValid = false;
    } else {
        modalPinCodeError.innerText = '';
    }

    if (modalAddress.value.trim() === '') {
        modalAddressError.innerText = 'Address is required';
        isValid = false;
    } else {
        modalAddressError.innerText = '';
    }

    return isValid;
}

function contactFormValidation() {
    let contactName = document.getElementById('contactName');
    let contactEmail = document.getElementById('contactEmail');
    let contactPhone = document.getElementById('contactPhone');
    let contactMessage = document.getElementById('contactMessage');

    let contactNameError = document.getElementById('contactNameError');
    let contactEmailError = document.getElementById('contactEmailError');
    let contactPhoneError = document.getElementById('contactPhoneError');
    let contactMessageError = document.getElementById('contactMessageError');

    let isValid = true;

    if (contactName.value.trim() === '') {
        contactNameError.innerText = 'Name is required';
        isValid = false;
    } else if (/\d/.test(contactName.value)) {
        contactNameError.innerText = 'Name should not contain numbers';
        isValid = false;
    } else {
        contactNameError.innerText = '';
    }

    if (contactEmail.value.trim() === '') {
        contactEmailError.innerText = 'Email is required';
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.value)) {
        contactEmailError.innerText = 'Invalid email format';
        isValid = false;
    } else {
        contactEmailError.innerText = '';
    }

    if (contactPhone.value.trim() === '') {
        contactPhoneError.innerText = 'Phone number is required';
        isValid = false;
    } else if (!/^\d{10}$/.test(contactPhone.value)) {
        contactPhoneError.innerText = 'Phone number must be 10 digits';
        isValid = false;
    } else {
        contactPhoneError.innerText = '';
    }

    if (contactMessage.value.trim() === '') {
        contactMessageError.innerText = 'Message is required';
        isValid = false;
    } else {
        contactMessageError.innerText = '';
    }

    return isValid;
}

function validateRegistrationForm() {
    let fname = document.getElementById('fname');
    let lname = document.getElementById('lname');
    let email = document.getElementById('email');
    let phone = document.getElementById('phone');
    let password = document.getElementById('password');
    let confirmPassword = document.getElementById('confirmPassword');

    let nameError = document.getElementById('nameError');
    let emailError = document.getElementById('emailError');
    let phoneError = document.getElementById('phoneError');
    let passwordError = document.getElementById('passwordError');
    let confirmPasswordError = document.getElementById('confirmPasswordError');

    let isValid = true;

    if (fname.value.trim() === '' || lname.value.trim === '') {
        nameError.innerText = 'Both first and last names are required.';
        isValid = false;
    } else if (!/^[A-Za-z\s]+$/.test(fname.value.trim())) {
        nameError.innerText = 'First name should only contain alphabets.';
        isValid = false;
    } else if (!/^[A-Za-z\s]+$/.test(lname.value.trim())) {
        nameError.innerText = 'Last name should only contain alphabets.';
        isValid = false;
    } else if (fname.length > 50 || lname.length > 50) {
        nameError.innerText = 'First and last names must be 50 characters or less.';
        isValid = false;
    } else {
        nameError.innerText = ''; // Clear error if all checks pass
    }


    if (email.value.trim() === '') {
        emailError.innerText = 'Email is required';
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        emailError.innerText = 'Invalid email format';
        isValid = false;
    } else if (email.value.length > 100) {
        emailError.innerText = 'Email must be 100 characters or less';
        isValid = false;
    } else {
        emailError.innerText = '';
    }

    if (phone.value.trim() === '') {
        phoneError.innerText = 'Mobile number is required';
        isValid = false;
    } else 
    if (!/^[6-9]\d{9}$/.test(phone.value)) {
        phoneError.innerText = 'Invalid mobile number format.';
        isValid = false;
    } 
    else {
        phoneError.innerText = '';
    }

    if (password.value.trim() === '') {
        passwordError.innerText = 'Password is required';
        isValid = false;
    } else if (password.value.length < 6) {
        passwordError.innerText = 'Password must be at least 6 characters long';
        isValid = false;
    } else if (password.value.length > 20) {
        passwordError.innerText = 'Password must be 20 characters or less';
        isValid = false;
    } else {
        passwordError.innerText = '';
    }

    if (confirmPassword.value.trim() === '') {
        confirmPasswordError.innerText = 'Confirm Password is required';
        isValid = false;
    } else if (confirmPassword.value !== password.value) {
        confirmPasswordError.innerText = 'Passwords do not match';
        isValid = false;
    } else {
        confirmPasswordError.innerText = '';
    }

    return isValid;
}


function validateOtpForm() {
    let otp = document.getElementById('otp');
    let otpError = document.getElementById('otpError');

    let isValid = true;

    if (otp.value.trim() === '') {
        otpError.innerText = 'OTP is required';
        isValid = false;
    } else if (!/^\d{6}$/.test(otp.value)) {
        otpError.innerText = 'OTP must be exactly 6 digits';
        isValid = false;
    } else {
        otpError.innerText = '';
    }

    return isValid;
}

function validateLoginForm() {
    let loginEmail = document.getElementById('loginEmail');
    let loginPassword = document.getElementById('loginPassword');

    let loginEmailError = document.getElementById('loginEmailError');
    let loginPasswordError = document.getElementById('loginPasswordError');

    let isValid = true;

    if (loginEmail.value.trim() === '') {
        loginEmailError.innerText = 'Email is required';
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail.value)) {
        loginEmailError.innerText = 'Invalid email format';
        isValid = false;
    } else if (loginEmail.value.length > 100) {
        loginEmailError.innerText = 'Email must be 100 characters or less';
        isValid = false;
    } else {
        loginEmailError.innerText = '';
    }

    if (loginPassword.value.trim() === '') {
        loginPasswordError.innerText = 'Password is required';
        isValid = false;
    } else if (loginPassword.value.length < 6) {
        loginPasswordError.innerText = 'Password must be at least 6 characters long';
        isValid = false;
    } else if (loginPassword.value.length > 20) {
        loginPasswordError.innerText = 'Password must be 20 characters or less';
        isValid = false;
    } else {
        loginPasswordError.innerText = '';
    }

    return isValid;
}


function validateForgotPasswordForm() {
    let email = document.getElementById('otpEmail');
    let emailError = document.getElementById('otpEmailError');
    let isValid = true;

    if (email.value.trim() === '') {
        emailError.innerText = 'Email is required';
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        emailError.innerText = 'Invalid email format';
        isValid = false;
    } else if (email.value.length > 100) {
        emailError.innerText = 'Email must be 100 characters or less';
        isValid = false;
    } else {
        emailError.innerText = '';
    }

    return isValid;
}

function validateForms() {
    let isValid = true;

    // Billing Details Validation
    let billingFirstName = document.getElementById('billingFirstName');
    let billingFirstNameError = document.getElementById('billingFirstNameError');

    if (billingFirstName.value.trim() === '') {
        billingFirstNameError.innerText = 'First Name is required';
        isValid = false;
    } else if (billingFirstName.value.length > 50) {
        billingFirstNameError.innerText = 'First Name must be 50 characters or less';
        isValid = false;
    } else {
        billingFirstNameError.innerText = '';
    }

    let billingLastName = document.getElementById('billingLastName');
    let billingLastNameError = document.getElementById('billingLastNameError');

    if (billingLastName.value.trim() === '') {
        billingLastNameError.innerText = 'Last Name is required';
        isValid = false;
    } else if (billingLastName.value.length > 50) {
        billingLastNameError.innerText = 'Last Name must be 50 characters or less';
        isValid = false;
    } else {
        billingLastNameError.innerText = '';
    }

    let billingAddress = document.getElementById('billingAddress');
    let billingAddressError = document.getElementById('billingAddressError');

    if (billingAddress.value.trim() === '') {
        billingAddressError.innerText = 'Street Address is required';
        isValid = false;
    } else if (billingAddress.value.length > 100) {
        billingAddressError.innerText = 'Street Address must be 100 characters or less';
        isValid = false;
    } else {
        billingAddressError.innerText = '';
    }

    let billingCity = document.getElementById('billingCity');
    let billingCityError = document.getElementById('billingCityError');

    if (billingCity.value.trim() === '') {
        billingCityError.innerText = 'City is required';
        isValid = false;
    } else if (billingCity.value.length > 50) {
        billingCityError.innerText = 'City must be 50 characters or less';
        isValid = false;
    } else {
        billingCityError.innerText = '';
    }

    let billingState = document.getElementById('billingState');
    let billingStateError = document.getElementById('billingStateError');

    if (billingState.value.trim() === '') {
        billingStateError.innerText = 'State is required';
        isValid = false;
    } else if (billingState.value.length > 50) {
        billingStateError.innerText = 'State must be 50 characters or less';
        isValid = false;
    } else {
        billingStateError.innerText = '';
    }

    let billingPinCode = document.getElementById('billingPinCode');
    let billingPinCodeError = document.getElementById('billingPinCodeError');

    if (billingPinCode.value.trim() === '') {
        billingPinCodeError.innerText = 'Pin Code is required';
        isValid = false;
    } else if (!/^\d{6}$/.test(billingPinCode.value)) {
        billingPinCodeError.innerText = 'Valid Pin Code is required';
        isValid = false;
    } else {
        billingPinCodeError.innerText = '';
    }

    let billingPhone = document.getElementById('billingPhone');
    let billingPhoneError = document.getElementById('billingPhoneError');

    if (billingPhone.value.trim() === '') {
        billingPhoneError.innerText = 'Phone Number is required';
        isValid = false;
    } else if (!/^\d{10}$/.test(billingPhone.value)) {
        billingPhoneError.innerText = 'Valid Phone Number is required';
        isValid = false;
    } else {
        billingPhoneError.innerText = '';
    }
    return isValid;
}
function validateCheckout() {
    document.getElementById('payModeError').innerText = '';
    document.getElementById('addressError').innerText = '';

    const paymentModes = document.getElementsByName('pay-mode');
    let selectedPayMode = false;
    for (let i = 0; i < paymentModes.length; i++) {
        if (paymentModes[i].checked) {
            selectedPayMode = true;
            break;
        }
    }
    if (!selectedPayMode) {
        document.getElementById('payModeError').innerText = 'Please select a payment mode.';
    }
    const addressRadioButtons = document.getElementsByName('add');
    let selectedAddress = false;
    for (let i = 0; i < addressRadioButtons.length; i++) {
        if (addressRadioButtons[i].checked) {
            selectedAddress = true;
            break;
        }
    }
    if (!selectedAddress) {
        document.getElementById('addressError').innerText = 'Please select an address.';
    }

    return selectedPayMode && selectedAddress;
}


function validateReviewForm() {
    let isValid = true;

    const userRating = document.getElementById('userRating').value;
    const userReview = document.getElementById('userReview').value.trim();
    document.getElementById('userRatingError').innerText = '';
    document.getElementById('userReviewError').innerText = '';

    if (!userRating) {
        document.getElementById('userRatingError').innerText = 'Rating is required.';
        isValid = false;
    }

    if (!userReview) {
        document.getElementById('userReviewError').innerText = 'Review is required.';
        isValid = false;
    }

    return isValid;
}

document.addEventListener('DOMContentLoaded', function() {
    const collapseBtn = document.querySelector('#collapse-btn');
    
    if (collapseBtn) {  // Ensure the element exists
      collapseBtn.addEventListener('click', function() {
        if (this.classList.contains('collapsed')) {
          document.querySelector('#SearchSection').classList.add('hidden');
          document.querySelector('#SearchSection').classList.remove('not-hidden');
          document.querySelector('#SearchSection2').classList.add('hidden');
          document.querySelector('#SearchSection2').classList.remove('not-hidden');
        } else {
          document.querySelector('#SearchSection').classList.remove('hidden');
          document.querySelector('#SearchSection').classList.add('not-hidden');
          document.querySelector('#SearchSection2').classList.remove('hidden');
          document.querySelector('#SearchSection2').classList.add('not-hidden');
        }
      });
    } else {
      console.error('Element with ID "collapse-btn" not found');
    }
  });
  


