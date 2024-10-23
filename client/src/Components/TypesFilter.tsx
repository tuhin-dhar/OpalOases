import { hotelTypes } from "../config/hotel-option-config";

type Props = {
  selectedTypes: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const TypesFilter = ({ selectedTypes, onChange }: Props) => {
  return (
    <div className="border-b border-slate-300 pb-5 ">
      <h4 className="text-md font-semibold mb-2">Property Type</h4>
      {hotelTypes.map((type) => (
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            value={type}
            className="rounded"
            checked={selectedTypes.includes(type)}
            onChange={onChange}
          />
          <span>{type}</span>
        </label>
      ))}
    </div>
  );
};

export default TypesFilter;
