import React from 'react';
import Modal from 'react-modal';

const buttonStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#3d91e5',
    color: '#ffffff',
    fontSize: '24px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease-in-out',
    border: 'none',
};

export const SuggestNewPointButton = () => {
    const [location, setLocation] = React.useState(null);
    const [photo, setPhoto] = React.useState(null);
    const [showModal, setShowModal] = React.useState(false);

    const handleClick = () => {
        // Ask the user for their location
        // eslint-disable-next-line no-undef
        const { navigator } = window;
        console.log('xs', navigator.geolocation);
        if (navigator.geolocation) {
            console.log('xsxcx');

            navigator.geolocation.getCurrentPosition(
                position => {
                    // handle success case
                    const { latitude, longitude } = position.coords;
                    console.log('location', latitude, longitude);
                    // setLocation({ latitude, longitude });
                },
                error => {
                    console.log('err', error);
                    // handle error case
                },
            );
        } else {
            console.log('err, geolocation not supported');
            // Geolocation is not supported by this browser
        }
        console.log('cdsdc');

        // const currentPosition = await new Promise((resolve, reject) => {
        //     navigator.geolocation.getCurrentPosition(resolve, reject);
        // });
        // setLocation(currentPosition);
        // Take a photo with the user's camera
        // const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        // const newPhoto = document.createElement('img');
        // newPhoto.src = URL.createObjectURL(stream);
        // setPhoto(newPhoto);
        // Show the modal
        // setShowModal(true);
    };

    const handleConfirm = async () => {
        // Send the photo and location to the server
        const data = { location, photo };
        // const response = await axios.post('/api/issue', data);
        // Handle the response from the server

        setShowModal(false);
    };

    const handleCancel = () => setShowModal(false);

    return (
        <>
            <button style={buttonStyle} onClick={handleClick}>
                +
            </button>
            <Modal isOpen={showModal}>
                <div>
                    <p>Your location: {location}</p>
                    {/* {photo && <img src={photo.src} />} */}
                </div>
                <button onClick={handleConfirm}>Confirm</button>
                <button onClick={handleCancel}>Cancel</button>
            </Modal>
        </>
    );
    // return (
    //   <button onClick={() => alert("xd")}  >XDDD</button>
    // )
};
