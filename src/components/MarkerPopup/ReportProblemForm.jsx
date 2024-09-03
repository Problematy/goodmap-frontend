import React, { useState } from 'react';

export const ReportProblemForm = ({ placeId }) => {
    const [problem, setProblem] = useState('');
    const [problemType, setProblemType] = useState('');

    const handleSubmit = async event => {
        event.preventDefault();

        const response = await fetch('/api/report-location', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: placeId,
                description: problemType === 'other' ? problem : problemType,
            }),
        });

        if (response.ok) {
            // TODO add snackbar with success message
        } else {
            // TODO add snackbar with failing to report problem
            console.log('Failed to report problem');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Problem:
                <select value={problemType} onChange={e => setProblemType(e.target.value)}>
                    <option value="">--Please choose an option--</option>
                    <option value="this point is not here">This point is not here</option>
                    <option value="it's overloaded">It's overloaded</option>
                    <option value="it's broken">It's broken</option>
                    <option value="other">Other</option>
                </select>
            </label>
            {problemType === 'other' && (
                <label>
                    Please describe:
                    <input
                        type="text"
                        name="problem"
                        value={problem}
                        onChange={e => setProblem(e.target.value)}
                    />
                </label>
            )}
            <input type="submit" value="Submit" />
        </form>
    );
};
