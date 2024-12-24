import { useState, useEffect } from "react";
import axios from "axios";

import "./App.css";

const App = () => {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    amount: "1",
  });

  const [result, setResult] = useState(null);
  const [codes, setCodes] = useState([]);
  const [error, setError] = useState("");

  const fetchCodes = async () => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_API_URL}/api/codes`;
      const response = await axios.get(url);
      setCodes(response?.data.results.supported_codes);
      setError("");
    } catch (error) {
      setError(
        "Error",
        error?.response ? error?.response?.data : error?.message
      );
    }
  };

  useEffect(() => {
    fetchCodes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Http request
    try {
      const url = `${import.meta.env.VITE_BACKEND_API_URL}/api/convert`;
      const newFormData = {
        from: formData.from.split(",")[0],
        to: formData.to.split(",")[0],
        amount: formData.amount,
      };
      const response = await axios.post(url, newFormData);
      setResult(response?.data);
      setError("");
    } catch (error) {
      setError(
        "Error",
        error?.response ? error?.response?.data : error?.message
      );
    }
  };

  return (
    <div className="container">
      <h1>Currency Converter</h1>
      <form className="converter-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Amount:</label>
          <input
            type="number"
            value={formData.amount}
            onChange={handleChange}
            name="amount"
          />
        </div>

        <div className="form-group">
          <label>From:</label>
          <select
            value={formData.from}
            onChange={handleChange}
            name="from"
            required
          >
            <option value="" disabled>
              Choose Currency
            </option>
            {codes.map((code) => (
              <option key={code} value={code}>
                {code[0]} - {code}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>To:</label>
          <select
            value={formData.to}
            onChange={handleChange}
            name="to"
            required
          >
            <option value="" disabled>
              Choose Currency
            </option>
            {codes.map((code) => (
              <option key={code} value={code}>
                {code[0]} - {code}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="convert-button">
          Convert
        </button>
      </form>

      {result && (
        <div className="result">
          <p>
            Converted Amount: {formData.amount} {result.results.base_code} ={" "}
            {result.results.conversion_result} {result.results.target_code}
          </p>
          <p>
            Coversion Rate: 1 {result.results.base_code} ={" "}
            {result.results.conversion_rate} {result.results.target_code}
          </p>
        </div>
      )}
      {error && <p className="error">Error: {error}</p>}
    </div>
  );
};

export default App;
