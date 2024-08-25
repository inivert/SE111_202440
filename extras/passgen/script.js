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
    const container = document.querySelector('.container');

    let isAnimating = false;
    let animationTimeout;

    // Debounce function with immediate option
    function debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const context = this;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    // Queue for password generation requests
    const passwordQueue = [];
    let isProcessing = false;

    function processQueue() {
        if (isProcessing || passwordQueue.length === 0) return;
        isProcessing = true;
        const nextGeneration = passwordQueue.shift();
        nextGeneration(() => {
            isProcessing = false;
            processQueue();
        });
    }
    // These are the characters I use to create passwords
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const similarChars = 'iIlL1oO0';
    const ambiguousChars = '{}[]()/\\\'"`~,;:.<>';

    const excludeSimilarEl = document.getElementById('exclude-similar');
    const excludeAmbiguousEl = document.getElementById('exclude-ambiguous');
    const strengthEl = document.getElementById('strength');
    const strengthTextEl = document.getElementById('strength-text');

    // This function updates the displayed password length
    function updateLengthValue() {
        lengthValueEl.textContent = lengthEl.value;
        generatePassword(); // Generate password on slider change
    }

    // This is where the magic happens - generating the password!
    const generatePassword = debounce(() => {
        passwordQueue.push((callback) => {
            if (isAnimating) {
                clearTimeout(animationTimeout);
                isAnimating = false;
            }
            const password = generatePasswordString();
            animatePassword(password);
            updateStrengthMeter(password);
            callback();
        });
        processQueue();
    }, 300, true);

    function animatePassword(password) {
        isAnimating = true;
        passwordEl.value = password;
        passwordEl.classList.remove('fade-in-animation');
        // Trigger reflow
        void passwordEl.offsetWidth;
        passwordEl.classList.add('fade-in-animation');
    
        setTimeout(() => {
            isAnimating = false;
            passwordEl.classList.remove('fade-in-animation');
        }, 500); // Match this to the animation duration in CSS
    }

    function generatePasswordString() {
        let charSets = [];
        if (uppercaseEl.checked) charSets.push(uppercaseChars);
        if (lowercaseEl.checked) charSets.push(lowercaseChars);
        if (numbersEl.checked) charSets.push(numberChars);
        if (symbolsEl.checked) charSets.push(symbolChars);

        if (charSets.length === 0) {
            showToast('Please select at least one character type.');
            return '';
        }

        let password = '';
        let allChars = charSets.join('');

        if (excludeSimilarEl.checked) {
            allChars = allChars.split('').filter(char => !similarChars.includes(char)).join('');
        }
        if (excludeAmbiguousEl.checked) {
            allChars = allChars.split('').filter(char => !ambiguousChars.includes(char)).join('');
        }

        // Ensure at least one character from each selected set
        charSets.forEach(set => {
            let filteredSet = set;
            if (excludeSimilarEl.checked) {
                filteredSet = filteredSet.split('').filter(char => !similarChars.includes(char)).join('');
            }
            if (excludeAmbiguousEl.checked) {
                filteredSet = filteredSet.split('').filter(char => !ambiguousChars.includes(char)).join('');
            }
            if (filteredSet.length > 0) {
                password += filteredSet.charAt(Math.floor(Math.random() * filteredSet.length));
            }
        });

        // Fill the rest of the password
        for (let i = password.length; i < lengthEl.value; i++) {
            password += allChars.charAt(Math.floor(Math.random() * allChars.length));
        }

        // Shuffle the password
        password = password.split('').sort(() => Math.random() - 0.5).join('');

        // Log password information
        console.log('Password generated:', {
            length: password.length,
            containsUppercase: /[A-Z]/.test(password),
            containsLowercase: /[a-z]/.test(password),
            containsNumbers: /[0-9]/.test(password),
            containsSymbols: /[^A-Za-z0-9]/.test(password),
            strength: calculatePasswordStrength(password)
        });

        return password;
    }

    function copyToClipboard() {
        navigator.clipboard.writeText(passwordEl.value).then(() => {
            showToast('Password copied to clipboard!');
            copyBtn.classList.add('copied');
            setTimeout(() => copyBtn.classList.remove('copied'), 1500);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            showToast('Failed to copy password. Please try again.');
        });
    }

    let toastTimeout;

    function showToast(message) {
        // Remove existing toast if present
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            document.body.removeChild(existingToast);
            clearTimeout(toastTimeout);
        }

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        // Force a reflow before adding the 'show' class
        toast.offsetHeight;

        setTimeout(() => {
            toast.classList.add('show');
            toastTimeout = setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    if (toast.parentNode) {
                        document.body.removeChild(toast);
                    }
                }, 300);
            }, 3000);
        }, 10);
    }

    function updateStrengthMeter(password) {
        const strength = calculatePasswordStrength(password);
        strengthEl.value = strength;
        strengthTextEl.textContent = getStrengthText(strength);
        strengthEl.style.setProperty('--strength-color', getStrengthColor(strength));
    }

    function calculatePasswordStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength += 20;
        if (password.length >= 12) strength += 20;
        if (/[A-Z]/.test(password)) strength += 20;
        if (/[a-z]/.test(password)) strength += 20;
        if (/[0-9]/.test(password)) strength += 20;
        if (/[^A-Za-z0-9]/.test(password)) strength += 20;
        return Math.min(strength, 100);
    }

    function getStrengthText(strength) {
        if (strength < 20) return 'Very Weak';
        if (strength < 40) return 'Weak';
        if (strength < 60) return 'Moderate';
        if (strength < 80) return 'Strong';
        return 'Very Strong';
    }

    function getStrengthColor(strength) {
        if (strength < 20) return '#ff4d4d';
        if (strength < 40) return '#ffa64d';
        if (strength < 60) return '#ffff4d';
        if (strength < 80) return '#4dff4d';
        return '#4d4dff';
    }

    // Here, I'm setting up the event listeners
    lengthEl.addEventListener('input', debounce(updateLengthValue, 300, true));
    generateBtn.addEventListener('click', generatePassword);
    copyBtn.addEventListener('click', copyToClipboard);
    [uppercaseEl, lowercaseEl, numbersEl, symbolsEl, excludeSimilarEl, excludeAmbiguousEl].forEach(el => {
        el.addEventListener('change', debounce(generatePassword, 100, true));
    });

    // Initialize the displayed password length and generate initial password
    updateLengthValue();
    const initialPassword = generatePasswordString();
    passwordEl.value = initialPassword;
    updateStrengthMeter(initialPassword);

    // Add responsiveness to the layout
    window.addEventListener('resize', () => {
        document.body.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    });
    window.dispatchEvent(new Event('resize'));

    // Animate checkboxes
    [uppercaseEl, lowercaseEl, numbersEl, symbolsEl].forEach(el => {
        el.addEventListener('change', function() {
            this.parentElement.style.animation = 'pulse 0.3s ease-out';
            setTimeout(() => {
                this.parentElement.style.animation = '';
            }, 300);
        });
    });

    // Animate generate button
    generateBtn.addEventListener('click', function() {
        this.style.animation = 'none';
        void this.offsetWidth; // Trigger reflow
        this.style.animation = 'sinkButton 0.3s ease-out';
    });

    // Customize the range input (password length slider)
    lengthEl.style.appearance = 'none';
    lengthEl.style.width = '100%';
    lengthEl.style.height = '8px';
    lengthEl.style.borderRadius = '5px';
    lengthEl.style.background = '#d3d3d3';
    lengthEl.style.outline = 'none';
    lengthEl.style.opacity = '0.7';
    lengthEl.style.transition = 'opacity .2s';

    lengthEl.addEventListener('mouseover', function() {
        this.style.opacity = '1';
    });

    lengthEl.addEventListener('mouseout', function() {
        this.style.opacity = '0.7';
    });

    lengthEl.addEventListener('input', function() {
        var value = (this.value - this.min) / (this.max - this.min) * 100;
        this.style.background = 'linear-gradient(to right, #4CAF50 0%, #4CAF50 ' + value + '%, #d3d3d3 ' + value + '%, #d3d3d3 100%)';
    });
});

// Created by Carlos (inivert)
