export const styles = {
  option: (provided: any, state: { isSelected: any }) => ({
    ...provided,
    '&:hover': {
      backgroundColor: state.isSelected ? '#6044d0' : '#eee',
    },
    backgroundColor: state.isSelected ? '#6044d0' : '#fff',
    color: state.isSelected ? '#fff' : '#333',
    cursor: 'pointer',
  }),
  control: (provided: any) => ({
    ...provided,
    boxShadow: 'none',
    borderColor: '#ddd',
    '&:hover': {
      boxShadow: 'none',
      borderColor: '#ddd',
    },
  }),
}
