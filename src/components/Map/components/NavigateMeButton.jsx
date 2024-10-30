import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import styled from 'styled-components';

const NavigateMeButton = ({ onClick }) => {
    const { t } = useTranslation();
    return (
        <Wrapper>
            <Button
                id="navigateMeButton"
                onClick={onClick}
                style={{
                    backgroundColor: window.SECONDARY_COLOR,
                }}
                variant="contained"
            >
                {t('navigateMe')}
            </Button>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    position: absolute;
    width: 100px;
    bottom: 20px;
    left: 10px;
    z-index: 9999999;
    @media only screen and (max-width: 768px) {
        width: 200px;
    }
`;

export default NavigateMeButton;
