import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer id="footer" className="border-t text-sm">
      <div className="leftFooter">
        <h4>DOWNLOAD OUR APP</h4>
        <p>Download App for Android and IOS mobile phone</p>
        <img src={""} alt="playstore" />
        <img src={""} alt="Appstore" />
      </div>

      <div className="midFooter">
        <div className="flex justify-center items-center">
          <img
            className="h-20"
            src="https://apnabazaar.pk/wp-content/uploads/2022/06/image_2022_05_31T05_40_51_497Z.jpg"
            alt=""
          />
        </div>
        <p>High Quality is our first priority</p>

        <p>Copyrights 2021 &copy; MeAbhiSingh</p>
      </div>

      <div className="rightFooter">
        <h4>Follow Us</h4>
        <Link href="/">Instagram</Link>
        <Link href="">Youtube</Link>
        <Link href="">Facebook</Link>
      </div>
    </footer>
  );
};

export default Footer;
