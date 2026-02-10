const axios = require('axios');

exports.getCountryByName = async (req, res) => {
  const countryName = req.params.name;

  try {
    const response = await axios.get(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
    const country = response.data[0];

    const result = {
      name: country.name.common,
      capital: country.capital?.[0] || 'N/A',
      currencies: Object.values(country.currencies || {}).map(c => c.name).join(', '),
      languages: Object.values(country.languages || {}).join(', '),
      flag: country.flags.svg
    };

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch country data', detail: err.message });
  }
};

exports.getAllCountries = async (req, res) => {
  try {
    const response = await axios.get('https://restcountries.com/v3.1/all');
    const data = response.data.map(country => ({
      name: country.name.common,
      capital: country.capital?.[0] || 'N/A',
      currencies: Object.values(country.currencies || {}).map(c => c.name).join(', '),
      languages: Object.values(country.languages || {}).join(', '),
      flag: country.flags.svg
    }));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch countries', detail: err.message });
  }
};