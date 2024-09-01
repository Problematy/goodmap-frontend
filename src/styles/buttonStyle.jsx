const commonStyle = {
    width: '50px',
    height: '50px',
    minWidth: '50px',
    borderRadius: '50%',
    backgroundColor: window.SECONDARY_COLOR,
    color: 'white',
    fontSize: '24px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease-in-out',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0',
    lineHeight: '1',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
};

export const buttonStyle = { ...commonStyle };

export const zoomButtonStyle = {
    ...commonStyle,
    width: '100px',
    minWidth: '100px',
    borderRadius: '10%',
    fontSize: '30px',
};
