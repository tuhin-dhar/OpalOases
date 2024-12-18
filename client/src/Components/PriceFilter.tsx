type Props = {
  selectedPrice?: number;
  onChange: (value?: number) => void;
};

const PriceFilter = ({ selectedPrice, onChange }: Props) => {
  return (
    <div className="">
      <h4 className="text-md font-semibold mb-2">Max Price</h4>
      <select
        className="p-2 border rounded-md w-full"
        value={selectedPrice}
        onChange={(event) =>
          onChange(
            event.target.value ? parseInt(event.target.value) : undefined
          )
        }
      >
        <option value="">Select Max Price</option>
        {[
          1000, 2000, 3000, 4000, 5000, 7500, 10000, 15000, 20000, 50000,
          100000,
        ].map((price) => (
          <option value={price}>{price}</option>
        ))}
      </select>
    </div>
  );
};

export default PriceFilter;
