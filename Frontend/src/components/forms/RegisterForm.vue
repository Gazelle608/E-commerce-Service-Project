<template>
    <div class="page">
        <div class="card">
            <!-- left-side -->
             <div class="left">
                <div class="star">✈️</div>

                <div class="left-text">
                    <p class="small">Join the adventure</p>
                    <h2>Create your account and start exploring the unknown</h2>
                    <div class="feature-list">
                        <div class="feature-item">
                            <span class="feature-icon">🌍</span>
                            <span>Access to 50+ global destinations</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">🎁</span>
                            <span>Mystery bundles from R799</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">🚫</span>
                            <span>Set your blacklist - we avoid it</span>
                        </div>
                    </div>
                </div>
             </div>
             <!-- left-side -->

             <!-- right-side -->
              <div class="right">
                <div class="form-container">
                    <div class="form-header">
                        <span class="plane-icon">✈️</span>
                        <h1>Create account</h1>
                        <p class="subtitle">Join <span class="brand">So Where To?</span> and start your mystery journey</p>
                    </div>

                    <!-- form -->
                     <form @submit.prevent="submitForm">
                        <div class="form-row">
                            <div class="form-group half">
                                <label>First name</label>
                                <div class="input-wrapper">
                                    <span class="input-icon">👤</span>
                                    <input type="text" v-model="firstName" placeholder="Tim" required/>
                                </div>
                            </div>

                            <div class="form-group half">
                                <label>Last Name</label>
                                <div class="input-wrapper">
                                    <span class="input-icon">👤</span>
                                    <input type="text" v-model="lastName" placeholder="Bradford" required/>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Email</label>
                            <div class="input-wrapper">
                                <span class="input-icon">📧</span>
                                <input type="email" v-model="email" placeholder="tim.b@gmail.com" required/>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Password</label>
                            <div class="input-wrapper">
                                <span class="input-icon">🔒</span>
                                <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Create a password" required/>
                                <button type="button" class="password-toggle" @click="showPassword = !showPassword">
                                    {{ showPassword ? '👁️' : '👁️‍🗨️' }}
                                </button>
                            </div>
                            <div class="password-strength" v-if="password">
                                <div class="strength-bar" :class="passwordStrengthClass"></div>
                                <span class="strength-text">{{ passwordStrengthText }}</span>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Confirm password</label>
                            <div class="input-wrapper">
                                <span class="input-icon">🔒</span>
                                <input :type="showConfirmPassword ? 'text' : 'password'" v-model="confirmPassword" placeholder="Confirm your password" required/>
                                <button type="button" class="password-toggle" @click="showConfirmPassword = !showConfirmPassword">
                                    {{ showConfirmPassword ? '👁️' : '👁️‍🗨️' }}
                                </button>
                            </div>
                            <span v-if="confirmPassword && password !== confirmPassword" class="error-message">
                                ⚠️ Password don't match
                            </span>
                        </div>

                        <div class="form-group"> 
                            <label>Home city <span class="optional">(for departures)</span></label>
                            <div class="input-wrapper">
                                <span class="input-icon">🏙️</span>
                                <select v-model="homeCity" required>
                                    <option value="" disabled selected>Select your city</option>
                                    <option value="Johannesburg">Johannesburg</option>
                                    <option value="Cape Town">Cape Town</option>
                                    <option value="Durban">Durban</option>
                                    <option value="Pretoria">Pretoria</option>
                                    <option value="Port Elizabeth">Port Elizabeth</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Tell us where you WON'T go <span class="optional">(optional blacklist)</span></label>
                            <div class="input-wrapper">
                                <span class="input-icon">🚫</span>
                                <select v-model="blacklist" multiple size="3">
                                    <option value="Durban">Durban</option>
                                    <option value="Johannesburg">Johannesburg</option>
                                    <option value="Cape Town">Cape Town</option>
                                    <option value="Durban">Durban</option>
                                    <option value="Pretoria">Pretoria</option>
                                    <option value="Port Elizabeth">Port Elizabeth</option>
                                    <option value="Bloemfontein">Bloemfontein</option>
                                </select>
                            </div>
                            <p class="hint">Hold Ctrl/cmd to select multiple</p>
                        </div>

                        <div class="form-group terms">
                            <label class="checkbox-container">
                                <input type="checkbox" v-model="agreeTerms" required/>
                                <span class="checkmark"></span>
                                <span class="terms-text">
                                    I agree to the
                                    <a href="#" class="terms-link">Terms of Services</a> and 
                                    <a href="#" class="terms-link">Privacy Policy</a>
                                </span>
                            </label>
                        </div>

                        <div class="form-group terms">
                            <label class="checkbox-container">
                                <input type="checkbox" v-model="subscribeNewsletter"/>
                                <span class="checkmark"></span>
                                <span class="terms-text">
                                    Send me mystery deals and travel inspiration (optional)
                                </span>
                            </label>
                        </div>

                        <button type="submit" class="primary-btn" :disabled="!isFormValid || loading">
                            <span v-if="loading" class="spinner"></span>
                            <span v-else>Create Account & Start Exploring</span>
                        </button>
                     </form>

                     <div class="divider">
                        <span>or sign up with</span>
                     </div>

                      <div class="socials">
                        <button class="social-btn google" :disabled="loading">
                            <span class="social-icon">G</span>
                            <span>Google</span>
                        </button>
                        <button class="social-btn facebook" :disabled="loading">
                            <span class="social-icon">f</span>
                            <span>Facebook</span>
                        </button>
                        <button class="social-btn apple" :disabled="loading">
                            <span class="social-icon">🍎</span>
                            <span>Apple</span>
                        </button>
                     </div>

                     <p class="login-text">
                        Already have an account?
                        <router-link to="/login" class="login-link">Sign in</router-link>
                     </p>

                     <!-- form -->
                </div>
            </div>
            <!-- right-side -->
        </div>
    </div>
</template>

<script>
export default{
    name: "RegisterForm",
    data() {
        return {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            homeCity: "",
            blacklist: [],
            agreeTerms: false,
            subscribeNewsletter: false,
            showPassword: false,
            showConfirmPassword: false,
            loading: false
        };
    },
    computed: {
        passwordStrength() {
            if (!this.password) return 0;
            let strength = 0;
            if (this.password.length >= 8) strength += 25;
            if (this.password.match(/[a-z]/)) strength += 25;
            if (this.password.match(/[A-Z]/)) strength += 25;
            if (this.password.match(/[0-9!@#$%^&*]/)) strength += 25;
            return strength;
        },
        passwordStrengthClass() {
            if (this.passwordStrength <= 25) return 'weak';
            if (this.passwordStrength <= 50) return 'fair';
            if (this.passwordStrength <= 75) return 'good';
            return 'strong';
        },
        passwordStrengthText() {
            if (this.passwordStrength <= 25) return 'Weak';
            if (this.passwordStrength <= 50) return 'Fair';
            if (this.passwordStrength <= 75) return 'Good';
            return 'Strong';
        },
        isFormValid() {
            return this.firstName && 
                   this.lastName && 
                   this.email && 
                   this.password && 
                   this.confirmPassword && 
                   this.password === this.confirmPassword &&
                   this.homeCity &&
                   this.agreeTerms;
        }
    },
    methods: {
        submitForm() {
            this.loading = true;
            
            // Simulate API call
            setTimeout(() => {
                console.log("Registration attempt:", {
                    firstName: this.firstName,
                    lastName: this.lastName,
                    email: this.email,
                    password: this.password,
                    homeCity: this.homeCity,
                    blacklist: this.blacklist,
                    subscribeNewsletter: this.subscribeNewsletter
                });
                
                this.loading = false;
            }, 1500);
        }
    }
};
</script>

<style scoped>
:root {
    --primary: #FF6B6B;
    --primary-dark: #FF5252;
    --primary-light: #FFB5B5;
    --secondary: #4A6FA5;
    --secondary-dark: #3A5A84;
    --secondary-light: #7A9BC2;
    --accent: #9B6B9E;
    --accent-light: #C4A0C5;
    --white: #F9F9F9;
    --white-pure: #FFFFFF;
    --gray-light: #E0E0E0;
    --gray: #999999;
    --gray-dark: #666666;
    --text: #333333;
    --text-dark: #222222;
    --success: #28A745;
    --error: #DC3545;
    --warning: #FFC107;
    --gradient-adventure: linear-gradient(135deg, #FF6B6B 0%, #4A6FA5 100%);
    --gradient-mystery: linear-gradient(135deg, #9B6B9E 0%, #4A6FA5 100%);
    --shadow-sm: 0 2px 4px rgba(0,0,0,0.1);
    --shadow-md: 0 5px 15px rgba(0,0,0,0.1);
    --shadow-lg: 0 10px 30px rgba(0,0,0,0.15);
    --radius-sm: 5px;
    --radius-md: 10px;
    --radius-lg: 20px;
    --radius-full: 9999px;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.page {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--white);
    padding: 20px;
    position: relative;
    overflow: hidden;
}

/* Background decoration */
.page::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100%;
    height: 100%;
    background: var(--gradient-adventure);
    opacity: 0.05;
    border-radius: 50%;
    transform: rotate(45deg);
    pointer-events: none;
}

.page::after {
    content: '';
    position: absolute;
    bottom: -50%;
    left: -50%;
    width: 100%;
    height: 100%;
    background: var(--gradient-mystery);
    opacity: 0.05;
    border-radius: 50%;
    transform: rotate(15deg);
    pointer-events: none;
}

.card {
    display: flex;
    max-width: 1200px;
    width: 100%;
    background: var(--white-pure);
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-lg);
    position: relative;
    z-index: 1;
    animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* ===== LEFT SIDE ===== */
.left {
    flex: 1;
    background: var(--gradient-adventure);
    padding: 50px 40px;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
}

.left::before {
    content: '✈️';
    position: absolute;
    bottom: -50px;
    right: -50px;
    font-size: 200px;
    opacity: 0.1;
    transform: rotate(-15deg);
    pointer-events: none;
}

.star {
    font-size: 3rem;
    margin-bottom: 30px;
    animation: float 3s ease-in-out infinite;
}

@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

.left-text {
    color: white;
    position: relative;
    z-index: 2;
}

.small {
    font-size: 1.1rem;
    opacity: 0.9;
    margin-bottom: 15px;
    letter-spacing: 1px;
    text-transform: uppercase;
}

.left-text h2 {
    font-size: 2rem;
    line-height: 1.3;
    margin-bottom: 40px;
    font-weight: 700;
    color: white;
    text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.feature-list {
    margin-top: 30px;
}

.feature-item {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;
    padding: 10px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: var(--radius-full);
    backdrop-filter: blur(5px);
    animation: slideIn 0.5s ease-out forwards;
    opacity: 0;
    transform: translateX(-20px);
}

.feature-item:nth-child(1) { animation-delay: 0.2s; }
.feature-item:nth-child(2) { animation-delay: 0.4s; }
.feature-item:nth-child(3) { animation-delay: 0.6s; }
.feature-item:nth-child(4) { animation-delay: 0.8s; }

@keyframes slideIn {
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.feature-icon {
    font-size: 1.5rem;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.2);
    border-radius: var(--radius-full);
}

.feature-item span:last-child {
    color: white;
    font-weight: 500;
}

/* ===== RIGHT SIDE ==== = */
.right {
    flex: 1;
    padding: 40px;
    background: var(--white-pure);
    display: flex;
    align-items: center;
    max-height: 90vh;
    overflow-y: auto;
}

/* Custom scrollbar */
.right::-webkit-scrollbar {
    width: 8px;
}

.right::-webkit-scrollbar-track {
    background: var(--gray-light);
    border-radius: var(--radius-full);
}

.right::-webkit-scrollbar-thumb {
    background: var(--primary);
    border-radius: var(--radius-full);
}

.right::-webkit-scrollbar-thumb:hover {
    background: var(--primary-dark);
}

.form-container {
    width: 100%;
    max-width: 450px;
    margin: 0 auto;
}

.form-header {
    text-align: center;
    margin-bottom: 30px;
}

.plane-icon {
    font-size: 2.5rem;
    display: inline-block;
    margin-bottom: 15px;
    animation: float 3s ease-in-out infinite;
}

.form-header h1 {
    font-size: 2.2rem;
    color: var(--text-dark);
    margin-bottom: 10px;
    font-weight: 700;
}

.subtitle {
    color: var(--gray);
    font-size: 1rem;
    line-height: 1.5;
}

.brand {
    color: var(--primary);
    font-weight: 600;
    position: relative;
    display: inline-block;
}

.brand::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background: var(--gradient-adventure);
    border-radius: var(--radius-full);
    transform: scaleX(0);
    transition: transform 0.3s;
}

.brand:hover::after {
    transform: scaleX(1);
}

/* Form Styles */
.form-row {
    display: flex;
    gap: 15px;
    margin-bottom: 5px;
}

.form-group {
    margin-bottom: 20px;
}

.form-group.half {
    flex: 1;
}

label {
    display: block;
    margin-bottom: 6px;
    color: var(--text);
    font-weight: 500;
    font-size: 0.9rem;
}

.optional {
    color: var(--gray);
    font-weight: 400;
    font-size: 0.85rem;
}

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.input-icon {
    position: absolute;
    left: 12px;
    color: var(--gray);
    font-size: 1.1rem;
    z-index: 1;
}

input, select {
    width: 100%;
    padding: 12px 12px 12px 40px;
    border: 2px solid var(--gray-light);
    border-radius: var(--radius-md);
    font-size: 0.95rem;
    transition: all 0.3s;
    background: var(--white);
    color: var(--text);
}

select {
    padding: 12px 12px 12px 40px;
    appearance: none;
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 16px;
}

select[multiple] {
    background-image: none;
    padding: 8px;
    min-height: 100px;
}

select[multiple] option {
    padding: 8px 12px;
    border-radius: var(--radius-sm);
}

select[multiple] option:checked {
    background: var(--primary) linear-gradient(0deg, var(--primary) 0%, var(--primary) 100%);
    color: white;
}

input:focus, select:focus {
    border-color: var(--primary);
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
}

input:hover, select:hover {
    border-color: var(--secondary-light);
}

input::placeholder {
    color: var(--gray);
    opacity: 0.7;
}

/* Password toggle */
.password-toggle {
    position: absolute;
    right: 12px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    padding: 0;
    color: var(--gray);
    transition: color 0.3s;
}

.password-toggle:hover {
    color: var(--primary);
}

/* Password strength */
.password-strength {
    margin-top: 8px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.strength-bar {
    height: 4px;
    width: 100px;
    background: var(--gray-light);
    border-radius: var(--radius-full);
    overflow: hidden;
    position: relative;
}

.strength-bar::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 0;
    transition: width 0.3s, background 0.3s;
}

.strength-bar.weak::before {
    width: 25%;
    background: var(--error);
}

.strength-bar.fair::before {
    width: 50%;
    background: var(--warning);
}

.strength-bar.good::before {
    width: 75%;
    background: var(--secondary);
}

.strength-bar.strong::before {
    width: 100%;
    background: var(--success);
}

.strength-text {
    font-size: 0.85rem;
    color: var(--gray);
}

/* Error message */
.error-message {
    display: block;
    margin-top: 5px;
    color: var(--error);
    font-size: 0.85rem;
    animation: shake 0.5s ease-in-out;
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}

/* Hint text */
.hint {
    margin-top: 5px;
    color: var(--gray);
    font-size: 0.8rem;
    font-style: italic;
}

/* Terms and Conditions */
.terms {
    margin-bottom: 15px;
}

.checkbox-container {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    cursor: pointer;
    user-select: none;
    position: relative;
    padding-left: 25px;
}

.checkbox-container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
}

.checkmark {
    position: absolute;
    left: 0;
    top: 2px;
    height: 18px;
    width: 18px;
    background-color: var(--white);
    border: 2px solid var(--gray-light);
    border-radius: 4px;
    transition: all 0.3s;
}

.checkbox-container:hover input ~ .checkmark {
    border-color: var(--primary);
}

.checkbox-container input:checked ~ .checkmark {
    background: var(--primary);
    border-color: var(--primary);
}

.checkmark:after {
    content: "";
    position: absolute;
    display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
    display: block;
}

.checkbox-container .checkmark:after {
    left: 5px;
    top: 1px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
}

.terms-text, .terms-link {
    font-size: 0.9rem;
    line-height: 1.4;
}

.terms-link {
    color: var(--primary);
    text-decoration: none;
    transition: color 0.3s;
}

.terms-link:hover {
    color: var(--primary-dark);
    text-decoration: underline;
}

/* Primary Button */
.primary-btn {
    width: 100%;
    padding: 14px;
    background: var(--gradient-adventure);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
    margin-top: 10px;
}

.primary-btn:not(:disabled)::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
}

.primary-btn:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(255, 107, 107, 0.4);
}

.primary-btn:not(:disabled):hover::before {
    width: 300px;
    height: 300px;
}

.primary-btn:not(:disabled):active {
    transform: translateY(0);
}

.primary-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Loading spinner */
.spinner {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

/* Divider */
.divider {
    margin: 25px 0 20px;
    text-align: center;
    position: relative;
}

.divider::before,
.divider::after {
    content: '';
    position: absolute;
    top: 50%;
    width: calc(50% - 70px);
    height: 1px;
    background: var(--gray-light);
}

.divider::before {
    left: 0;
}

.divider::after {
    right: 0;
}

.divider span {
    background: var(--white-pure);
    padding: 0 15px;
    color: var(--gray);
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 1px;
}

/* Social Buttons */
.socials {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
}

.social-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px;
    border: 2px solid var(--gray-light);
    border-radius: var(--radius-md);
    background: var(--white-pure);
    color: var(--text);
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
}

.social-btn:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.social-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.social-btn.google:not(:disabled):hover {
    border-color: #DB4437;
    color: #DB4437;
}

.social-btn.facebook:not(:disabled):hover {
    border-color: #4267B2;
    color: #4267B2;
}

.social-btn.apple:not(:disabled):hover {
    border-color: #000000;
    color: #000000;
}

.social-icon {
    font-size: 1.1rem;
    font-weight: bold;
}

/* Login Text */
.login-text {
    text-align: center;
    color: var(--gray);
    font-size: 0.9rem;
}

.login-link {
    color: var(--primary);
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    margin-left: 5px;
    transition: color 0.3s;
}

.login-link:hover {
    color: var(--primary-dark);
    text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 1024px) {
    .card {
        max-width: 900px;
    }
    
    .left-text h2 {
        font-size: 1.8rem;
    }
}

@media (max-width: 968px) {
    .card {
        flex-direction: column;
        max-width: 600px;
    }
    
    .left {
        padding: 40px 30px;
    }
    
    .left-text h2 {
        font-size: 1.8rem;
    }
    
    .right {
        padding: 30px;
        max-height: none;
        overflow-y: visible;
    }
}

@media (max-width: 480px) {
    .page {
        padding: 10px;
    }
    
    .left {
        padding: 30px 20px;
    }
    
    .right {
        padding: 25px 20px;
    }
    
    .form-header h1 {
        font-size: 1.8rem;
    }
    
    .form-row {
        flex-direction: column;
        gap: 0;
    }
    
    .socials {
        flex-direction: column;
    }
    
    .feature-item {
        padding: 8px;
    }
    
    .feature-icon {
        width: 35px;
        height: 35px;
        font-size: 1.2rem;
    }
}
</style>