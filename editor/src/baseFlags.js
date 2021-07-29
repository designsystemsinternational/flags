import countries from "../data/countries-with-flag.json";
import countriesWithColors from "../data/countries-with-flag-and-colors.json";

const flags = {};

// converts the array of flags into an object
countries.forEach((country, i) => {
  const countryWithColors = countriesWithColors.find(
    (c) => c.name === country.name
  );
  country.colors = country.colors ?? countryWithColors?.colors ?? [];
  flags[country.name] = country;
});
export default flags;
