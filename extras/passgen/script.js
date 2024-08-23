// Hi! I'm Carlos (inivert), and this is my password generator script.
// This script handles all the logic for generating and managing passwords.

document.addEventListener('DOMContentLoaded', () => {
    // Here, I'm getting all the elements I need from the HTML
    const passwordEl = document.getElementById('password');
    const lengthEl = document.getElementById('length');
    const lengthValueEl = document.getElementById('length-value');
    const uppercaseEl = document.getElementById('uppercase');
    const lowercaseEl = document.getElementById('lowercase');
    const numbersEl = document.getElementById('numbers');
    const symbolsEl = document.getElementById('symbols');
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');
    // These are the characters I use to create passwords
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    // This function updates the displayed password length
    function updateLengthValue() {
        lengthValueEl.textContent = lengthEl.value;
    }

    // This is where the magic happens - generating the password!
    function generatePassword() {
        let chars = '';
        let password = '';

        // I'm checking which character types the user wants
        if (uppercaseEl.checked) chars += uppercaseChars;
        if (lowercaseEl.checked) chars += lowercaseChars;
        if (numbersEl.checked) chars += numberChars;
        if (symbolsEl.checked) chars += symbolChars;

        // Oops! The user didn't select any character types
        if (chars === '') {
            alert('Please select at least one character type.');
            return;
        }

        // Now, I'm creating the password by randomly selecting characters
        for (let i = 0; i < lengthEl.value; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        // Display the new password and make it look cool with an animation
        passwordEl.value = password;
        animatePassword();

    }

    function animatePassword() {
        passwordEl.style.animation = 'none';
        passwordEl.offsetHeight; // Trigger reflow
        passwordEl.style.animation = 'fadeIn 0.3s ease-out';
    }

    function copyToClipboard() {
        passwordEl.select();
        document.execCommand('copy');
        copyBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
        `;
        setTimeout(() => {
            copyBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
            `;
        }, 1500);
    }

    // Here, I'm setting up the event listeners
    lengthEl.addEventListener('input', updateLengthValue);
    generateBtn.addEventListener('click', generatePassword);
    copyBtn.addEventListener('click', copyToClipboard);

    // Initialize the displayed password length
    updateLengthValue();
    // I decided not to generate a password on page load
    // generatePassword();
});

// Created by Carlos (inivert)
