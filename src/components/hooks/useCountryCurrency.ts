import { useAppSelector } from "../../redux";
import { selectCountryList } from "../../redux/meta/selector";
import { CountryListProps } from "../../utils/types/responseType";

export const useCountryCurrency = () => {
  const countryList = useAppSelector(selectCountryList);
  const countryData = countryList?.find((i: CountryListProps) => {
    return i.title == "Japan";
  });

  return countryData?.currencySymbol;
};
