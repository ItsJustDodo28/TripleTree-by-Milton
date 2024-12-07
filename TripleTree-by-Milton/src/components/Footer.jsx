/* eslint-disable react/prop-types */
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";


function Fter(props) {

  return (
    <>
      <footer className='Footer'>
        <div>
          {props.children}
        </div>
        <div className="footer-container">
                {/* About Section */}
                <div className="about">
                    <h3>TripleTree by Milton</h3>
                    <p>
                        Delivering exceptional hospitality, blending luxury, comfort,
                        and unforgettable experiences across Egypt.
                    </p>
                </div>

                {/* Contact Section */}
                <div className="contact">
                    <h4>Contact Information</h4>
                    <p>Phone: +20 11 210 77522</p>
                    <p>Email: TripleTreeMainEmail@gmail.com</p>
                    <p>Address: 16 Ibrahim Sherif St, Alexandria, Egypt</p>
                </div>

                {/* Social Media Section */}
                <div className="social-media">
                    <h4>Follow Us</h4>
                    <div className="social-icons">
                        <a href="https://facebook.com" target="_blank" rel="noreferrer">
                            <FaFacebookF />
                        </a>
                        <span> TripleTreeFB</span>
                        <br />
                        <a href="https://instagram.com" target="_blank" rel="noreferrer">
                            <FaInstagram />
                        </a>
                        <span> TripleTreeIG</span>
                        <br />
                        <a href="https://twitter.com" target="_blank" rel="noreferrer">
                            <BsTwitterX  />
                        </a>
                        <span> TripleTreeX</span>
                        <br />
                        <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                            <FaLinkedinIn />
                        </a>
                        <span> TripleTreeLinkedIn</span>
                    </div>
                </div>

                {/* Legal Section */}
                <div className="legal">
                    <p>© 2024 TripleTree by Milton. All rights reserved.</p>
                    <p>
                        <a href="/privacy-policy">Privacy Policy</a> |{" "}
                        <a href="/terms">Terms & Conditions</a>
                    </p>
                </div>
            </div>
      </footer>
    </>
  );
}

export default Fter;