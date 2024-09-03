import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const Label = styled.label`
    display: flex;
    flex-direction: column;
    font-size: 1rem;
`;

const Select = styled.select`
    padding: 5px;
    font-size: 1rem;
`;

const Input = styled.input`
    padding: 5px;
    font-size: 1rem;
`;

const SubmitButton = styled.input`
    padding: 10px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;

    &:hover {
        background-color: #0056b3;
    }
`;

export const ReportProblemForm = ({ placeId }) => {
    const [problem, setProblem] = useState('');
    const [problemType, setProblemType] = useState('');

    const fetchCsrfToken = async () => {
        const response = await fetch('/api/generate-csrf-token');
        const data = await response.json();
        return data.csrf_token;
    };

    const handleSubmit = async event => {
        event.preventDefault();
        const csrfToken = await fetchCsrfToken();

        const response = await fetch('/api/report-location', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify({
                id: placeId,
                description: problemType === 'other' ? problem : problemType,
            }),
        });
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Label>
                Problem:
                <Select value={problemType} onChange={e => setProblemType(e.target.value)}>
                    <option value="">--Please choose an option--</option>
                    <option value="this point is not here">This point is not here</option>
                    <option value="it's overloaded">It's overloaded</option>
                    <option value="it's broken">It's broken</option>
                    <option value="other">Other</option>
                </Select>
            </Label>
            {problemType === 'other' && (
                <Label>
                    Please describe:
                    <Input
                        type="text"
                        name="problem"
                        value={problem}
                        onChange={e => setProblem(e.target.value)}
                    />
                </Label>
            )}
            <SubmitButton type="submit" value="Submit" />
        </Form>
    );
};

ReportProblemForm.propTypes = {
  placeId: PropTypes.string.isRequired
};
