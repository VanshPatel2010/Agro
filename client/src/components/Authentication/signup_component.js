import React, { useState } from "react";
import bcrypt from "bcryptjs";
import "./signup.css";
const STATIC_SALT = "$2a$10$abcdefghijklmnopqrstuv"; // Example static salt

// This is a functional component using React Hooks.
export default function SignUp() {
  // --- State Management with useState Hooks ---
  const [name, setName] = useState("");
  const [mobilenum, setMobilenum] = useState("");
  const [adharnum, setAdharnum] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [category, setCategory] = useState("");
  const [physicalHandicap, setPhysicalHandicap] = useState("");
  const [qualification, setQualification] = useState("");
  const [dateofbirth, setDateofbirth] = useState("");
  const [rationcardcategory, setRationcardcategory] = useState("");
  const [rationcardnum, setRationcardnum] = useState("");
  const [state] = useState("Gujarat");
  const [district, setDistrict] = useState("");
  const [taluka, setTaluka] = useState("");
  const [village, setVillage] = useState("");
  const [address, setAddress] = useState("");
  const [contractFarming, setContractFarming] = useState("No");
  const [pincode, setPincode] = useState("");
  const [bankname, setBankname] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [accountnum, setAccountnum] = useState("");
  const [confirmpass, setConfirmpass] = useState("");

  // UI State
  const [districtdata, setDistrictdata] = useState([]);
  const [talukadata, setTalukadata] = useState([]);

  // Alert States for password validation
  const [alertbox3, setAlertbox3] = useState(false); // Passwords do not match
  const [alertbox4, setAlertbox4] = useState(false); // Password not strong


  // --- Event Handlers ---

  const handleSubmit = (e) => {
    e.preventDefault();

    // Client-side password validation
    if (password !== confirmpass) {
      setAlertbox3(true);
      return;
    } else {
      setAlertbox3(false);
    }

    if (!password.match(`^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$`)) {
      setAlertbox4(true);
      return;
    } else {
      setAlertbox4(false);
    }

    const hashedPassword = bcrypt.hashSync(password, STATIC_SALT);

    const formData = {
      Name: name, Password: hashedPassword, Mobilenum: mobilenum, Email: email, Gender: gender,
      Category: category, Qualification: qualification, Physical_handicap: physicalHandicap,
      Dateofbirth: dateofbirth, Adharnum: adharnum, Rationcardcategory: rationcardcategory,
      Rationcardnum: rationcardnum, State: state, District: district, Taluka: taluka,
      Village: village, Contract_Farming: contractFarming, Pincode: pincode,
      Address: address, Bankname: bankname, IFSC: ifsc, Accountnum: accountnum,
    };

    console.log("Submitting form data:", formData);

    fetch("http://localhost:8000/farmer/farmersignup", {
      method: "POST", crossDomain: true,
      headers: { "Content-Type": "application/json", Accept: "application/json", "Access-Control-Allow-Origin": "*", },
      body: JSON.stringify(formData),
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "ok") {
        console.log("User Registered Successfully:", data);
        // display Farmerid in alert box
        alert(`Registration Successful! Your Farmer ID is: ${data.Farmerid}`);
        window.location.href = "./aftersignup";
      } else {
        console.error("Registration Error:", data);
        alert(data.error || "An unknown error occurred.");
      }
    })
    .catch(err => console.error("Fetch Error:", err));
  };

  const handleDistrict = async (e) => {
    const selectedDistrict = e.target.value;
    setDistrict(selectedDistrict);
    try {
      const response = await fetch(`http://localhost:8000/District/${selectedDistrict}`);
      const data = await response.json();
      setDistrictdata(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleTaluka = async (e) => {
    const selectedTaluka = e.target.value;
    setTaluka(selectedTaluka);
    try {
      const response = await fetch(`http://localhost:8000/District/${district}/${selectedTaluka}`);
      const data = await response.json();
      setTalukadata(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleContractFarmingChange = (e) => {
    const value = e.target.value;
    setContractFarming(value);
    if (value === "Yes") {
      window.alert("Your Personal Information will be shared with private companies, do you agree?");
    }
  };

  // --- JSX (Return Statement) ---
  return (
    <div className="auth-wrapper_signup">
      <div className="auth-inner_signup">
        <form onSubmit={handleSubmit}>
          <h3 className="justtest" style={{ fontFamily: "monospace" }}>Farmer Registration Form</h3>
          <hr />

          <h5 className="Smaintitle">Personal Information</h5>
          <div className="FnameSignup">
            <label>Full name</label>
            <input type="text" className="form-control" placeholder="Enter your full name" onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="Compdivsignup">
            <label>Gender</label>
            <select className="form-control" onChange={(e) => setGender(e.target.value)}>
              <option value="">Select your gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div className="Compdivsignup">
            <label>Category </label>
            <select className="form-control" onChange={(e) => setCategory(e.target.value)} >
              <option value="">Select your Category</option>
              <option>GENERAL</option>
              <option>EWS</option>
              <option>OBC</option>
              <option>SC</option>
              <option>ST</option>
            </select>
          </div>
          <div className="Compdivsignup">
            <label>Physical handicap</label>
            <select className="form-control" onChange={(e) => setPhysicalHandicap(e.target.value)} >
              <option value="">Select disability</option>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>
          <div className="Compdivsignup">
            <label>Qualification </label>
            <select className="form-control" onChange={(e) => setQualification(e.target.value)} >
              <option value="">Select your Qualification</option>
              <option>Graduation</option>
              <option value={"HSC"}>Higher secondary (12th Passed)</option>
              <option value={"SSC"}>Secondary (10th Passed)</option>
              <option>Primary</option>
              <option>None</option>
            </select>
          </div>
          <div style={{ marginTop: "20px" }}>
            <div className="Compdivsignup">
              <label>Date Of Birth </label>
              <input type="date" className="form-control" onChange={(e) => setDateofbirth(e.target.value)} />
            </div>
            <div className="Compdivsignup">
              <label> Ration Card Category </label>
              <select className="form-control" onChange={(e) => setRationcardcategory(e.target.value)} >
                <option value="">Select your RationCard Category </option>
                <option value={"APL"}>Above Poverty Line (APL)</option>
                <option value={"BPL"}>Below Poverty Line (BPL)</option>
                <option value={"AY"}>Annapoorna Yojana (AY)</option>
              </select>
            </div>
            <div className="Compdivsignup">
              <label>Ration Card Number </label>
              <input type="number" className="form-control" placeholder="1967-425-5901" onChange={(e) => setRationcardnum(e.target.value)} />
            </div>
          </div>
          <br />
          <hr />

          <h4 className="Smaintitle">Farm location and other details</h4>
          <div className="Compdivsignup">
            <label>State</label>
            <input type="text" className="form-control" value={state} disabled />
          </div>
          <div className="Compdivsignup">
            <label>District</label>
            <select className="form-control" onChange={handleDistrict}>
              <option value="">Select your District</option>
              <option>Kachchh</option><option>Banas Kantha</option><option>Patan</option><option>Mahesana</option><option>Sabar Kantha</option><option>Gandhinagar</option><option>Ahmadabad</option><option>Surendranagar</option><option>Rajkot</option><option>Jamnagar</option><option>Porbandar</option><option>Junagadh</option><option>Amreli</option><option>Bhavnagar</option><option>Anand</option><option>Kheda</option><option>Panch Mahals</option><option>Dohad</option><option>Vadodara</option><option>Narmada</option><option>Bharuch</option><option>The Dangs</option><option>Navsari</option><option>Valsad</option><option>Surat</option><option>Tapi</option>
            </select>
          </div>
          <div className="Compdivsignup">
            <label>Taluka</label>
            <select className="form-control" onChange={handleTaluka}>
              <option>Select Taluka</option>
              {districtdata.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="Compdivsignup">
            <label>Village</label>
            <select className="form-control" onChange={(e) => setVillage(e.target.value)}>
              <option>Select Village</option>
              {talukadata.map((v) => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div className="Compdivsignup">
            <label>Pincode</label>
            <input type="text" className="form-control" placeholder="Enter Your Pincode" onChange={(e) => setPincode(e.target.value)} />
          </div>
          <div className="Compdivsignuptextarea">
            <label>Farmer Address</label>
            <textarea className="form-control" placeholder="Full Address" onChange={(e) => setAddress(e.target.value)} />
          </div>
          <br /><br />
          <hr />

          <h4 className="Smaintitle">Bank Details</h4>
          <div className="Compdivsignup">
            <label>Bank Name</label>
            <input type="text" className="form-control" placeholder="Enter Bank Name" onChange={(e) => setBankname(e.target.value)} />
          </div>
          <div className="Compdivsignup">
            <label>IFSC Code</label>
            <input type="text" className="form-control" placeholder="Enter IFSC code" onChange={(e) => setIfsc(e.target.value)} />
          </div>
          <div className="Compdivsignup">
            <label>Account Number</label>
            <input type="text" className="form-control" placeholder="Enter Account Number" onChange={(e) => setAccountnum(e.target.value)} />
          </div>
          <div className="Compdivsignup">
            <label>Confirm Account Number</label>
            <input type="text" className="form-control" placeholder="Confirm Account Number" />
          </div>
          <br /><br />
          <hr />

          <h4 className="Smaintitle">Authentication Details</h4>
          <div className="Compdivsignup">
            <div className="AdharcardnumSignup">
              <div className="mb-3" id="Adharenumberdiv">
                <label>Aadhar-Card</label>
                <input type="number" className="form-control" placeholder="Enter 12-digit Aadhar-Card Number" onChange={(e) => setAdharnum(e.target.value)} />
              </div>
            </div>
          </div>
          <div className="Compdivsignup">
            <div className="Mobilenummaindiv">
              <div className="MobilenumSignup" id="Adharenumberdiv">
                <label>Mobile</label>
                <input type="number" className="form-control" placeholder="Enter 10-digit Mobile Number" onChange={(e) => setMobilenum(e.target.value)} />
              </div>
            </div>
          </div>
          <div className="Compdivsignup">
            <div className="Emailmaindiv">
              <div className="EmailSignup" id="Adharenumberdiv">
                <label>Email</label>
                <input type="email" className="form-control" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
          </div>
          <br />
          
          <div className="Compdivsignup">
            <label>Are you interested in Contract Farming?</label>
            <select onChange={handleContractFarmingChange} className="form-control" value={contractFarming}>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          <div className="mb-3">
            <label>Create password</label>
            <input type="password" className="form-control" placeholder="Enter Password" onChange={(e) => setPassword(e.target.value)} required />
            {alertbox4 && <p style={{ color: "red" }}>Password is not strong.</p>}
          </div>

          <div className="mb-3">
            <label>Confirm Password</label>
            <input type="password" className="form-control" placeholder="Confirm Password" onChange={(e) => setConfirmpass(e.target.value)} required />
            {alertbox3 && <p style={{ color: "red" }}>Passwords do not match.</p>}
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">Sign Up</button>
          </div>
          <p className="forgot-password text-right">
            Already registered? <a href="/sign-in">Sign in</a>
          </p>
        </form>
      </div>
    </div>
  );
}