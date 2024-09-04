import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { ReportProblemForm } from '../src/components/MarkerPopup/ReportProblemForm';

jest.mock('axios');
const axios = require('axios');
axios.get.mockResolvedValue({ data: { csrf_token: 'test-csrf-token' } });
axios.post.mockResolvedValue({ data: { success: true } });

describe('ReportProblemForm', () => {
    it('submits the form with selected problem type', async () => {
        const { getByText, getByLabelText } = render(<ReportProblemForm placeId="test-id" />);
        const select = getByLabelText(/Problem:/i);
        fireEvent.change(select, { target: { value: "it's broken" } });

        axios.get.mockResolvedValue({ data: { csrf_token: 'test-csrf-token' } });
        axios.post.mockResolvedValue({ data: { success: true } });

        fireEvent.click(getByText(/Submit/i));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                '/api/report-location',
                { description: "it's broken", id: 'test-id' },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': 'test-csrf-token',
                    },
                },
            );
        });
    });

    it('submits the form with custom problem description', async () => {
        const { getByText, getByLabelText } = render(<ReportProblemForm placeId="test-id" />);
        const select = getByLabelText(/Problem:/i);
        fireEvent.change(select, { target: { value: 'other' } });
        const input = getByLabelText(/Please describe:/i);
        fireEvent.change(input, { target: { value: 'Custom problem' } });
        fireEvent.click(getByText(/Submit/i));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                '/api/report-location',
                { description: 'Custom problem', id: 'test-id' },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': 'test-csrf-token',
                    },
                },
            );
        });
    });
});
