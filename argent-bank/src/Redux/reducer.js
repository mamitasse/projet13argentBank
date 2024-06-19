const initialState = {
    user: {
      firstName: '',
      lastName: '',
      email: '',
    },
  };
  
  const userReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SIGN_IN':
        return {
          ...state,
          user: {
            ...action.payload,
          },
        };
      case 'SIGN_OUT':
        return {
          ...state,
          user: {
            firstName: '',
            lastName: '',
            email: '',
          },
        };
      default:
        return state;
    }
  };
  
  export default userReducer;
  