const Filter = ({ value, onChange }) => {
  return (
    <div>
      filter: <input value={value} onChange={onChange} type="text" />
    </div>
  );
};
export default Filter;
