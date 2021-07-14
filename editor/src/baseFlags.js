import countries from "../data/countries-with-flag.json";
import countriesWithColors from "../data/countries-with-flag-and-colors.json";

countries.forEach((country, i) => {
  const countryWithColors = countriesWithColors.find(
    (c) => c.name === country.name
  );
  country.colors = country.colors ?? countryWithColors?.colors ?? [];
});
export default countries;
