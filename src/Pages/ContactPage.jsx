import React, { useState } from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';
import Header from '../Component/Header';
import Sidebar from '../Component/Sidebar';

// Let's first define our styles - I'll explain each section in detail
const styles = {
    // The main wrapper style encompasses the entire contact page
    wrapper: `
    .contact-page {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background-color: #fff;
    }
  `,

    // Header styles create the distinctive red gradient banner
    header: `
    .contact-header {
      position: relative;
      height: 200px;
    background:url(https://portal.survill.com/banner/contact.jpg);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 50% 60%;    
      overflow: hidden;
    }

    .contact-header__pattern {
      position: absolute;
      inset: 0;
      opacity: 0.3;
      background-size: 20px 20px;
    }

    .contact-header__content {
      position: relative;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      height: 100%;
      display: flex;
      align-items: center;
    }

    .contact-header__title {
      color: white;
      font-size: 3rem;
      font-weight: 400;
    }
  `,

    // Main content layout styles
    content: `
    .contact-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 48px 24px;
      display: grid;
      gap: 48px;
    }

    @media (min-width: 768px) {
      .contact-content {
        grid-template-columns: 1fr 1fr;
      }
    }
  `,

    // Info section styles for the left column
    info: `
  .contact-info__section-box{
   display: flex;
      flex-direction: row;
      flex-wrap:wrap;
          justify-content: space-between;

  }
    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .contact-info__heading {
      font-size: 3.5rem;
      font-weight: 400;
      margin-bottom: 16px;
      color: #1a1a1a;
      width:95%;
    }

    .contact-info__subtext {
      color: #666;
      margin-bottom: 32px;
      line-height: 1.6;
            width:80%;

    }

    .contact-info__section {
      margin-bottom: 24px;
      width:45%;
    }

    .contact-info__label {
      font-weight: 600;
      margin-bottom: 16px;
      color: #1a1a1a;
    }

    .contact-info__detail {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
      margin-bottom: 4px;
    }

    .contact-info__social {
      display: flex;
      gap: 16px;
    }

    .contact-info__social-icon {
      color: #666;
      transition: color 0.2s ease;
    }

    .contact-info__social-icon:hover {
      color: #1a1a1a;
    }
  `,

    // Form styles for the right column
    form: `
    .contact-form {
      background:rgb(239, 239, 239);
      padding: 32px 0;
      border-radius: 14px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      display:flex;
      flex-direction:column;
      align-items:center;
      justify-items:center;
    }


    .contact-form__title {
      font-size:2rem;
      font-weight: 400;
      margin-bottom: 20px;
      color: #1a1a1a;
      width:70%;
    }
      .contact-form__subtitle{
       width:70%;
             font-weight: 400;
             margin:0 0 20px ;
             font-size:0.9rem;


      }
.contact-form form{
      display:flex;
      flex-direction:column;
      align-items:start;
      justify-items:center;
      width:70%;
}
    .contact-form__group {
      margin-bottom: 24px;
      width:100%;
    }

    .contact-form__input {
      padding: 12px 0px;
      border: none;
      background:transparent;
      border-bottom: 0.5px solid  rgba(0,0,0,0.2);

      transition: all 0.2s ease;
      font-size: 1rem;
            width:100%;

    }

    .contact-form__input:focus {
      outline: none;
      border-color:none;
      box-shadow: 0 0 0 3px rgba(255,0,0,0.1);
    }

    .contact-form__textarea {
      min-height: 80px;
      resize: none;
            width:100%;

    }

    .contact-form__button {
      background-color: #1a1a1a;
      color: white;
      padding: 15px 24px;
      border-radius: 25px;
      border: none;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s ease;
      
    }

    .contact-form__button:hover {
      background-color: #333;
    }
      @media (max-width: 768px) {
      .contact-header{
      height:25vh;
      

      }
      .contact-content{
      padding: 25px 15px
      }
.contact-info__heading {
    font-size: 3rem;
   
    margin-top: 0;
}
    .contact-header__content{
    align-items:end;
    }
    .contact-form__title,.contact-form__subtitle, .contact-form form{
    width:85%;
    }
    .contact-header__title {
        margin-bottom: 10px;
    font-size: 2.5rem;



}

}
  `
};

// Combine all styles
const combinedStyles = Object.values(styles).join('\n');

const ContactPage = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <>
            <div className="dashboard-container">
                {/* Sidebar */}
               

                {/* Main Content */}
                <main className="main-content">
                    {/* Top bar / search / timeframe */}
                   
                    {/* Inject our styles */}
                    <style>{combinedStyles}</style>

                    <div className="contact-page">
                        {/* Header Section */}
                        <header className="contact-header">
                            <div className="contact-header__pattern" />
                            <div className="contact-header__content">
                                <h1 className="contact-header__title">Contact Us</h1>
                            </div>
                        </header>

                        {/* Main Content */}
                        <main className="contact-content">
                            {/* Contact Information */}
                            <div className="contact-info">
                                <div>
                                    <h2 className="contact-info__heading">
                                        We are always ready to help you and answer your questions
                                    </h2>
                                    <p className="contact-info__subtext">
                                        Define your goals and identify areas where AI can add value to your business
                                    </p>
                                </div>

                                <div className='contact-info__section-box'>
                                    <div className="contact-info__section">
                                        <h3 className="contact-info__label">Call Center</h3>
                                        <div className="contact-info__detail">
                                            <Phone size={16} />
                                            <span>+1 (253) 362-3578</span>
                                        </div>
                                        <div className="contact-info__detail">
                                            <Phone size={16} />
                                            <span>+1  (206) 208-0809</span>
                                        </div>
                                    </div>

                                    <div className="contact-info__section">
                                        <h3 className="contact-info__label">Our Location</h3>
                                        <div className="contact-info__detail">
                                            <MapPin size={16} />
                                            <span>312 W 2nd St #5196</span>
                                        </div>
                                        <div className="contact-info__detail">
                                            <MapPin size={16} />
                                            <span>Casper, WY, US 82601</span>
                                        </div>
                                    </div>

                                    <div className="contact-info__section">
                                        <h3 className="contact-info__label">Email</h3>
                                        <div className="contact-info__detail">
                                            <Mail size={16} />
                                            <span> operations@survill.com</span>
                                        </div>
                                    </div>

                                    <div className="contact-info__section">
                                        <h3 className="contact-info__label">Social network</h3>
                                        <div className="contact-info__social">
                                            <Facebook className="contact-info__social-icon" size={20} />
                                            <Twitter className="contact-info__social-icon" size={20} />
                                            <Linkedin className="contact-info__social-icon" size={20} />
                                            <Youtube className="contact-info__social-icon" size={20} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Form */}
                            <div className="contact-form">
                                <h3 className="contact-form__title">Get in Touch</h3>
                                <p className="contact-form__subtitle">
                                    Define your goals and identify areas where AI can add value to your business
                                </p>
                                <form onSubmit={handleSubmit}>
                                    <div className="contact-form__group">
                                        <input
                                            type="text"
                                            name="fullName"
                                            placeholder="Full name"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className="contact-form__input"
                                        />
                                    </div>
                                    <div className="contact-form__group">
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="contact-form__input"
                                        />
                                    </div>
                                    <div className="contact-form__group">
                                        <input
                                            type="text"
                                            name="subject"
                                            placeholder="Subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="contact-form__input"
                                        />
                                    </div>
                                    <div className="contact-form__group">
                                        <textarea
                                            name="message"
                                            placeholder="Message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            className="contact-form__input contact-form__textarea"
                                        ></textarea>
                                    </div>
                                    <button type="submit" className="contact-form__button">
                                        Send a message
                                    </button>
                                </form>
                            </div>
                        </main>
                    </div>
                </main>
            </div>
        </>
    );
};

export default ContactPage;