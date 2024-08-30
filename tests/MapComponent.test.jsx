import { render, screen } from '@testing-library/react';
import { MapComponent } from '../src/components/Map/MapComponent';


describe('MapComponent', () => {
const mockMarkers = [
    {
        props: {
            position: [51.505, -0.09],
            children: {
                props: {
                    place: {
                        data: {
                            accessible_by: ['pedestrians', 'cars'],
                            type_of_place: 'big bridge'
                        },
                        metadata: {
                            UUID: 'hidden'
                        },
                        position: [51.505, -0.09],
                        subtitle: 'big bridge',
                        title: 'Grunwaldzki'
                    }
                }
            }
        }
    },
    {
        props: {
            position: [51.515, -0.1],
            children: {
                props: {
                    place: {
                        data: {
                            accessible_by: ['pedestrians', 'cars'],
                            type_of_place: 'big bridge'
                        },
                        metadata: {
                            UUID: 'hidden'
                        },
                        position: [51.515, -0.1],
                        subtitle: 'big bridge',
                        title: 'Most Grunwaldzki'
                    }
                }
            }
        }
    }
];

    it('renders without crashing', () => {
        render(<MapComponent markers={mockMarkers} />);
        expect(screen.getByRole('presentation')).toBeInTheDocument();
    });

    it('renders the correct number of markers', () => {
        render(<MapComponent markers={mockMarkers} />);
        expect(screen.getAllByRole('img')).toHaveLength(mockMarkers.length);
    });

    it('does not render zoom control on the left', () => {
        render(<MapComponent markers={mockMarkers} />);
        const zoomInButton = screen.getByTitle('Zoom in');
        const zoomOutButton = screen.getByTitle('Zoom out');
        expect(zoomInButton.parentElement.style.position).not.toBe('topleft');
        expect(zoomOutButton.parentElement.style.position).not.toBe('topleft');
    });

    it('renders zoom control on the right', () => {
        render(<MapComponent markers={mockMarkers} />);
        const zoomInButton = screen.getByTitle('Zoom in');
        const zoomOutButton = screen.getByTitle('Zoom out');
        expect(zoomInButton.parentElement.style.position).toBe('topright');
        expect(zoomOutButton.parentElement.style.position).toBe('topright');
    });

    it('renders LocationControl component', () => {
        render(<MapComponent markers={mockMarkers} />);
        expect(screen.getByText('Location')).toBeInTheDocument();
    });

    it('throws an error when markers prop is missing', () => {
        console.error = jest.fn();
        expect(() => render(<MapComponent />)).toThrowError();
        expect(console.error).toHaveBeenCalled();
    });

    it('does not throw an error when markers prop is an empty array', () => {
        console.error = jest.fn();
        expect(() => render(<MapComponent markers={[]} />)).not.toThrowError();
        expect(console.error).not.toHaveBeenCalled();
    });
});
