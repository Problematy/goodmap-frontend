import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { ReportProblemForm } from '../../src/components/MarkerPopup/ReportProblemForm';

jest.mock('axios');
const axios = require('axios');

axios.post.mockResolvedValue({ data: { success: true } });

// Mock CSRF token meta tag
beforeEach(() => {
    const metaTag = document.createElement('meta');
    metaTag.setAttribute('name', 'csrf-token');
    metaTag.setAttribute('content', 'test-csrf-token');
    document.head.appendChild(metaTag);
});

afterEach(() => {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    if (metaTag) {
        metaTag.remove();
    }
    delete globalThis.LOCATION_SCHEMA;
});

describe('ReportProblemForm', () => {
    it('submits the form with selected problem type', () => {
        const { getByText, getByLabelText } = render(<ReportProblemForm placeId="test-id" />);
        const select = getByLabelText(/What's the problem\?/i);
        fireEvent.change(select, { target: { value: 'broken' } });

        fireEvent.click(getByText(/Submit/i));

        return waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                '/api/report-location',
                { description: 'broken', id: 'test-id' },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': 'test-csrf-token',
                    },
                },
            );
        });
    });

    it('submits the form with custom problem description', () => {
        const { getByText, getByLabelText } = render(<ReportProblemForm placeId="test-id" />);
        const select = getByLabelText(/What's the problem\?/i);
        fireEvent.change(select, { target: { value: 'other' } });
        const input = getByLabelText(/Please describe:/i);
        fireEvent.change(input, { target: { value: 'Custom problem' } });
        fireEvent.click(getByText(/Submit/i));

        return waitFor(() => {
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

    it('does not render submit button when no problem type is selected', () => {
        const { queryByText, getByLabelText } = render(<ReportProblemForm placeId="test-id" />);

        const select = getByLabelText(/What's the problem\?/i);
        expect(select.value).toBe('');

        const submitButton = queryByText(/Submit/i);
        expect(submitButton).toBeNull();
    });

    it('renders dynamic issue types from LOCATION_SCHEMA', () => {
        globalThis.LOCATION_SCHEMA = {
            reported_issue_types: [
                { value: 'under construction', label: 'Under Construction' },
                { value: 'has a hole', label: 'Has a Hole' },
            ],
        };
        const { getByLabelText, getByText, queryByText } = render(
            <ReportProblemForm placeId="test-id" />,
        );

        const select = getByLabelText(/What's the problem\?/i);
        const options = Array.from(select.querySelectorAll('option'));
        const optionTexts = options.map(o => o.textContent);

        expect(optionTexts).toContain('Under Construction');
        expect(optionTexts).toContain('Has a Hole');
        expect(getByText('other')).toBeTruthy();
        // Default hardcoded options should NOT be present
        expect(queryByText("this point is not here")).toBeNull();
        expect(queryByText("it's overloaded")).toBeNull();
        expect(queryByText("it's broken")).toBeNull();
    });

    it('submits dynamic issue type value as description', () => {
        globalThis.LOCATION_SCHEMA = {
            reported_issue_types: [
                { value: 'under construction', label: 'Under Construction' },
                { value: 'has a hole', label: 'Has a Hole' },
            ],
        };
        const { getByText, getByLabelText } = render(<ReportProblemForm placeId="test-id" />);
        const select = getByLabelText(/What's the problem\?/i);
        fireEvent.change(select, { target: { value: 'under construction' } });
        fireEvent.click(getByText(/Submit/i));

        return waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                '/api/report-location',
                { description: 'under construction', id: 'test-id' },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': 'test-csrf-token',
                    },
                },
            );
        });
    });

    it('falls back to default options when LOCATION_SCHEMA is undefined', () => {
        delete globalThis.LOCATION_SCHEMA;
        const { getByLabelText, getByText } = render(<ReportProblemForm placeId="test-id" />);

        const select = getByLabelText(/What's the problem\?/i);
        const options = Array.from(select.querySelectorAll('option'));
        const optionTexts = options.map(o => o.textContent);

        expect(getByText("this point is not here")).toBeTruthy();
        expect(getByText("it's overloaded")).toBeTruthy();
        expect(getByText("it's broken")).toBeTruthy();
        expect(getByText("other")).toBeTruthy();
    });

    it('falls back to default options when reported_issue_types is empty', () => {
        globalThis.LOCATION_SCHEMA = { reported_issue_types: [] };
        const { getByText } = render(<ReportProblemForm placeId="test-id" />);

        expect(getByText("this point is not here")).toBeTruthy();
        expect(getByText("it's overloaded")).toBeTruthy();
        expect(getByText("it's broken")).toBeTruthy();
    });
});
