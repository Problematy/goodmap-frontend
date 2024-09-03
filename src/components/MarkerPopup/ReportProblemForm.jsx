import React, { useState } from 'react';

export const ReportProblemForm = ({ placeId }) => {
    const [problem, setProblem] = useState('');
    const handleSubmit = async event => {
        event.preventDefault();

        const response = await fetch('/api/report-location', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: placeId,
                description: problem,
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
                <input
                    type="text"
                    name="problem"
                    value={problem}
                    onChange={e => setProblem(e.target.value)}
                />
            </label>
            <input type="submit" value="Submit" />
        </form>
    );
};
